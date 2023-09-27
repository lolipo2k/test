import { AuthService } from 'src/auth/auth.service';
  import {
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/users/entities/usres.entity';
  
  @Injectable()
  export class JwtAdminGuard extends AuthGuard('jwt') {
    constructor(private authService: AuthService) {
      super();
    }
  
    canActivate(context: ExecutionContext) {
      // Add your custom authentication logic here
      // for example, call super.logIn(request) to establish a session.
      // const req = context.switchToHttp().getRequest();
      // const authHeader = req.headers.authorization;
      // const token = authHeader.split(' ')[1];
      return super.canActivate(context);
    }
  
    handleRequest(err, user, info) {
      // You can throw an exception based on either "info" or "err" arguments
      if (user && user.role !== UserRole.ADMIN) {
        throw err || new ForbiddenException({
            message: 'У вас нет доступа',
            status: 403,
            isSuccess: false
        });
      }
      if (err || !user) {
        throw err || new UnauthorizedException({
            message: 'Вы не авторизованы',
            status: 401,
            isSuccess: false
        });
      }

      return user;
    }
  }