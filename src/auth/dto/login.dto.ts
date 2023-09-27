import { FullUsersDto } from './../../users/dto/create-users.dto';
import { Result } from './../../dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
    @ApiProperty({ type: String, example: 'test@mail.ru', nullable: false, description: 'E-mail' })
    @IsString({message: 'Email должен быть строкой'})
    @IsEmail({}, {message: 'Некорректный email'})
    email: string;

    @ApiProperty({ type: String, example: 'test123123123', nullable: false, description: 'Пароль' })
    @IsString({message: 'Пароль должен быть строкой'})
    @Length(4, 18, {message: 'Пароль не меньше 4 и не больще 18'})
    password: string;
}

export class ResultLoginOption {
    @ApiProperty({ type: String, nullable: false, description: 'Токен' })
    token: string;

    @ApiProperty({ type: FullUsersDto, nullable: false, description: 'Данные польователя' })
    entity: FullUsersDto;
}

export class ResultLogin extends Result {
    @ApiProperty({ type: ResultLoginOption, nullable: false, description: 'Ответ' })
    entity: ResultLoginOption;
}

export class RegisterDto {
    @ApiProperty({ type: String, example: 'test@mail.ru', nullable: false, description: 'E-mail' })
    @IsNotEmpty({message: 'E-mail обязательное поле'})
    @IsString({message: 'E-mail должен быть строкой'})
    @IsEmail({}, {message: 'Некорректный E-mail'})
    email: string;

    @ApiProperty({ type: String, example: 'test123123123', nullable: false, description: 'Пароль' })
    @IsNotEmpty({message: 'Пароль обязательное поле'})
    @IsString({message: 'Пароль должен быть строкой'})
    password: string;

    @ApiProperty({ example: 'Андрей', nullable: true, description: 'Имя' })
    @IsNotEmpty({message: 'Имя обязательное поле'})
    @IsString({message: 'Имя должен быть строкой'})
    firstName?: string;

    @ApiProperty({ example: 'Яковлев', nullable: true, description: 'Фамилия' })
    @IsNotEmpty({message: 'Фамилия обязательное поле'})
    @IsString({message: 'Фамилия должен быть строкой'})
    lastName?: string;

    @ApiProperty({ example: 'Сергеевич', nullable: true, description: 'Отчество' })
    middleName?: string;
}

export class ReplcaePasswordDto {
    @ApiProperty({ type: String, example: 'test@mail.ru', nullable: false, description: 'E-mail' })
    @IsNotEmpty({message: 'E-mail обязательное поле'})
    @IsString({message: 'E-mail должен быть строкой'})
    @IsEmail({}, {message: 'Некорректный E-mail'})
    email: string;
}

export class ChangePasswordDto {
    @ApiProperty({ type: String, example: 'test123123123', nullable: false, description: 'Ключ' })
    @IsNotEmpty({message: 'Пароль обязательное поле'})
    @IsString({message: 'Пароль должен быть строкой'})
    key: string;

    @ApiProperty({ type: String, example: 'test123123123', nullable: false, description: 'Новый пароль' })
    @IsNotEmpty({message: 'Пароль обязательное поле'})
    @IsString({message: 'Пароль должен быть строкой'})
    password: string;
}