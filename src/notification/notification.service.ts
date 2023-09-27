import { fromEvent, Observable } from 'rxjs';
import { UsersService } from './../users/services/users.service';
import { NotificationEntity } from './entity/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseNotificationDto, ResponseNotificationListDto, ResultNotification, ResponseCountNotification } from './dto/response-notification.dto';
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto, FullNotificationDto } from './dto/create-notification.dto';
import { In, Repository } from 'typeorm';
import { EventEmitter } from 'stream';
import { ParamsPageSearch, Result } from 'src/dto/response.dto';
import { NotificationStatus, NotificationType } from './interface';
import { NotificationGateway } from './notification.gateway';
import { LibraryFilesService } from 'src/library-files/library-files.service';

@Injectable()
export class NotificationService {
  private readonly emitter: EventEmitter;
  constructor(
    @InjectRepository(NotificationEntity) private readonly notificationRepository: Repository<NotificationEntity>,
    private userService: UsersService,
    private dropzonaService: LibraryFilesService,
  ) {
    this.emitter = new EventEmitter();
  }

  // Создание уведомления по вызову сокета
  async handlerCreate(body: CreateNotificationDto): Promise<ResponseNotificationDto> {
    const user = (await this.userService.getOneNotificationKey(body.notificationKey)).entity;

    const entity = await this.notificationRepository.create({
      id: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: false,
      title: body.title,
      description: body.description,
      type: body.type ? body.type : NotificationType.TEXT,
      isView: false,
      isSend: true,
      user,
    });
    await this.notificationRepository.save(entity);

    return {isSuccess: true, entity};
  }

  // Создание уведомления
  async create(body: FullNotificationDto): Promise<ResponseNotificationDto> {
    const entity = await this.notificationRepository.create({
      id: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: false,
      title: body.title,
      description: body.description,
      isView: false,
      isSend: true,
      user: body.user
    });
    await this.notificationRepository.save(entity);

    return {isSuccess: true, entity};
  }

  async get(body: ParamsPageSearch, req: any): Promise<ResponseNotificationListDto> {
    const take = Number(body.limit);
    const skip = body.page === 1 ? 0 : (Number(body.page) - 1) * take;
    const query = this.notificationRepository.createQueryBuilder('notification').take(take).skip(skip)
    .orderBy('notification.createdAt', 'DESC')
    .leftJoin('notification.user', 'user')
    .addSelect('user.id')
    .leftJoin('notification.task', 'task')
    .addSelect(['task.id', 'task.files'])
    .leftJoin('task.files', 'files')
    .addSelect(['files.id', 'files.parent', 'files.filename', 'files.path'])
    .leftJoin('files.parent', 'filesParent')
    .addSelect('filesParent.id');

    const user = (await this.userService.getCurrentInfo(req)).entity;
    if (!user) {
      return {isSuccess: false, message: 'Пользователь не найдне'};
    }

    query.where({
        user: {
          id: user.id
        }
    });

    const queryIds: any = await this.notificationRepository.createQueryBuilder('notification').take(take).skip(skip).select('notification.id').orderBy('notification.createdAt', 'DESC').getMany();

    const ids = queryIds.map((el) => el.id);
    await this.updateIsView(ids);

    const result = await query.getMany();

    const entity: ResponseNotificationListDto = {
        isSuccess: true,
        entity: {
            count: await query.getCount(),
            entity: result,
            countIsView: await (await this.countIsView(req)).entity,
        }
    };

    return entity;
  }

  subscribe() {
    return fromEvent(this.emitter, 'eventName');
  }

  async emit(userId: number) {
      const enitiy = (await this.getIsSend(userId)).entity;
      this.emitter.emit('eventName', {data: enitiy});
  }

  async getIsSend(userId: number)  {
    const user = await (await this.userService.getOne(userId)).entity;

    if (!user) {
      return {isSuccess: false, message: 'Пользователь не найдне'};
    }

    const query = this.notificationRepository.createQueryBuilder('notification');
    query.andWhere({
      user,
    });
    query.andWhere({
      isSend: true
    });

    const entity = await query.getMany();


    return {isSuccess: true, entity};

  }

  async updateIsSend(ids: string[]): Promise<Result> {
    try {
      const query = this.notificationRepository.createQueryBuilder('notification')
      .update(NotificationEntity)
      .set({ isSend: false });

      let id = 0;

      if (Array.isArray(ids)) {
        const arrIds = ids.map((el) => Number(el));
        id = arrIds[0];
        query.where({
          id: In(arrIds)
        });
      } else {
        query.where({
          id: Number(ids as String)
        });
        id = Number(ids);
      }
     
      await query.execute();

      const entity = await this.notificationRepository.findOne({
        where: {
          id,
        },
        relations: ['user']
      });

      return {isSuccess: true};
    } catch (error) {
      console.log(error);
      return {isSuccess: false};
    }
  }

  async updateIsView(ids: string[]): Promise<Result> {
    try {
        const query = this.notificationRepository.createQueryBuilder('notification')
        .update(NotificationEntity)
        .set({ isSend: false, isView: true, status: NotificationStatus.IsRead });

        let id = 0;

        if (Array.isArray(ids)) {
        const arrIds = ids.map((el) => Number(el));
        id = arrIds[0];
        query.where({
            id: In(arrIds)
        });
        } else {
        query.where({
            id: Number(ids as String)
        });
        id = Number(ids);
        }
        
        await query.execute();

        const entity = await this.notificationRepository.findOne({
        where: {
            id,
        },
        relations: ['user']
        });

        return {isSuccess: true};
    } catch (error) {
      console.log(error);
      return {isSuccess: false};
    }
  }

  async countIsView(req: any): Promise<ResponseCountNotification> {
    const user = (await this.userService.getCurrentInfo(req)).entity;
    if (!user) {
      return {isSuccess: false, message: 'Пользователь не найдне'};
    }
    const entity: number = await this.notificationRepository.count({
      where: {
        user: {
          id: user.id,
        },
        isView: false,
      },
      relations:['user']
    });
    return {isSuccess: true, entity};
  }

}
