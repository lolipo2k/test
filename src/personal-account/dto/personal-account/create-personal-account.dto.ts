import { ApiProperty } from '@nestjs/swagger';
import { DefaultDto } from 'src/dto/default.dto';
import { HistoryPersonalAccountDto } from '../history-pesonal-account/create-history-personal-account.dto';

export class PersonalAccountDto extends DefaultDto {
    @ApiProperty({type: Number, example: 0, nullable: true, description: 'Баланс' })
    amount: number;
}

export class FullPersonalAccountDto extends PersonalAccountDto {
    @ApiProperty({ type: () => [HistoryPersonalAccountDto], description: 'История' })
    history: HistoryPersonalAccountDto[];
}