import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  phone_number: string;
}
