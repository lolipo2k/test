import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ConfirmUsersEntity } from '../entities/confirm-users.entity';
import { TypeConfirm, VerificationStatus } from '../interface';
import { ConfirmUsersDto, FullConfirmUsersDto } from '../dto/confirm-users/create-confirm-users.dto';
import { CreateUsersDto } from '../dto/create-users.dto';
import { Result } from 'src/dto/response.dto';
import { UsersEntity } from '../entities/usres.entity';

@Injectable()
export class ConfirmUsersService {
    constructor(
        // Инцелизируем таблицу для простых запросов
        @InjectRepository(ConfirmUsersEntity) private readonly confirmUsersRepository: Repository<ConfirmUsersEntity>,
        @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
    ) { }

    async create(type: TypeConfirm, user: CreateUsersDto): Promise<ConfirmUsersDto> {
        const confirm = this.confirmUsersRepository.create({
            type,
            user
        });

        return await this.confirmUsersRepository.save(confirm);
    }

    async confirmRegister(key: string): Promise<Result> {
        const enitiy = await this.confirmUsersRepository.findOne({
            where: {
                deletedAt: IsNull(),
                key,
            },
            relations: ['user']
        });
        if (!enitiy) {
            return {isSuccess: false, message: 'Произошла ошибка, ключ подтверждения не найден'}
        }

        enitiy.deletedAt = new Date();
        await this.confirmUsersRepository.save(enitiy);

        const user = {
            ...enitiy.user,
            isActive: true,
            verificationStatus: VerificationStatus.EMAILVERIFIE
        };

        await this.usersRepository.save(user);

        return {isSuccess: true};
    }

    async findOne(key: string): Promise<FullConfirmUsersDto> {
        return await this.confirmUsersRepository.findOne({
            where: {
                key,
                deletedAt: IsNull()
            },
            relations: ['user']
        });
    }
}