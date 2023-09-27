import { buffer } from 'rxjs';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import {ResponseLibraryFiles, ResponseLibraryFilesList, ResponseLibraryListDto} from './dto/response-library-files.dto';
import {AuthService} from '../auth/auth.service';
import {UsersService} from '../users/services/users.service';
import {CreateUsersDto} from '../users/dto/create-users.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {ILike, IsNull, Repository} from 'typeorm';
import {LibraryFilesEntity} from './entities/library-files.entity';
import {FileType, FileTypeData, MainFile} from './interface';
import {CreateLibraryFilesDto} from './dto/create-library-files.dto';
import {Result} from '../dto/response.dto';
import * as Minio from 'minio';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class LibraryFilesService {
    private minioClient: Minio.Client;
    private bucketName: string;

    constructor(
        @InjectRepository(LibraryFilesEntity) private readonly libraryFilesRepository: Repository<LibraryFilesEntity>,
        private readonly configService: ConfigService,

        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,

        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {
        this.minioClient = new Minio.Client({
            endPoint: this.configService.get('MINIO_ENDPOINT'),
            port: Number(this.configService.get('MINIO_PORT')),
            useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
            accessKey: this.configService.get('MINIO_ACCESS_KEY'),
            secretKey: this.configService.get('MINIO_SECRET_KEY')
        });
        this.bucketName = this.configService.get('MINIO_BUCKET_NAME');
    }

    async getListDirectory(page: number, search: string | null = null): Promise<ResponseLibraryListDto> {
        const take = 10;
        const skip = page === 1 ? 0 : (page - 1) * take;
        const query = this.libraryFilesRepository.createQueryBuilder('library_files').skip(skip).take(take).andWhere({
            type: FileType.DIRECTORY
        });

        if (search) {
            query.andWhere({
                name: ILike(`%${search}%`)
            });
        }

        return {
            isSuccess: true,
            entity: {
                count: await query.getCount(),
                entity: await query.getMany()
            }
        };

    }

    // Буфер файла
    async getFileBuffer(filename: string) {
        return await this.minioClient.getObject(this.bucketName, filename)
    }

    // Получение url файла в облаке
    getUrlCloud(filename: string): string {
        return `${this.configService.get('MINIO_DOMEN')}:${this.configService.get('MINIO_PORT')}/${this.bucketName}/${filename}`;
    }

    // URL от MINIO с периодом жизни 7 дней
    async getPresignedUrl(filename: string): Promise<string> {
        console.log(await this.minioClient.getObject(this.bucketName, filename))
        return await this.minioClient.presignedUrl('GET', this.bucketName, filename)
    }

    // Загрузка файла
    async uploadFile(files: MainFile,  authorization: string, pareantID: number): Promise<ResponseLibraryFiles> {
        try {
            let user: CreateUsersDto | null = null;
            if (authorization) {
                const token = authorization.split(' ')[1];
                const userID = this.authService.decodeToken(token).id;
                user = await (await this.usersService.getOne(userID)).entity;
            }

            let parent: CreateLibraryFilesDto | null = null;
            if (pareantID) {
                parent = await this.libraryFilesRepository.findOne({
                    where: {
                        id: pareantID
                    }
                });
            }

            const timestamp = Date.now().toString();
            const hashedFileName = crypto .createHash('md5').update(timestamp).digest('hex');
            const extension = files.originalname.substring(
                files.originalname.lastIndexOf('.'),
                files.originalname.length,
            );
            const metaData = {
                'Content-Type': files.mimetype,
            };

            const fileName = hashedFileName + extension;

            await this.minioClient.putObject(
                this.bucketName, 
                fileName, 
                files.buffer, 
                metaData
            );

            const entity = this.libraryFilesRepository.create({
                name: files.originalname,
                filename: fileName,
                path: '',
                size: files.size,
                type: FileTypeData[files.mimetype],
                parent,
            });
            await this.libraryFilesRepository.save(entity);

            entity.path = this.getUrlCloud(entity.filename);

            return {isSuccess: true, entity};
        } catch (e) {
            return {isSuccess: false};
        }
    }

    async create(body: CreateLibraryFilesDto): Promise<ResponseLibraryFiles> {
        const entity = this.libraryFilesRepository.create(body);
        await this.libraryFilesRepository.save(entity);

        return {isSuccess: true, entity};
    } 

    // Удаление файла
    async deleteFile(id: number): Promise<Result> {
        try {
            const entity = await this.libraryFilesRepository.findOne({
                where: {
                    id
                }
            });
            if (!entity) {
                return { isSuccess: false, message: 'Файл не найден' };
            }

            if (entity.isSystem) {
                return { isSuccess: false, message: 'Нельзя удалить системную папку' };
            }

            entity.deletedAt = new Date();

            if (entity.type !== FileType.DIRECTORY) {
                await this.minioClient.removeObject(this.bucketName, entity.filename);
            }
            await this.libraryFilesRepository.save(entity);
            
            return { isSuccess: true };
        } catch (e) {
            console.log(e);
            return { isSuccess: false };
        }
    }

    // Список файлов
    async get(page: number, directory: number | undefined, fileName: string | null, type: FileType | null): Promise<ResponseLibraryListDto> {
        const take = 100;
        const skip = page === 1 ? 0 : (page - 1) * take;
        const query = this.libraryFilesRepository.createQueryBuilder('dropzona').skip(skip).take(take)
        .where({
            deletedAt: false,
        })
        .orderBy('dropzona.type', 'ASC');

        if (directory) {
            query.andWhere({
                parent: directory
            });
        } else {
            query.andWhere({
                parent: IsNull()
            });
        }

        if (fileName) {
            query.andWhere({
                name: ILike(`%${fileName}%`)
            });
        }

        if (type) {
            query.andWhere({
                type
            });
        }

        const library: any = await query.getMany();

        const entity: ResponseLibraryListDto = {
            isSuccess: true,
            entity: {
                count: await query.getCount(),
                entity: library
            }
        };

        return { ...entity };
    }

    // Получение одного файла по ID
    async getOne(id: number): Promise<ResponseLibraryFiles> {
      const entity = await this.libraryFilesRepository.findOne({
          where: {
              id,
              deletedAt: new Date(),
          },
          relations: ['parent', 'document', 'directoryArea']
      });
      if (!entity) {
          return {isSuccess: false, message:'Файл не найден'};
      }

      entity.path = this.getUrlCloud(entity.filename);
      return {isSuccess: true, entity};
    }
    
    async getFilesForDirectory(id: number): Promise<ResponseLibraryFilesList> {
        
        const query = this.libraryFilesRepository.createQueryBuilder('dropzona').leftJoinAndSelect('dropzona.parent', 'parent')
            .where({
                deletedAt: false,
            }).andWhere({
                parent: {
                    id
                }
            });

        let entity: CreateLibraryFilesDto[] = await query.getMany();
        entity = entity.map((el: CreateLibraryFilesDto) => {
            if (el.type !== FileType.DIRECTORY) {
                return {
                    ...el,
                    path: `${this.configService.get('MINIO_DOMEN')}:${this.configService.get('MINIO_PORT')}/${this.bucketName}/${el.filename}`
                };
            } else {
                return el;
            }
        });

        return {isSuccess: true, entity};
    }

    // Получение директории по id площадки
    async getDirectoryArea(areaId: number): Promise<ResponseLibraryFiles> {
        const query = this.libraryFilesRepository.createQueryBuilder('dropzona').leftJoinAndSelect('dropzona.directoryArea', 'directoryArea')
        .where({
            deletedAt: false,
        })
        .andWhere({
            directoryArea: {
                id: areaId
            }
        });
        const entity = await query.getOne();

        return {isSuccess: true, entity};
    }

    // Обновление название у файла
    async update(id: number, name: string): Promise<Result> {
        const entity = await this.libraryFilesRepository.findOne({
            where: {
                id
            }
        });
        if (!entity) {
            return {isSuccess: false, message: 'Файл не найден'};
        }

        entity.name = name;

        await this.libraryFilesRepository.save(entity);

        return {isSuccess: true};
    }
}
