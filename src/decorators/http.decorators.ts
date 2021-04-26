import { RoleType } from '../common/constants/role.type';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FptIdAuthGuard, JWTAuthGuard } from '../guards/auth.guard';

export function JWTAuth(...roles: RoleType[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JWTAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}

export function FPTIDAuth() {
  return applyDecorators(
    UseGuards(FptIdAuthGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
