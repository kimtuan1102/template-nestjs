import { Exclude } from 'class-transformer';
import { RoleType } from '../../common/constants/role.type';

export class UserEntity {
  name: string;
  email: string;
  role: RoleType;
  phone_number: string;
  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
