import { IsString, IsEmail, IsNotEmpty, IsDateString, IsEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/usres.entity';
import { DefaultDto } from 'src/dto/default.dto';
import { VerificationStatus } from '../interface';
import { CreateLibraryFilesDto } from 'src/library-files/dto/create-library-files.dto';
import { NotificationDto } from 'src/notification/dto/create-notification.dto';
import { UsersContactsDto } from './users-contacts/create-users-contacts.dto';
import { PersonalAccountDto } from 'src/personal-account/dto/personal-account/create-personal-account.dto';

export class CreateUsersDto extends DefaultDto {
    @ApiProperty({ example: true, nullable: false, description: 'Активный?' })
    isActive: boolean;

    @ApiProperty({ example: 'test@mail.ru', nullable: false, description: 'E-mail' })
    @IsNotEmpty({message: 'E-mail обязательное поле'})
    @IsString({message: 'E-mail должен быть строкой'})
    @IsEmail({}, {message: 'Некорректный email'})
    email: string;

    @ApiProperty({ example: 'test123456789', nullable: true, description: 'Пароль' })
    @IsNotEmpty({message: 'Пароль обязательное поле'})
    password?: string;

    @ApiProperty({ example: 'Андрей', nullable: true, description: 'Имя' })
    @IsNotEmpty({message: 'Имя обязательное поле'})
    firstName?: string;

    @ApiProperty({ example: 'Яковлев', nullable: true, description: 'Фамилия' })
    @IsNotEmpty({message: 'Фамилия обязательное поле'})
    lastName?: string;

    @ApiProperty({ example: 'Сергеевич', nullable: true, description: 'Отчество' })
    middleName?: string;

    @ApiProperty({ enum: UserRole, example: UserRole.GUEST, nullable: true, description: 'Отчество' })
    @IsNotEmpty({message: 'Обязательное поле'})
    role: UserRole;

    @ApiProperty({ enum: VerificationStatus, example: VerificationStatus.NOTVERIFIED, description: 'Статус' })
    verificationStatus: VerificationStatus;

    @ApiProperty({type: Number, example: 5, nullable: true, description: 'Рейтинг' })
    rating: number;

}

export class UsersDto extends CreateUsersDto {
    @ApiProperty({ type: Date, example: '2023-12-12T00:00:00', description: 'Дата рождения' })
    birthday: Date;

    @ApiProperty({ nullable: true, description: 'API key для уведомлений' })
    notificationKey?: string;
}

export class FullUsersDto extends UsersDto {
    @ApiProperty({ type: () => CreateLibraryFilesDto, nullable: true, description: 'Фотографии' })
    photo?: CreateLibraryFilesDto;

    @ApiProperty({ type: () => [CreateLibraryFilesDto], nullable: true, description: 'Фотографии' })
    files?: CreateLibraryFilesDto[];

    @ApiProperty({ type: () => [NotificationDto], nullable: true, description: 'Уведомления' })
    notifications?: NotificationDto[];

    @ApiProperty({ type: () => [UsersContactsDto], nullable: true, description: 'Контакты' })
    contacts?: UsersContactsDto[];

    @ApiProperty({ type: () => PersonalAccountDto, nullable: true, description: 'Личный счет' })
    pesonalAccount: PersonalAccountDto;

    // @ApiProperty({ description: 'Подтверждение' })
    // confirm?: ConfirmUsersEntity[];
}

export class UpdateUsersDto {
    @ApiProperty({ example: 'test@mail.ru', nullable: false, description: 'E-mail' })
    @IsNotEmpty({message: 'E-mail обязательное поле'})
    @IsString({message: 'E-mail должен быть строкой'})
    @IsEmail({}, {message: 'Некорректный email'})
    email: string;

    @ApiProperty({ example: 'test123456789', nullable: true, description: 'Старый пароль' })
    @IsOptional()
    @IsString({message: 'Старый пароль должен быть строкой'})
    oldPassword?: string;

    @ApiProperty({ example: 'test123456789', nullable: true, description: 'Пароль' })
    @IsOptional()
    @IsString({message: 'Пароль должен быть строкой'})
    password?: string;

    @ApiProperty({ example: 'Андрей', nullable: true, description: 'Имя' })
    @IsString({message: 'Имя должен быть строкой'})
    @IsNotEmpty({message: 'Имя обязательное поле'})
    firstName: string;

    @ApiProperty({ example: 'Яковлев', nullable: true, description: 'Фамилия' })
    @IsString({message: 'Фамилия должен быть строкой'})
    @IsNotEmpty({message: 'Фамилия обязательное поле'})
    lastName: string;

    @ApiProperty({ example: 'Сергеевич', nullable: true, description: 'Отчество' })
    @IsString({message: 'Отчество должен быть строкой'})
    middleName?: string;

    @ApiProperty({ type: Date, example: '2023-12-12T00:00:00', description: 'Дата рождения' })
    @IsDateString({}, {message: 'Дата рождения должна быть датой'})
    birthday: Date;

    @ApiProperty({ type: () => [UsersContactsDto], nullable: true, description: 'Контакты' })
    contacts?: UsersContactsDto[];
}