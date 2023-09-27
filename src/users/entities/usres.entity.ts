import { PersonalAccountEntity } from '../../personal-account/entities/pesonal-account.entity';
import { DefaultEntity } from './../../entity/default-entity';
import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { NotificationEntity } from 'src/notification/entity/notification.entity';
import { UsersContactsEntity } from './users-contacts.entity';
import { VerificationStatus } from '../interface';
import { LibraryFilesEntity } from 'src/library-files/entities/library-files.entity';
import { ConfirmUsersEntity } from './confirm-users.entity';

export enum UserRole {
    ADMIN = 'admin',
    GUEST = 'guest',
}

@Entity({
    name: 'users'
})
export class UsersEntity extends DefaultEntity {

    @ApiProperty({ example: true, description: 'Активный?' })
    @Column({ type: 'bool', default: true, nullable: false })
    isActive: boolean;

    @ApiProperty({ example: 'test@mail.ru', description: 'E-mail' })
    @Column({ length: 2048, nullable: false })
    email: string;

    @ApiProperty({ example: 'test123456789', description: 'Пароль' })
    @Column({ length: 2048, nullable: false })
    password: string;

    @ApiProperty({ example: 'Андрей', description: 'Имя' })
    @Column({ length: 2048, nullable: true })
    firstName: string;

    @ApiProperty({ example: 'Яковлев', description: 'Фамилия' })
    @Column({ length: 2048, nullable: true })
    lastName: string;

    @ApiProperty({ example: 'Сергеевич', description: 'Отчество' })
    @Column({ length: 2048, nullable: true })
    middleName: string;

    @ApiProperty({ enum: UserRole, example: UserRole.GUEST, description: 'Роль' })
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.GUEST,
    })
    role: UserRole;

    @ApiProperty({ type: Date, example: '2023-12-12', description: 'Дата рождения' })
    @Column({type: 'date', nullable: true })
    birthday: Date;

    @ApiProperty({ enum: VerificationStatus, example: VerificationStatus.NOTVERIFIED, description: 'Статус' })
    @Column({
        type: 'enum',
        enum: VerificationStatus,
        default: VerificationStatus.NOTVERIFIED,
    })
    verificationStatus: VerificationStatus;

    @ApiProperty({ description: 'UUID для notification' })
    @Column({ generated: 'uuid' })
    notificationKey: string;

    @ApiProperty({type: Number, example: 5, nullable: true, description: 'Рейтинг' })
    @Column({ type: 'float', nullable: true })
    rating: number;

    @ApiProperty({ description: 'Фотография' })
    @OneToOne(() => LibraryFilesEntity)
    @JoinColumn()
    photo: LibraryFilesEntity;

    @ApiProperty({ description: 'Файлы' })
    @OneToMany(() => LibraryFilesEntity, (dropzona) => dropzona.user)
    files: LibraryFilesEntity[];

    @ApiProperty({ description: 'Уведомления' })
    @OneToMany(() => NotificationEntity, (notification) => notification.user)
    notifications: NotificationEntity[];

    @ApiProperty({ description: 'Контакты' })
    @OneToMany(() => UsersContactsEntity, (contacts) => contacts.user)
    contacts: UsersContactsEntity[];

    @ApiProperty({ description: 'Личный счет' })
    @OneToOne(() => PersonalAccountEntity)
    @JoinColumn()
    pesonalAccount: PersonalAccountEntity;

    @ApiProperty({ description: 'Подтверждение' })
    @OneToMany(() => ConfirmUsersEntity, (confirm) => confirm.user)
    confirm: ConfirmUsersEntity[];
}
