import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyExistException extends BadRequestException {
  constructor(error?: string) {
    super('Email already exist', error);
  }
}
