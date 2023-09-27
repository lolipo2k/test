import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { DefaultDto } from 'src/dto/default.dto';
import { TypeContent } from 'src/users/interface';
import { CreateUsersDto } from '../create-users.dto';

export class UsersContactsDto extends DefaultDto {
    @ApiProperty({ example: 'test@mail.ru', description: 'Контент' })
    @IsString({message: 'Контент должен быть строкой'})
    @IsNotEmpty({message: 'Контент обязательное поле'})
    content: string;

    @ApiProperty({ example: TypeContent.EMAIL, description: 'Тип контента' })
    @IsNotEmpty({message: 'Тип контента обязательное поле'})
    typeContent: TypeContent;

    @ApiProperty({ example: true, description: 'Показывать?', nullable: true})
    isView?: boolean;
}

export class FullUsersContactsDto extends UsersContactsDto {
    @ApiProperty({ type: () => CreateUsersDto, description: 'Пользователь' })
    user: CreateUsersDto;
}