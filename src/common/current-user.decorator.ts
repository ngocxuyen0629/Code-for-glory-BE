import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRole } from './enums';

/**
 * The user payload attached to `request.user` by JwtStrategy.
 * Keep small — anything else should be fetched in the service layer.
 */
export interface AuthenticatedUser {
  userId: Types.ObjectId;
  email: string;
  username: string;
  role: UserRole;
}

/**
 * Inject the authenticated user (or a single field) into a controller method.
 *
 * @example
 *   findMe(@CurrentUser() user: AuthenticatedUser) { ... }
 *   findMe(@CurrentUser('userId') id: Types.ObjectId) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user?: AuthenticatedUser }>();
    const user = request.user;
    if (!user) return undefined;
    return data ? user[data] : user;
  },
);
