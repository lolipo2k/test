import { Result, ResultPaginationsOptions } from './../../dto/response.dto';
import { FullNotificationDto, NotificationDto } from './create-notification.dto';
import { ApiProperty } from '@nestjs/swagger';


export class ResponseNotificationDto extends Result {
    @ApiProperty({ type: FullNotificationDto, nullable: true, description: 'Модель уведолмения' })
    entity?: FullNotificationDto;
}

export class NotificationOption extends ResultPaginationsOptions {
    @ApiProperty({ type: [NotificationDto], nullable: true, description: 'Список уведомлений' })
    entity: NotificationDto[];

    @ApiProperty({ type: Number, nullable: true, description: 'Кол-во не просмотренных уведомлений' })
    countIsView?: number;
}

export class ResultNotification extends Result {
    @ApiProperty({ type: [NotificationDto], nullable: true, description: 'Список уведомлений' })
    entity?: NotificationDto[];
}

export class ResponseNotificationListDto extends Result {
    @ApiProperty({ type: NotificationOption, nullable: true, description: 'Ответ' })
    entity?: NotificationOption;
}

export class ResponseCountNotification extends Result {
    @ApiProperty({ type: Number, nullable: true, description: 'Кол-во не просмотренных уведомлений' })
    entity?: number;
}