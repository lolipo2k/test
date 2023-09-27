import { Result, ResultPaginationsOptions } from './response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class DropDown {
    @ApiProperty({ example: 1, nullable: false, description: 'ID' })
    readonly id: number;

    @ApiProperty({ example: 'Текст', nullable: false, description: 'Название select' })
    name: string;
}

export class DropDownOption extends ResultPaginationsOptions {
    @ApiProperty({type: () => [DropDown], description: 'Ответ' })
    entity: DropDown[];
}

export class ResponseDropDown extends Result {
    @ApiProperty({type: () => DropDownOption, description: 'Ответ' })
    entity: DropDownOption;
}

export class ResultDropDown extends Result {
    @ApiProperty({type: () => DropDown, description: 'Ответ' })
    entity: DropDown;
}