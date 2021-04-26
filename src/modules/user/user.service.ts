import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { User } from './user.interface';
import { EmailAlreadyExistException } from '../../exceptions/email.already.exist.exception';
import { UserUpdateDto } from './dto/user.update.dto';
import { UserNotFoundException } from '../../exceptions/user.not.found.exception';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async createUser(userDto: UserDto): Promise<User> {
    const user = new this.userModel(userDto);
    await this.isEmailUnique(user.email);
    await user.save();
    return user;
  }
  async createOrUpdateUserByEmail(
    email: string,
    userUpdateDto: UserUpdateDto,
  ): Promise<User> {
    return this.userModel.findOneAndUpdate({ email: email }, userUpdateDto, {
      upsert: true,
      setDefaultsOnInsert: true,
      new: true,
    });
  }
  async findUserById(userId: string): Promise<User> {
    const user = await this.userModel.findOne({
      _id: userId,
    });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email, verified: true });
    if (!user) {
      throw new NotFoundException({ type: 'accountDoesNotExist' });
    }
    return user;
  }
  // ***************************************************************************
  //                                 PRIVATE METHOD
  // ***************************************************************************
  private async isEmailUnique(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new EmailAlreadyExistException();
    }
  }
}
