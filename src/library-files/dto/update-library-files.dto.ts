import { PartialType } from '@nestjs/swagger';
import { CreateLibraryFilesDto } from './create-library-files.dto';

export class UpdateLibraryFilesDto extends PartialType(CreateLibraryFilesDto) {}
