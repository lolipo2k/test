import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<TData>  {
    @ApiProperty({ 
        example: true, 
        description: 'Статус' 
    })
    status: boolean;

    @ApiProperty({ description: 'Ответ' })
    entity: TData;
}

export class Result {
    @ApiProperty({ example: true, nullable: true, description: 'Статус' })
    isSuccess?: boolean;

    @ApiProperty({ example: 400, nullable: true, description: 'Статус код' })
    status?: number;

    @ApiProperty({ example: 'Сообщение', nullable: true, description: 'Сообщение' })
    message?: string;

    @ApiProperty({nullable: true, description: 'Ошибки' })
    errors?: any;
}

export class ResultPaginationsOptions {
    @ApiProperty({ example: 10, nullable: true, description: 'Кол-во записей' })
    count: number;

    @ApiProperty({ example: 10, nullable: true, description: 'Кол-во всех записей' })
    allCount?: number;
}
export class ResultPaginations<TData> extends Result {
    entity: TData;
}

export class ParamsId {
    @ApiProperty({ example: 1, nullable: true, description: 'ID' })
    id: number | string;
}

export class ParamsIds {
    @ApiProperty({ example: 1, nullable: true, description: 'IDS' })
    ids: string[];
}

export class ParamsPage {
    @ApiProperty({ example: 1, nullable: true, description: 'Страница' })
    page: number | string;

    @ApiProperty({ example: 10, nullable: true, description: 'Кол-во записе ' })
    limit: number | string;
}

export class ParamsPageSearch {
    @ApiProperty({ example: '', nullable: true, description: 'Поиск' })
    search: string;

    @ApiProperty({ example: 1, nullable: true, description: 'Страница' })
    page: number | string;

    @ApiProperty({ example: 10, nullable: true, description: 'Кол-во записе ' })
    limit: number | string;
}

export class ParamsPageForID {
    @ApiProperty({ example: 1, nullable: true, description: 'ID' })
    id: number | string;

    @ApiProperty({ example: 1, nullable: true, description: 'Страница' })
    page: number | string;
}