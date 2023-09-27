import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class DefaultEntity {
    @ApiProperty({ example: 1, description: 'ID' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Дата создания'})
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Дата обновления' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ example: false, default: false, nullable: false, description: 'Удален?' })
    @DeleteDateColumn()
    @Exclude()
    deletedAt: Date;
}