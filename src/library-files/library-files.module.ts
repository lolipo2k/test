import { Module, forwardRef } from '@nestjs/common';
import { LibraryFilesService } from './library-files.service';
import { LibraryFilesController } from './library-files.controller';
import {AuthModule} from '../auth/auth.module';
import {UsersModule} from '../users/users.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LibraryFilesEntity} from './entities/library-files.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([LibraryFilesEntity]), 
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [LibraryFilesController],
  providers: [LibraryFilesService],
  exports: [LibraryFilesService],
})
export class LibraryFilesModule {}
