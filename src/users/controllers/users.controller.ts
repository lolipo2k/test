import { ApiExceptionDecorators } from './../../decorators/exception-decorators';
import { JwtAuthGuard } from './../../auth/jwt-auth.guard';
import { ParamsId, Result, ParamsPage } from './../../dto/response.dto';
import { ResponseUsersListDto, SortUser, ParamsPageSortUser } from './../dto/response-users.dto';
import { FullUsersDto, UpdateUsersDto } from './../dto/create-users.dto';
import { UsersService } from '../services/users.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ResponseUsersDto } from '../dto/response-users.dto';
import { JwtAdminGuard } from 'src/auth/jwt-admin.guard';

@ApiTags('Пользователи')
@ApiExceptionDecorators()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @ApiOperation({ summary: 'Получение информации о текущем пользователе' })
  @ApiResponse({ status: 200, type: ResponseUsersDto })
  @Get('/currentUser')
  getCurrentInfo(@Req() req): Promise<ResponseUsersDto> {
      return this.usersService.getCurrentInfo(req);
  }

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 201, type: ResponseUsersDto })
  @Post()
  create(@Body() body: FullUsersDto): Promise<ResponseUsersDto> {
      return this.usersService.create(body);
  }

  @ApiOperation({ summary: 'Обновление пользователя' })
  @ApiResponse({ status: 200, type: ResponseUsersDto })
  @Patch()
  update(@Body() body: UpdateUsersDto, @Req() req): Promise<ResponseUsersDto> {
      return this.usersService.update(body, req);
  }

  @ApiOperation({ summary: 'Список пользователей' })
  @ApiResponse({ status: 200, type: ResponseUsersListDto })
  @ApiUnauthorizedResponse({status: 401, description: 'Вы не авторизованы' })
  @ApiQuery({name: 'search', type: String, required: true, description: 'Поиск'})
  @ApiQuery({name: 'page', type: Number, required: true, description: 'Страница'})
  @ApiQuery({name: 'limit', type: Number, required: true, description: 'Кол-во страниц'})
  @ApiQuery({name: 'sortUser', enum: SortUser, required: false, description: 'Сортировка'})
  @UseGuards(JwtAdminGuard)
  @Get()
  get(@Query() query: ParamsPageSortUser): Promise<ResponseUsersListDto> {
      return this.usersService.get(query);
  }

  @ApiOperation({ summary: 'Получение одного пользователя' })
  @ApiResponse({ status: 200, type: ResponseUsersDto })
  @ApiParam({name: 'id', type: Number, required: true, description: 'ID'})
  @Get(':id')
  getOne(@Param() params: ParamsId): Promise<ResponseUsersDto> {
      return this.usersService.getOne(Number(params.id));
  }

  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiResponse({ status: 200, type: Result })
  @ApiParam({name: 'id', type: Number, required: true, description: 'ID пользователя'})
  @UseGuards(JwtAdminGuard)
  @Delete(':id')
  delete(@Param() params): Promise<Result> {
    return this.usersService.delete(Number(params.id));
  }
}
