import { ApiProperty } from '@nestjs/swagger';
import { Result, ResultPaginations, ResultPaginationsOptions, ParamsPageSearch } from './../../dto/response.dto';
import { FullUsersDto } from './create-users.dto';

export enum SortUser {
    Email = 'Email',
    FirstName = 'FirstName',
    LastName = 'LastName',
    MiddleName = 'MiddleName',
    Role = 'Role'
}

export class ParamsPageSortUser extends ParamsPageSearch {
    @ApiProperty({ enum: SortUser, nullable: true, description: 'Сортировка' })
    sortUser: SortUser;
}

export class ResponseUsersDto extends Result {
    @ApiProperty({ type: FullUsersDto, nullable: true, description: 'Модель пользователя' })
    entity?: FullUsersDto;
}

export class UserOption extends ResultPaginationsOptions {
    @ApiProperty({ type: [FullUsersDto], nullable: true, description: 'Список пользователе' })
    entity: FullUsersDto[];
}

export class ResponseUsersListDto extends Result {
    @ApiProperty({ type: UserOption, nullable: true, description: 'Ответ' })
    entity: UserOption;
}