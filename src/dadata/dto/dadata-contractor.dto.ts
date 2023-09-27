import { ApiProperty } from '@nestjs/swagger';
import { Result } from './../../dto/response.dto';

export class AddressDaDataDto {
    @ApiProperty({ nullable: true, description: 'Город' })
    city:string
}

export class ResponseDaDataAddressDto extends Result {
    @ApiProperty({ type: () => [AddressDaDataDto], nullable: true, description: 'Ответ' })
    entity: AddressDaDataDto[];
}