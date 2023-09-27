import { UsersContactsEntity } from './entities/users-contacts.entity';
import { AuthModule } from './../auth/auth.module';
import { UsersService } from './services/users.service';
import { UsersEntity } from './entities/usres.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { ConfirmUsersEntity } from './entities/confirm-users.entity';
import { ConfirmUsersService } from './services/confirm-users.service';
import { UsersContactsService } from './services/users-contacts.service';
import { PersonalAccountModule } from 'src/personal-account/personal-account.module';
import { LibraryFilesModule } from 'src/library-files/library-files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, ConfirmUsersEntity, UsersContactsEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => PersonalAccountModule),
    forwardRef(() => LibraryFilesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfirmUsersService, UsersContactsService],
  exports: [UsersService, ConfirmUsersService, UsersContactsService],
})
export class UsersModule {}
