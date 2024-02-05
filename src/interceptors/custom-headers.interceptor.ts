import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CustomHeadersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const tokenHeader: string = req.headers['token'];

    if (!tokenHeader) {
      throw new BadRequestException('token header is required');
    }

    if (tokenHeader.substring(0, 3) !== 'pk_') {
      throw new BadRequestException('token header must start with pk_');
    }

    return next.handle();
  }
}
