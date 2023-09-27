import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto { 
    @ApiProperty({ example: 'test@mail.ru', description: 'E-mail' })
    email: string;

    @ApiProperty({ example: 'Тема', description: 'Тема' })
    theme: string;

    @ApiProperty({ example: 'ФИО', description: 'ФИО' })
    userName: string;

    @ApiProperty({ example: 'Ссылка', description: 'Ссылка' })
    link: string;
}

export class SendFileDto {
    @ApiProperty({ example: 'test@mail.ru', description: 'E-mail' })
    email: string;

    @ApiProperty({ example: 'test@mail.ru', description: 'Буфер файла' })
    buffer: any;

    @ApiProperty({ example: 'test.csv', description: 'Название файла' })
    fileName: string;

}