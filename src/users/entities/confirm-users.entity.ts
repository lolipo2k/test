import { DefaultEntity } from 'src/entity/default-entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './usres.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TypeConfirm } from '../interface';

@Entity({
    name: 'confirm-users'
})
export class ConfirmUsersEntity extends DefaultEntity {
    @ApiProperty({ example: 'ADEWFASFW1GHGHTTHZXC121123', description: 'Ключ' })
    @PrimaryGeneratedColumn('uuid')
    key: string;

    @ApiProperty({ enum: TypeConfirm, example: TypeConfirm.CONFIRMATIONEMAIL, description: 'Статус' })
    @Column({
        type: 'enum',
        enum: TypeConfirm,
        default: TypeConfirm.CONFIRMATIONEMAIL,
    })
    type: TypeConfirm;

    @ApiProperty({ description: 'Пользователь' })
    @ManyToOne(() => UsersEntity, (user) => user.confirm)
    user: UsersEntity;
}