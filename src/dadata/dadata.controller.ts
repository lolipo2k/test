import { ResponseDaDataAddressDto } from './dto/dadata-contractor.dto';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { ApiExceptionDecorators } from './../decorators/exception-decorators';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Controller, UseGuards, Query, Get } from '@nestjs/common';
import { DadataService } from './dadata.service';

@ApiTags('Интеграция DaData')
@ApiExceptionDecorators()
@Controller('dadata')
export class DadataController {
  constructor(private readonly dadataService: DadataService) {}

  @ApiOperation({ summary: 'Select списка адресов' })
  @ApiResponse({ status: 200, type: ResponseDaDataAddressDto })
  @ApiBearerAuth()
  @ApiQuery({name: 'search', type: String, required: true, description: 'Поиск'})
  @UseGuards(JwtAuthGuard)
  @Get('address')
  address(@Query() query: {search: string}): Promise<ResponseDaDataAddressDto> {
      return this.dadataService.address(query.search);
  }
}
