import { IUser } from '@interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const AuthUser = createParamDecorator(
  (data: keyof IUser, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest<Request>().user as IUser;

    return data ? user && user[data] : user;
  },
);
