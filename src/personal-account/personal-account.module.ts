import { Module } from '@nestjs/common';
import { PersonalAccountService } from './service/personal-account.service';
import { PersonalAccountController } from './controller/personal-account.controller';
import { PersonalAccountEntity } from './entities/pesonal-account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryPersonalAccountEntity } from './entities/history-personal-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonalAccountEntity, HistoryPersonalAccountEntity]),
  ],
  controllers: [PersonalAccountController],
  providers: [PersonalAccountService],
  exports: [PersonalAccountService]
})
export class PersonalAccountModule {}
