import { Result } from 'src/dto/response.dto';
import { PersonalAccountDto } from './create-personal-account.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResultPersonalAccount extends Result {
    @ApiProperty({ type: () => PersonalAccountDto, description: 'Личный счет'})
    entity: PersonalAccountDto;
}