import { ApiProperty } from '@nestjs/swagger';
import { Result } from 'src/dto/response.dto';
import { UsersContactsDto } from './create-users-contacts.dto';

export class ResultUsersContactsDto extends Result {
    @ApiProperty({ type: () => [UsersContactsDto], nullable: true, description: 'Ответ' })
    entity: UsersContactsDto[];
}