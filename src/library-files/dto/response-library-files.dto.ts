import { ApiProperty } from '@nestjs/swagger';
import {Result, ResultPaginationsOptions} from '../../dto/response.dto';
import {CreateLibraryFilesDto} from './create-library-files.dto';

export class ResponseLibraryFiles extends Result {
    @ApiProperty({ type: () => CreateLibraryFilesDto, nullable: true, description: 'Загруженый файл' })
    entity?: CreateLibraryFilesDto;
}

export class ResponseLibraryFilesList extends Result {
    @ApiProperty({ type: () => [CreateLibraryFilesDto], nullable: true, description: 'Загруженый файл' })
    entity?: CreateLibraryFilesDto[];
}

export class LibraryOption extends ResultPaginationsOptions {
    @ApiProperty({ type: [CreateLibraryFilesDto], nullable: true, description: 'Список файлов' })
    entity: CreateLibraryFilesDto[];
}

export class ResponseLibraryListDto extends Result {
    @ApiProperty({ type: LibraryOption, nullable: true, description: 'Ответ' })
    entity: LibraryOption;
}