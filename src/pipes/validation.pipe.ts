import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const obj = plainToClass(metadata.metatype, value);
        const errors = await validate(obj);

        if (errors.length) {
            const messages = errors.map((el) => {
                return `${Object.values(el.constraints).join(', ')}`;
            });

            const arrErrors = {};
            
            errors.forEach((el) => {
                const key = el.property;
                const value = Object.values(el.constraints).map((el) => el);
                arrErrors[key] = value;
            });
            
            throw new ValidationException({messages, arrErrors});
        }

        return value;
    }
}