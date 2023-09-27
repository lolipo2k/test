import { ApiProperty } from '@nestjs/swagger';

export class DefaultDto {
    @ApiProperty({ example: 'id', nullable: true, description: 'id' })
    readonly id?: number | null;

    @ApiProperty({ example: '2020.12.12T00:00', nullable: true, description: 'Дата создания' })
    readonly createdAt?: Date;

    @ApiProperty({ example: '2020.12.12T00:00', nullable: true, description: 'Дата обновления' })
    readonly updatedAt?: Date;

    @ApiProperty({ example: false, nullable: false, description: 'Удален?' })
    deletedAt?: Date;
}