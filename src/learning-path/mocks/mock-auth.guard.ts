import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    username: string;
  };
}

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    request.user = {
      userId: '507f1f77bcf86cd799439011',
      username: 'test_user',
    };
    return true;
  }
}
