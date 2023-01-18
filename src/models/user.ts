import mongoose from 'mongoose';
import { Request } from 'express';

export interface IUser {
  _id: string;
  name?: string;
  about?: string;
  avatar?: string;
}
export interface IGetUserRequest extends Request {
  user?: IUser;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator(v: String) {
        return v.length >= 2 && v.length <= 30;
      },
      message: 'Длинна имени должна быть больше 2',
    }
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 230,
  },
});

export default mongoose.model<IUser>('user', userSchema);
