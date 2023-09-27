import { jwtConstants } from './constants';
// @ts-ignore
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './../users/users.module';
import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { NodeMailerModule } from 'src/node-mailer/node-mailer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    forwardRef(() => UsersModule),
    forwardRef(() => NodeMailerModule),
    PassportModule,
    JwtModule.register({
      secretOrPrivateKey: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [
    JwtModule,
    JwtStrategy,
    AuthService,
  ]
})
export class AuthModule {}
