import { HttpExceptionFilter } from './filter/http-exception.filter';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {LibraryFilesModule} from './library-files/library-files.module';
import { APP_FILTER } from '@nestjs/core';
import { DadataModule } from './dadata/dadata.module';
import { NotificationModule } from './notification/notification.module';
import { NodeMailerModule } from './node-mailer/node-mailer.module';
import { PersonalAccountModule } from './personal-account/personal-account.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    LibraryFilesModule,
    DadataModule,
    NotificationModule,
    NodeMailerModule,
    PersonalAccountModule,
  ],
  controllers: [AppController],
  providers: [AppService,  { 
    provide: APP_FILTER, 
    useClass: HttpExceptionFilter, 
  },],
})
export class AppModule {}
