import { Injectable } from '@nestjs/common';
import { UsersContactsEntity } from '../entities/users-contacts.entity';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from 'src/dto/response.dto';
import { FullUsersContactsDto, UsersContactsDto } from '../dto/users-contacts/create-users-contacts.dto';
import { ResultUsersContactsDto } from '../dto/users-contacts/response-users-contacts.dto';

@Injectable()
export class UsersContactsService {
    constructor(
        // Инцелизируем таблицу для простых запросов
        @InjectRepository(UsersContactsEntity) private readonly usersContactsRepository: Repository<UsersContactsEntity>
    ) { }

    async getIdContacts(userId: number): Promise<number[]> {
        const query = await this.usersContactsRepository.createQueryBuilder('contacts')
        .select(['contacts.id', 'contacts.deletedAt'])
        .innerJoin('contacts.user', 'user')
        .addSelect('user.id')
        .where({
            deletedAt: IsNull()
        })
        .andWhere(`user.id = ${userId}`)
        .getMany();

        return query.map((el) => el.id);
    }

    async deleteIdsContacts(ids: number[]): Promise<Result> {
        try {
            await this.usersContactsRepository.softDelete(ids);
    
            return {isSuccess: true};
        } catch (e) {
            console.log(e)
            return {isSuccess: false};
        }

    }

    // Создание контактов
    async createContacts(body: FullUsersContactsDto[]): Promise<Result> {
        // const enitites = this.usersContactsRepository.create(body);
        // const entity = await this.usersContactsRepository.save(enitites);
        const query = this.usersContactsRepository.createQueryBuilder('contacts');

        await query.insert().into(UsersContactsEntity).values([
            ...body
        ]).execute();
        return {isSuccess: true};
    }

     // Обновление контактов
     async updateContacts(body: UsersContactsDto[]): Promise<Result> {
        await this.usersContactsRepository.save(body);
        return {isSuccess: true};
    }

    async getContactsUsers(userId: number): Promise<ResultUsersContactsDto> {
        const entity = await this.usersContactsRepository.createQueryBuilder('contacts')
        .select(['contacts.id', 'contacts.content', 'contacts.typeContent', 'contacts.isView'])
        .innerJoin('contacts.user', 'user')
        .addSelect('user.id')
        .where({
            deletedAt: IsNull()
        }).andWhere(`user.id = ${userId}`)
        .getMany();

        return {isSuccess: true, entity};
    }
}