import {ApiProperty} from '@nestjs/swagger';
import {FileType} from '../interface';
import { DefaultDto } from 'src/dto/default.dto';

export class CreateLibraryFilesDto extends DefaultDto {

    @ApiProperty({ type: Number, nullable: true, description: 'ID' })
    id: number | null;

    @ApiProperty({ example: '/logo.svg', nullable: true, description: 'Путь к файлу' })
    path: string | null;

    @ApiProperty({ enum: FileType, nullable: true, description: 'Тип файла' })
    type: FileType | null;

    @ApiProperty({ example: 'Название файла или директории', nullable: false, description: 'Название файла или директории' })
    name: string;

    @ApiProperty({ example: 'Название в облаке', nullable: false, description: 'Название в облаке' })
    filename: string;

    @ApiProperty({ example: 10000, description: 'Размер файла' })
    size: number;
    
    @ApiProperty({ example: true, description: 'Системная директория' })
    isSystem: boolean;

    @ApiProperty({ type: () => CreateLibraryFilesDto, nullable: true, description: 'Родительский элемент' })
    parent: CreateLibraryFilesDto;
}
