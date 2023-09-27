import {
  Body,
  Controller,
  Delete, Get,
  Headers,
  Param,
  Patch,
  Post, Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { LibraryFilesService } from './library-files.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation, ApiParam, ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {FileInterceptor} from '@nestjs/platform-express';
import {ResponseLibraryFiles, ResponseLibraryFilesList, ResponseLibraryListDto} from './dto/response-library-files.dto';
import {ParamsId, Result} from '../dto/response.dto';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import {FileType} from './interface';
import { CreateLibraryFilesDto } from './dto/create-library-files.dto';

@ApiTags('Файловая система')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('library-files')
export class LibraryFilesController {
  constructor(private readonly libraryFilesService: LibraryFilesService) {
  }

  @ApiOperation({ summary: 'Загрузка файла' })
  @ApiResponse({ status: 201, type: ResponseLibraryFiles })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        parent: {
          type: 'number',
          nullable: true,
        }
      },
    },
  })
  @Post('upload')
  async uploadFile(@UploadedFile() file: Express.Multer.File,  @Headers() header, @Body() body: {parent: number}) {
    return await this.libraryFilesService.uploadFile(file, header.authorization, body.parent);
  }

  @ApiOperation({ summary: 'Список директорий' })
  @ApiResponse({ status: 200, type: ResponseLibraryListDto }) 
  @ApiQuery({name: 'page', type: Number, required: true, description: 'Страница'})
  @ApiQuery({name: 'search', type: String, required: false, description: 'Название директории'})
  @Get('list-directory')
  getListDirectory(@Query() query: {page: number, search: string}): Promise<Result> {
    return this.libraryFilesService.getListDirectory(query.page, query.search);
  }

  @ApiOperation({ summary: 'Список файлов у директории' })
  @ApiResponse({ status: 200, type: ResponseLibraryFilesList }) 
  @ApiQuery({name: 'directory', type: Number, required: true, description: 'Директория'})
  @Get('files-for-directory')
  getFilesForDirectory(@Query() query: {directory: number}): Promise<ResponseLibraryFilesList> {
    return this.libraryFilesService.getFilesForDirectory(query.directory);
  }

  @ApiOperation({ summary: 'Создание директории' })
  @ApiResponse({ status: 201, type: ResponseLibraryFiles })
  @Post()
  create(@Body() body: CreateLibraryFilesDto): Promise<ResponseLibraryFiles> {
    return this.libraryFilesService.create(body);
  }

  @ApiOperation({ summary: 'Удаление файла' })
  @ApiResponse({ status: 200, type: Result })
  @ApiParam({name: 'id', type: Number, required: true, description: 'ID раздела'})
  @Delete(':id')
  delete(@Param() params): Promise<Result> {
    return this.libraryFilesService.deleteFile(Number(params.id));
  }

  @ApiOperation({ summary: 'Список файлов' })
  @ApiResponse({ status: 200, type: ResponseLibraryListDto }) 
  @ApiQuery({name: 'page', type: Number, required: true, description: 'Страница'})
  @ApiQuery({name: 'directory', type: Number, required: false, description: 'Директория'})
  @ApiQuery({name: 'fileName', type: String, required: false, description: 'Название файла'})
  @ApiQuery({name: 'type', enum: FileType, required: false, description: 'Тип файла'})
  @Get()
  get(@Query() query: {page: number, directory: number | undefined, fileName: string | null, type: FileType | null}): Promise<ResponseLibraryListDto> {
    return this.libraryFilesService.get(Number(query.page), query.directory, query.fileName, query.type);
  }

  @ApiOperation({ summary: 'Получение одого файла' })
  @ApiResponse({ status: 200, type: ResponseLibraryFiles })
  @ApiParam({name: 'id', type: Number, required: true, description: 'ID'})
  @Get(':id')
  getOne(@Param() params: ParamsId): Promise<ResponseLibraryFiles> {
    return this.libraryFilesService.getOne(Number(Number(params.id)));
  }

  @ApiOperation({ summary: 'Обновление название файла' })
  @ApiResponse({ status: 200, type: Result }) 
  @ApiParam({name: 'id', type: Number, required: true, description: 'ID'})
  @ApiQuery({name: 'name', type: String, required: true, description: 'Страница'})
  @Patch(':id')
  update(@Param() params: ParamsId, @Query() query: {name: string}): Promise<Result> {
    return this.libraryFilesService.update(Number(params.id), query.name);
  }
}
