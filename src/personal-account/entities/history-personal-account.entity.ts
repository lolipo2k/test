import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/entity/default-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { TypePersonalAccount } from '../interface';
import { PersonalAccountEntity } from './pesonal-account.entity';

@Entity({
    name: 'history_personal_account'
})
export class HistoryPersonalAccountEntity extends DefaultEntity {
    @ApiProperty({type: Number, example: 0, nullable: true, description: 'Баланс' })
    @Column({ type: 'float', nullable: false, default: 0 })
    value: number;

    @ApiProperty({ enum: TypePersonalAccount, example: TypePersonalAccount.REMOVAL, description: 'Статус' })
    @Column({
        type: 'enum',
        enum: TypePersonalAccount,
        default: TypePersonalAccount.REMOVAL,
    })
    type: TypePersonalAccount;

    @ApiProperty({ description: 'Личный счет' })
    @ManyToOne(() => PersonalAccountEntity, (personal) => personal.history)
    personalAccount: PersonalAccountEntity;
}