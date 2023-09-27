import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/entity/default-entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { HistoryPersonalAccountEntity } from './history-personal-account.entity';

@Entity({
    name: 'personal_account'
})
export class PersonalAccountEntity extends DefaultEntity {
    @ApiProperty({type: Number, example: 0, nullable: true, description: 'Баланс' })
    @Column({ type: 'float', nullable: false, default: 0 })
    amount: number;

    @ApiProperty({ description: 'История' })
    @OneToMany(() => HistoryPersonalAccountEntity, (history) => history.personalAccount)
    history: HistoryPersonalAccountEntity[];
}