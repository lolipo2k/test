import { ApiExceptionDecorators } from './../decorators/exception-decorators';
import {ChangePasswordDto, LoginDto, RegisterDto, ReplcaePasswordDto, ResultLogin} from './dto/login.dto';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiExtraModels, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {Result} from '../dto/response.dto';

@ApiTags('Авторизация')
@ApiExceptionDecorators()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiExtraModels(Result)
    @ApiOperation({ summary: 'Авторизация' })
    @ApiResponse({ status: 201, type: ResultLogin })
    @Post('login')
    login(@Body() body: LoginDto): Promise<ResultLogin> {
        return this.authService.login(body);
    }

    @ApiOperation({ summary: 'Регистрация' })
    @ApiResponse({ status: 201, type: Result })
    @Post('register')
    register(@Body() body: RegisterDto): Promise<Result> {
        return this.authService.register(body);
    }

    @ApiOperation({ summary: 'Запрос на смену пароль' })
    @ApiResponse({ status: 200, type: Result })
    @Post('replace-password')
    confirmReplace(@Body() body: ReplcaePasswordDto): Promise<Result> {
        return this.authService.confirmReplace(body);
    }

    @ApiOperation({ summary: 'Смена пароль' })
    @ApiResponse({ status: 200, type: Result })
    @Post('change-password')
    replacePassword(@Body() body: ChangePasswordDto): Promise<Result> {
        return this.authService.replacePassword(body);
    }

    @ApiOperation({ summary: 'Подтеврждение почты' })
    @ApiResponse({ status: 200, type: Result })
    @ApiQuery({name: 'key', type: String, required: true, description: 'Ключ'})
    @Get('confirm-email')
    confrimEmail(@Query() query: {key: string}): Promise<Result> {
        return this.authService.confrimEmail(query.key);
    }
}
