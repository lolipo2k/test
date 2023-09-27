import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

export function messageStatusCode(status: number): string {
  switch (status) {
    case 500: 
      return 'Сервер упал в ошибку при обработке запроса';
      break;
    case 501: 
      return 'Запрос не может быть обработан';
      break;
    case 502: 
      return 'Запрос не обработан, плохое соединение';
      break;
    case 503: 
      return 'Сервер не доступен';
      break;
    case 504: 
      return 'Время выполнения закончилось или сервер не доступен';
      break;
    case 505: 
      return 'Такой запрос не поддерживается сервером';
      break;
    case 400: 
      return 'Запрос не выполнен, произошла ошибка';
      break;
    case 401: 
      return 'Вы не авторизованы';
      break;
    case 403: 
      return 'Нет доступа';
      break;
    case 404: 
      return 'Ничего не найдено по вашему запросу';
      break;
    case 405: 
      return 'Запрос не разрещен, у вас нет доступа';
      break;
    case 406: 
      return 'Не найден контент по вашему запросу';
      break;
    case 408: 
      return 'Время выполнения закончилось или сервер не доступен';
      break;
    case 409: 
      return 'Конфликт сервера с текущим состоянием';
      break;
    
    default: {
      return 'Ошибка сервера';
      break;
    }
  }
}


@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
  
    const responseBody = {
      isSuccess: false,
      status: httpStatus,
      message: exception && exception.response && exception.response.messages ? exception.response.messages.join(', '): messageStatusCode(httpStatus),
      errors: exception && exception.response ? exception.response.arrErrors : undefined
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

//   catch(error: any, host: ArgumentsHost) {
//     const ctx = host.switchToHttp();
//     const res = ctx.getResponse();
//     const req = ctx.getRequest();

//     if (error.getStatus() === HttpStatus.UNAUTHORIZED) {
//         if (typeof error.response !== 'string') {
//             error.response['message'] =
//                 error.response.message || 'You do not have permission to access this resource';
//         }
//     }

//     res.status(error.getStatus()).json({
//         statusCode: error.getStatus(),
//         error: error.response.name || error.name,
//         message: error.response.message || error.message,
//         errors: error.response.errors || null,
//         timestamp: new Date().toISOString(),
//         path: req ? req.url : null,
//     });
// }