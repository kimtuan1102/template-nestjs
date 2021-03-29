import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  roles: [string];
}
