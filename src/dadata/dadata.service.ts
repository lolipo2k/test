import { AddressDaDataDto, ResponseDaDataAddressDto } from './dto/dadata-contractor.dto';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class DadataService {
    constructor(
        private readonly httpService: HttpService
    ) {}

    parseDaDataToAddressDto(arrayDaData: any): AddressDaDataDto[] {
        return arrayDaData.map((el) => {
            return {
                name:'',
                fullName: el.unrestricted_value || '',
                federalDistrict: el.data?.federal_district || '',
                region: el.data?.region || '',
                district: el.data?.area || '',
                city: el.data?.city || '',
                locality: el.data?.city_district || '',
                street: el.data?.street || '',
                number: el.data?.house || '',
                corpus: '',
                index: el.data?.postal_code || '',
                fias: el.data?.house_fias_id || '',
                longitude: el.data?.geo_lon || 0,
                latitude: el.data?.geo_lat || 0,
                isNotAddress: false,
                
            };
        });
    }

    async address(search: string): Promise<ResponseDaDataAddressDto> {
        const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
        const response: any = await this.httpService.axiosRef.post(
                url,
                { query: search, count: 20},
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': 'Token ' + process.env.DADATA_API_KEY
                    }
                }
            ).catch((error) => {
                return {isSuccess: false, entity: [], message: 'Ошибка от DaData'};
            });

        const result = this.parseDaDataToAddressDto(response.data.suggestions);

        return {isSuccess: true, entity: result};
    }
}
