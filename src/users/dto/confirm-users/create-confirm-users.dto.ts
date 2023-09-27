import { ApiProperty } from '@nestjs/swagger';
import { DefaultDto } from 'src/dto/default.dto';
import { TypeConfirm } from 'src/users/interface';
import { CreateUsersDto } from '../create-users.dto';

export class CreateConfirmUsersDto {
    @ApiProperty({ enum: TypeConfirm, example: TypeConfirm.CONFIRMATIONEMAIL, description: 'Статус' })
    type: TypeConfirm;
}

export class ConfirmUsersDto extends DefaultDto {
    @ApiProperty({ example: 'ADEWFASFW1GHGHTTHZXC121123', description: 'Ключ' })
    key: string;

    @ApiProperty({ enum: TypeConfirm, example: TypeConfirm.CONFIRMATIONEMAIL, description: 'Статус' })
    type: TypeConfirm;
}

export class FullConfirmUsersDto extends ConfirmUsersDto {
    @ApiProperty({ type: () => CreateUsersDto, description: 'Пользователь' })
    user: CreateUsersDto;
}