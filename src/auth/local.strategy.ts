import { LoginDto } from './dto/login.dto';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(body: LoginDto): Promise<any> {
    if (!body.password) {
      throw new UnauthorizedException({
        message: 'Вы ввели не верную почту или пароль',
        status: 401,
        isSuccess: false,
      });
    }
    const user = await this.authService.validateUser(body);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Вы ввели не верную почту или пароль',
        status: 401,
        isSuccess: false,
      });
    }
    return user;
  }
}