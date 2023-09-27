import { NodeMailerService } from './../../node-mailer/node-mailer.service';
import { Result } from './../../dto/response.dto';
import { ResponseUsersListDto, ParamsPageSortUser, SortUser } from './../dto/response-users.dto';
import { Repository, ILike, IsNull } from 'typeorm';
import { UsersEntity } from './../entities/usres.entity';
import { Inject, Injectable, UnauthorizedException, forwardRef, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  CreateUsersDto, FullUsersDto, UpdateUsersDto, UsersDto } from '../dto/create-users.dto';
import { ResponseUsersDto } from '../dto/response-users.dto';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../auth/auth.service';
import { UsersContactsService } from './users-contacts.service';
import { PersonalAccountService } from 'src/personal-account/service/personal-account.service';
import { LibraryFilesService } from 'src/library-files/library-files.service';

// Соль для кеширования пароля
const saltOrRounds = 10;

@Injectable()
export class UsersService {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        // Инцелизируем таблицу для простых запросов
        @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
        private usersContactsService: UsersContactsService,
        private personalAccountService: PersonalAccountService,

        @Inject(forwardRef(() => LibraryFilesService))
        private readonly libaryFilresService: LibraryFilesService,
    ) { }

    // Создание пользователя
    async create(body: CreateUsersDto): Promise<ResponseUsersDto> {
        // Генерируем хеш пароля
        //Проверяем по email есть ли такой пользователь 
        const user = await this.getFindEmail(body.email);
        if (user) {
            return { 
                isSuccess: false, 
                message: 'Такой пользователь уже существует' 
            };
        }
        const hash = await bcrypt.hash(body.password, saltOrRounds);

        const entity: FullUsersDto = this.usersRepository.create({
            ...body,
            password: hash,
        });
        await this.usersRepository.save(entity);
        // Прикрпление счет
        const pesonalAccount = (await this.personalAccountService.create()).entity;

        await this.usersRepository.save({
            ...entity,
            pesonalAccount
        });

        return { 
            isSuccess: true, 
            entity 
        };
    }

    // Обновление пользователя
    // eslint-disable-next-line max-lines-per-function
    async update(body: UpdateUsersDto, req): Promise<ResponseUsersDto> {
        // Проверяем кол-во выбранных контактов
        if (body.contacts && body.contacts.length) {
            let count = 0;
            body.contacts.forEach((el) => {
                if (el.isView) {
                    count++;
                }
            })
            if (count > 2) {
                return {isSuccess: false, message: 'Выбранных контактов больше 2'};
            }
        }

        const user = (await this.getCurrentInfo(req)).entity;
        let entity: FullUsersDto = await (await this.getOne(user.id)).entity;


        const userByEmail = await this.getUserByEmail(body.email);
        if (userByEmail && userByEmail.id !== entity.id) {
            return {isSuccess: false, message: 'Пользователь с таким E-mail уже существует'};
        }

        // Изменение пароль
        if (body.password && body.oldPassword) {
            const isMatchPassword = await this.authService.isMatchPassword(body.oldPassword, entity.password);
            if (!isMatchPassword) {
                return {isSuccess: false, message: 'Вы ввели не верный старый пароль'};
            }
            const hash = await bcrypt.hash(body.password, saltOrRounds);
            body.password = hash;
        }

        const newIds = body.contacts?.filter((el) => el.id).map((el) => el.id);
        const oldIds = await this.usersContactsService.getIdContacts(user.id);
        const ids = oldIds.filter((el) => !newIds.includes(el));
        if (ids.length) {
            await this.usersContactsService.deleteIdsContacts(ids);
        }

        const updateContacts = body.contacts?.filter((el) => el.id);
        if (updateContacts && updateContacts.length) {
            await this.usersContactsService.updateContacts(updateContacts);
        }
        const newContacts = body.contacts?.filter((el) => !el.id);
        if (newContacts && newContacts.length) {
            await this.usersContactsService.createContacts(newContacts.map((el) => {
                return {
                    ...el,
                    user
                };
            }));
        }

        const contacts = (await this.usersContactsService.getContactsUsers(user.id)).entity;
       
        entity = {
            ...entity,
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            middleName: body.middleName,
            birthday: body.birthday,
            contacts: contacts
        };
        await this.usersRepository.save(entity);
        
        return { 
            isSuccess: true, 
            entity 
        };
    }

    // Список пользователей
    async get(body: ParamsPageSortUser): Promise<ResponseUsersListDto> {
        const take = Number(body.limit);
        const skip = body.page === 1 ? 0 : (Number(body.page) - 1) * take;
        const query = this.usersRepository.createQueryBuilder('user').take(take).skip(skip)
        .select(['user.id', 'user.isActive', 'user.email', 'user.firstName', 'user.lastName', 'user.middleName', 'user.role', 
        'user.birthday', 'user.verificationStatus', 'user.notificationKey', 'user.rating']);
        if (body.search) {
            query.orWhere({
                firstName: ILike(`%${body.search}%`)
            }).orWhere({
                lastName: ILike(`%${body.search}%`)
            }).orWhere({
                middleName: ILike(`%${body.search}%`)
            }).orWhere({
                email: ILike(`%${body.search}%`)
            });
        }

        if (body.sortUser && body.sortUser === SortUser.Email) {
            query.orderBy('user.email', 'ASC');
        }
        if (body.sortUser && body.sortUser === SortUser.FirstName) {
            query.orderBy('user.firstName', 'ASC');
        }
        if (body.sortUser && body.sortUser === SortUser.LastName) {
            query.orderBy('user.lastName', 'ASC');
        }
        if (body.sortUser && body.sortUser === SortUser.MiddleName) {
            query.orderBy('user.middleName', 'ASC');
        }
        if (body.sortUser && body.sortUser === SortUser.Role) {
            query.orderBy('user.role', 'ASC');
        }

        const result = await query.getMany();

        const entity: ResponseUsersListDto = {
            isSuccess: true,
            entity: {
                count: await query.getCount(),
                entity: result
            }
        };

        return { ...entity };
    }

    async getOneNotificationKey(notificationKey: string): Promise<ResponseUsersDto> {
        const { password, ...entity } = await this.usersRepository.findOne({
            where: {
                notificationKey,
            }
        });

        return {
            isSuccess: true,
            entity
        };
    }

    // Поиско пользователя по почте
    async getOne(id: number): Promise<ResponseUsersDto> {
        try {
        
            const entity = await this.usersRepository.createQueryBuilder('user')
            .select(['user.id', 'user.email', 'user.firstName', 'user.lastName', 'user.middleName', 'user.role', 'user.verificationStatus', 'user.notificationKey', 'user.rating'])
            .innerJoin('user.pesonalAccount', 'pesonalAccount')
            .addSelect(['pesonalAccount.id', 'pesonalAccount.amount'])
            .leftJoinAndSelect('user.photo', 'photo')
            .leftJoinAndSelect('user.contacts', 'contacts')
            // .addSelect(['contacts.id', 'contacts.content', 'contacts.typeContent', 'contacts.isView'])
            .where({
                deletedAt: IsNull(),
            })
            .andWhere(`user.id = ${id}`)
            .getOne();
            
            if (entity.photo) {
                entity.photo.path = await this.libaryFilresService.getUrlCloud(entity.photo.filename);
            }

            return {
                isSuccess: true,
                entity
            };
        } catch (e) {
            console.log(e);
            return {
                isSuccess: false
            };
        }
    }

    // Поиско пользователя по почте
    async getFindEmail(email: string): Promise<FullUsersDto | undefined> {
        return this.usersRepository.findOne({
            where: {
                email
            }
        });
    }

    // Удаление раздела
    async delete(id: number) {
        try {
            await this.usersRepository.softDelete(id);
            return { 
                isSuccess: true, 
            };
        } catch (e) {
            return { 
                isSuccess: false, 
                message: 'Запись не удалена' 
            };
        }
    }

    async updatePassword(user: CreateUsersDto, password: string): Promise<boolean> {
        const entity = await this.usersRepository.findOne({
            where: {
                id: user.id,
                deletedAt: IsNull()
            }
        });

        const hash = await bcrypt.hash(password, saltOrRounds);

        entity.password = hash;

        await this.usersRepository.save(entity);

        return true;
    }

    // Получение информации о текущем пользователе
    async getCurrentInfo(req): Promise<ResponseUsersDto>  {
        const header = req.headers.authorization;
        const bearer = header.split(' ')[0];
        const token = header.split(' ')[1];

        if (bearer !== 'Bearer' && !token) {
            throw new UnauthorizedException({
                message: 'Вы не авторизованы',
                isSuccess: false,
              });
        }
    
        const { id } = this.authService.verifyToken(token);
        const entity = await (await this.getOne(id)).entity;

        return {
            isSuccess: true,
            entity
        };
    }

    // Получение пользователя по email
    async getUserByEmail(email: string): Promise<UsersDto> {
        const user = await this.usersRepository.createQueryBuilder('user')
        .select(['user.id', 'user.email', 'user.deletedAt'])
        .where({
            email,
        }).andWhere({
            deletedAt: IsNull()
        }).getOne();

        return user;
    }
}
