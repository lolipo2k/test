import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
    validationResponse;

    constructor(response) {
        super(response, HttpStatus.BAD_REQUEST);
        this.validationResponse = response;
    }
}