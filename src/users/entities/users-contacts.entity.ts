import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DefaultEntity } from 'src/entity/default-entity';
import { TypeContent } from '../interface';
import { UsersEntity } from './usres.entity';

@Entity({
    name: 'users-contacts'
})
export class UsersContactsEntity extends DefaultEntity {
    @ApiProperty({ example: 'test@mail.ru', description: 'Контент' })
    @Column({ length: 2048, nullable: false })
    content: string;

    @ApiProperty({ example: TypeContent.EMAIL, description: 'Тип контента' })
    @Column({ enum: TypeContent, default: TypeContent.EMAIL,  nullable: false })
    typeContent: TypeContent;

    @ApiProperty({ example: true, description: 'Показывать?' })
    @Column({ type: 'bool', default: false, nullable: true })
    isView: boolean;

    @ApiProperty({ description: 'Контакты' })
    @ManyToOne(() => UsersEntity, (user) => user.contacts)
    user: UsersEntity;
}