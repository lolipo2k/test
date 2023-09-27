import { ApiProperty } from '@nestjs/swagger';
import { DefaultDto } from 'src/dto/default.dto';
import { TypePersonalAccount } from 'src/personal-account/interface';
import { PersonalAccountDto } from '../personal-account/create-personal-account.dto';

export class HistoryPersonalAccountDto extends DefaultDto {
    @ApiProperty({type: Number, example: 0, nullable: true, description: 'Баланс' })
    value: number;

    @ApiProperty({ enum: TypePersonalAccount, example: TypePersonalAccount.REMOVAL, description: 'Статус' })
    type: TypePersonalAccount;
}

export class FullHistoryPersonalAccountDto extends HistoryPersonalAccountDto {
    @ApiProperty({ type: () => PersonalAccountDto, description: 'Личный счет' })
    personalAccount: PersonalAccountDto;
}