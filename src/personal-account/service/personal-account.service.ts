import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonalAccountEntity } from '../entities/pesonal-account.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from 'src/users/dto/create-users.dto';
import { ResultPersonalAccount } from '../dto/personal-account/response-personal-account.dto';

@Injectable()
export class PersonalAccountService {
    constructor(
        @InjectRepository(PersonalAccountEntity) private readonly personalAccountRepository: Repository<PersonalAccountEntity>,
    ) {}

    async create(): Promise<ResultPersonalAccount> {
        const createEntity = await this.personalAccountRepository.create({
            amount: 0,
        });
        const entity = await this.personalAccountRepository.save(createEntity);

        return { isSuccess: true, entity};
    }
}
