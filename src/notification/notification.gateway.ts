import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
import {Server} from 'socket.io';

@WebSocketGateway({namespace: 'api/notifications', cors: true })
export class NotificationGateway {
  constructor(private readonly notificationService: NotificationService) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      // Получаем парамметр из запроса для индетификации пользователя
      this.server.in(socket.id).socketsJoin(socket.handshake.query.userId);
    });
  }

  @SubscribeMessage('notification')
  handlerNotification(@MessageBody() body: CreateNotificationDto) {
    this.notificationService.handlerCreate(body);
    this.server.to(body.notificationKey).emit('onMessage', {
      title: body.title,
      description: body.description,
    });
  }
  
}
