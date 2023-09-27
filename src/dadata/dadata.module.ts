import { Module } from '@nestjs/common';
import { DadataService } from './dadata.service';
import { DadataController } from './dadata.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [DadataController],
  providers: [DadataService]
})
export class DadataModule {}
