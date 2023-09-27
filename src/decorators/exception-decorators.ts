import { Result } from './../dto/response.dto';
import { ApiUnauthorizedResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiBadGatewayResponse, ApiConflictResponse, ApiForbiddenResponse, ApiGatewayTimeoutResponse, ApiMethodNotAllowedResponse, ApiNotAcceptableResponse, ApiRequestTimeoutResponse, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export const ApiExceptionDecorators = () => {
    return applyDecorators(
        ApiUnauthorizedResponse({status: 401, type: Result, description: 'Вы не авторизованы' }),
        ApiInternalServerErrorResponse({status: 500, type: Result, description: 'Сервер упал в ошибку при обработке запроса'}),
        ApiNoContentResponse({ type: Result, description: 'Нет данных'}),
        ApiBadRequestResponse({ type: Result, description: 'Запрос не выполнен, произошла ошибка'}),
        ApiNotFoundResponse({ type: Result, description: 'Ничего не найдено по вашему запросу'}),
        ApiBadGatewayResponse({ type: Result, description: 'Запрос не обработан, плохое соединение'}),
        ApiConflictResponse({ type: Result, description: 'Конфликт сервера с текущим состоянием'}),
        ApiForbiddenResponse({ type: Result, description: 'Нет доступа'}),
        ApiGatewayTimeoutResponse({ type: Result, description: 'Время выполнения закончилось или сервер не доступена'}),
        ApiMethodNotAllowedResponse({ type: Result, description: 'Запрос не разрещен, у вас нет доступа'}),
        ApiNotAcceptableResponse({ type: Result, description: 'Не найден контент по вашему запросу'}),
        ApiRequestTimeoutResponse({ type: Result, description: 'Время выполнения закончилось или сервер не доступен'})
    );
  };