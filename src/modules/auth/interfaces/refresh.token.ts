import { Document } from 'mongoose';

export interface RefreshToken extends Document {
  userId: string;
  refreshToken: string;
}
