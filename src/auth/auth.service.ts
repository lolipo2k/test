import { NodeMailerService } from './../node-mailer/node-mailer.service';
import {GenerateUserTokenDto} from './dto/generate-user-token.dto';
import {FullUsersDto} from './../users/dto/create-users.dto';
import {ChangePasswordDto, LoginDto, RegisterDto, ReplcaePasswordDto, ResultLogin} from './dto/login.dto';
import {UsersService} from './../users/services/users.service';
import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import {Result} from '../dto/response.dto';
import {UserRole} from '../users/entities/usres.entity';
import { TypeConfirm, VerificationStatus } from 'src/users/interface';
import { ConfirmUsersService } from 'src/users/services/confirm-users.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        private readonly confirmUsersService: ConfirmUsersService,
        private jwtService: JwtService,
        private readonly nodeMailerService: NodeMailerService
    ) {}

    // password - текстовый пароль
    // userPassword - хешированный пароль
    async isMatchPassword(password: string, userPassword: string): Promise<Result> {
        return {
            isSuccess: await bcrypt.compare(password, userPassword)
        };
    }

    // Валидация авторизации
    async validateUser(body: LoginDto): Promise<FullUsersDto> {
        if (!body.password) {
            throw new UnauthorizedException({
                messages: ['Вы ввели не верную почту или пароль'],
                status: false,
                statusCode: 200,
              });
        }

        const user = await this.usersService.getFindEmail(body.email);

        if (!user.isActive) {
            throw new UnauthorizedException({
                messages: ['Подтвердите почту'],
                status: false,
                statusCode: 200,
            });
        }

        const isMatch = await bcrypt.compare(body.password, user.password);

        if (isMatch) {
          const { password, ...result } = user;
          return result;
        } 
        
        throw new UnauthorizedException({
            messages: ['Вы ввели не верную почту или пароль'],
            status: false,
            statusCode: 200,
        });
    }
    // Создание токена
    async generateToken(user: FullUsersDto): Promise<string> {
        const payload: GenerateUserTokenDto = {
            id: user.id.toString(),
            email: user.email,
            role: user.role,
        };

        return this.jwtService.sign(payload);
    }

    // Расшифоровка токена
    decodeToken(token: string): any {
        return this.jwtService.decode(token);
    }

    // Проверка токена
    verifyToken(token: string) {
        return this.jwtService.verify(token);
    }

    // Авторизация
    async login(body: LoginDto): Promise<ResultLogin> {
        const user = await this.validateUser(body);
        const token = await this.generateToken(user);
        return {
            isSuccess: true,
            entity: {
                token, 
                entity: user
            }
        };
    }

    async register(body: RegisterDto): Promise<Result> {
        const findUser = await this.usersService.getUserByEmail(body.email);
        if (findUser) {
            return {isSuccess: true, message: 'Пользователь с таким E-mail уже зарегистрирован'};
        }
        const user = await this.usersService.create({
            isActive: false,
            email: body.email,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            middleName: body.middleName,
            role: UserRole.GUEST,
            verificationStatus: VerificationStatus.NOTVERIFIED,
            rating: 0
        });

        if (!user.isSuccess) {
            return { isSuccess: false, message:'Произошла ошибка'};
        }

        const confirm = await this.confirmUsersService.create(
            TypeConfirm.CONFIRMATIONEMAIL,
            user.entity
        );

        this.nodeMailerService.sendMessageEmail({
            email: user.entity.email,
            theme: 'Подтверждение почты',
            link: `${process.env.HTTP_FRONT_CONFIRM}/confirm/key=${confirm.key}`,
            userName: `${user.entity.lastName} ${user.entity.firstName} ${user.entity.middleName}`
        });

        return { isSuccess: true};
    }

    // Запрос на смену пароля
    async confirmReplace(body: ReplcaePasswordDto): Promise<Result> {
        const user = await this.usersService.getFindEmail(body.email);

        if (!user) {
            return {
                isSuccess: false, 
                message: 'Пользователь не найден' 
            };
        }

        const createConfirm = await this.confirmUsersService.create(TypeConfirm.REPLACEPASSWORD, user);

        this.nodeMailerService.setConfirmResetPassword(body.email, createConfirm.key);

        return {
            isSuccess: true
        };
    }

    // Смена пароля
    async replacePassword(body: ChangePasswordDto): Promise<Result> {
        const confirm = await this.confirmUsersService.findOne(body.key);
        if (!confirm) {
            return { isSuccess: false, message:'Не найдена запись'};
        }

        await this.usersService.updatePassword(confirm.user, body.password);

        return {isSuccess: true};
    }

    // Подтверждение почты
    async confrimEmail(key: string): Promise<Result> {
        return await this.confirmUsersService.confirmRegister(key);
    }
}
