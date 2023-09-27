import {  Result, ParamsIds, ParamsPageSearch } from './../dto/response.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { ResponseNotificationDto, ResponseNotificationListDto, ResultNotification, ResponseCountNotification } from './dto/response-notification.dto';
import { ApiExceptionDecorators } from './../decorators/exception-decorators';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { Controller, UseGuards, Post, Body, Get, Query, Patch, Req } from '@nestjs/common';
import { FullNotificationDto } from './dto/create-notification.dto';

@ApiTags('Уведомления')
@ApiExceptionDecorators()
@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService, 
 ) {}

  @ApiOperation({ summary: 'Кол-во не просмотренных уведомлений' })
  @ApiResponse({ status: 200, type: ResponseCountNotification})
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('count')
  countIsView(@Req() req): Promise<ResponseCountNotification> {
      return this.notificationService.countIsView(req);
  }

  @ApiOperation({ summary: 'Обновление статуса полученых уведомлений' })
  @ApiResponse({ status: 200, type: Result})
  @ApiBearerAuth()
  @ApiQuery({name: 'ids', type: Array, required: true, description: 'Ids'})
  @UseGuards(JwtAuthGuard)
  @Patch('update-is-send')
  updateIsSend(@Query() query: ParamsIds): Promise<Result> {
      return this.notificationService.updateIsSend(query.ids);
  }

  @ApiOperation({ summary: 'Создание уведомления' })
  @ApiResponse({ status: 201, type: ResponseNotificationDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: FullNotificationDto): Promise<ResponseNotificationDto> {
      return this.notificationService.create(body);
  }

  @ApiOperation({ summary: 'Список уведомлений пользователь' })
  @ApiResponse({ status: 200, type: ResponseNotificationListDto})
  @ApiBearerAuth()
  @ApiQuery({name: 'search', type: String, required: true, description: 'Поиск'})
  @ApiQuery({name: 'page', type: Number, required: true, description: 'Страница'})
  @ApiQuery({name: 'limit', type: Number, required: true, description: 'Кол-во страниц'})
  @UseGuards(JwtAuthGuard)
  @Get()
  get(@Query() query: ParamsPageSearch, @Req() req): Promise<ResponseNotificationListDto> {
      return this.notificationService.get(query, req);
  }
}