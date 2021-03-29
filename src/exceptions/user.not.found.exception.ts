import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(err?: string) {
    super('User not found', err);
  }
}
