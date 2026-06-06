import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
const MOCK_USERS: Record<string, object> = {
  userA: {
    userId: '507f1f77bcf86cd799439011',
    username: 'test_user_A',
    avatar: 'https://i.pravatar.cc/150?u=A',
  },
  userB: {
    userId: '507f1f77bcf86cd799439012',
    username: 'test_user_B',
    avatar: 'https://i.pravatar.cc/150?u=B',
  },
  userC: {
    userId: '507f1f77bcf86cd799439013',
    username: 'test_user_C',
    avatar: 'https://i.pravatar.cc/150?u=C',
  },
  userD: {
    userId: '507f1f77bcf86cd799439014',
    username: 'test_user_D',
    avatar: 'https://i.pravatar.cc/150?u=D',
  },
};

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string>;
      user: object;
    }>();

    const mockUserKey = request.headers['x-mock-user'] ?? 'userA';
    request.user = MOCK_USERS[mockUserKey] ?? MOCK_USERS['userA'];
    // canActivate(context: ExecutionContext): boolean {
    //   const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    //   request.user = {
    //     userId: '507f1f77bcf86cd799439011',
    //     username: 'test_user',
    //     avatar: 'https://example.com/avatar.png',
    //   };
    return true; // luôn cho qua
  }
}
