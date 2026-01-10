import { Types } from "mongoose";

export interface RefreshToken {
  token: string;
  createdAt: Date;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Types.ObjectId;
  isActive: boolean;
  lastLogin?: Date;
  refreshTokens: RefreshToken[];
}
