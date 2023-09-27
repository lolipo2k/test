import { join } from 'path';
import { Injectable } from '@nestjs/common';
import {MailerService} from '@nestjs-modules/mailer'
import { Result } from 'src/dto/response.dto';
import { SendFileDto, SendMessageDto } from './dto/send-file.dto';

@Injectable()
export class NodeMailerService {
    constructor(
        private readonly mailerService: MailerService
    ) {}

    async sendMessageEmail(body: SendMessageDto): Promise<Result> {
        try {
            await this.mailerService.sendMail({
                to: body.email,
                template: join('template-mail/register'),
                context: {
                    username: body.userName,
                    link: body.link
                },
                subject: body.theme,
            });
            return {isSuccess: true};
        } catch {
            return {isSuccess: false, message: 'Ошибка при отправке сообщения'};
        }
    }

    async setConfirmResetPassword(email: string, key: string): Promise<Result> {
        try {
            await this.mailerService.sendMail({
                to: email,
                template: join('template-mail/replace-password'),
                context: {
                    link: `${process.env.HTTP_FRONT_REPLACEPASSWORD}/key=${key}`
                },
                subject: 'Смена пароль'
            });
            return {isSuccess: true};
        } catch {
            return {isSuccess: false, message: 'Ошибка при отправке сообщения'};
        }
    }

    async sendFile(body: SendFileDto): Promise<Result> {
        try {
            await this.mailerService.sendMail({
                to: body.email,
                template: join('template-mail/exportReestor'),
                context: {
                    text: 'BoxBirds'
                },
                subject: 'BoxBirds',
                attachments: [
                    {
                        filename: body.fileName,
                        content: body.buffer
                    }
                ]
            })

            return {isSuccess: true}
        } catch (e) {
            console.log('node-mailer', e)
            return {isSuccess: false, message: 'Файл на почту не потравлен'}
        }
    }
}
