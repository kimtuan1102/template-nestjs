import * as mongoose from 'mongoose';
import validator from 'validator';
import { UtilsService } from '../../providers/utils.service';
export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: [true, 'NAME_IS_BLANK'],
    },
    email: {
      type: String,
      lowercase: true,
      validate: validator.isEmail,
      maxlength: 255,
      minlength: 6,
      required: [true, 'EMAIL_IS_BLANK'],
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 1024,
      required: [true, 'PASSWORD_IS_BLANK'],
      default: UtilsService.generateRandomString(10),
    },
    phone_number: {
      type: String,
      required: [true, 'PHONE_NUMBER_IS_BLANK'],
      default: '',
    },
    roles: {
      type: [String],
      default: ['user'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

//Hook save user
UserSchema.pre('save', async function (next: mongoose.HookNextFunction) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    this['password'] = await UtilsService.generateHash(this['password']);
    return next();
  } catch (err) {
    return next(err);
  }
});
