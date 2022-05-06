import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ACGuard, Role, UseRoles } from 'nest-access-control';
import { JwtAuthGuard } from '@modules/auth/guards';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, ACGuard),
    UseRoles(...roles),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Error: Unauthorized',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Error: Forbidden',
      schema: {
        example: {
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        },
      },
    }),
  );
}
