import { UsersEntity } from './../../users/entities/usres.entity';
import { NotificationStatus, NotificationType } from './../interface';
import { Column, ManyToOne, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from './../../entity/default-entity';


@Entity({
    name: 'notifications'
})
export class NotificationEntity extends DefaultEntity {
    @ApiProperty({ example: 'Заголовок', description: 'Заголовок' })
    @Column({ length: 300, nullable: false })
    title: string;

    @ApiProperty({ example: 'Описание', description: 'Описание' })
    @Column({ length: 1024, nullable: false })
    description: string;

    @ApiProperty({ enum: NotificationStatus, example: NotificationStatus.IsSent, description: 'Статус' })
    @Column({
        type: 'enum',
        enum: NotificationStatus,
        default: NotificationStatus.IsSent,
    })
    status: NotificationStatus;

    @ApiProperty({ type: Boolean, example: false, description: 'Просмотрена?' })
    @Column({
        type: 'bool',
        default: false,
    })
    isView: boolean;

    @ApiProperty({ type: Boolean, example: true, description: 'Отправлена?' })
    @Column({
        type: 'bool',
        default: true,
    })
    isSend: boolean;

    @ApiProperty({ enum: NotificationType, example: NotificationType.TEXT, description: 'Типо уведомления?' })
    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.TEXT,
        nullable: true,
    })
    type: NotificationType;

    @ApiProperty({ description: 'Пользователь' })
    @ManyToOne(() => UsersEntity, (user) => user.notifications)
    user: UsersEntity;
}