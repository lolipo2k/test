import { DefaultDto } from './../../dto/default.dto';
import { CreateUsersDto } from './../../users/dto/create-users.dto';
import { NotificationStatus, NotificationType } from './../interface';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto extends DefaultDto {
    @ApiProperty({ example: 'Заголовок', description: 'Заголовок' })
    title: string;

    @ApiProperty({ example: 'Описание', description: 'Описание' })
    description: string;

    @ApiProperty({ enum: NotificationStatus, example: NotificationStatus.IsSent, description: 'Роль' })
    status: NotificationStatus;

    @ApiProperty({ type: Boolean, example: false, description: 'Просмотрена?' })
    isView: boolean;
    
    @ApiProperty({ type: Boolean, example: true, description: ' Отправлена?' })
    isSend: boolean;

    @ApiProperty({ enum: NotificationType, example: NotificationType.TEXT, description: 'Типо уведомления?' })
    type?: NotificationType;
}

export class FullNotificationDto extends NotificationDto {
    @ApiProperty({ type: () => CreateUsersDto, description: 'Пользователь' })
    user: CreateUsersDto;
}

export class CreateNotificationDto {
    @ApiProperty({ example: '123123123', description: 'Ключ для уведомлений' })
    notificationKey: string;

    @ApiProperty({ example: 'Заголовок', description: 'Заголовок уведомлений' })
    title: string;

    @ApiProperty({ example: 'Описание', description: 'Описание уведомлений' })
    description: string;

    @ApiProperty({ enum: NotificationType, nullable: true, description: 'Тип задачи' })
    type?: NotificationType;
}
