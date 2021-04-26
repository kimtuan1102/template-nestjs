import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType } from '../../../common/constants/role.type';

export class UserDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  password: string;

  @ApiPropertyOptional()
  phone_number: string;

  @ApiPropertyOptional({ enum: RoleType })
  role: RoleType;
}
