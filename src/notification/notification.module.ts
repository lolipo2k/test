import { UsersModule } from './../users/users.module';
import { NotificationEntity } from './entity/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationController } from './notification.controller';
import { LibraryFilesModule } from 'src/library-files/library-files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationEntity]),
    UsersModule,
    forwardRef(() => LibraryFilesModule)
  ],
  controllers: [NotificationController],
  providers: [NotificationGateway, NotificationService],
  exports: [NotificationService, NotificationGateway]
})
export class NotificationModule {}
