import mongoose from 'mongoose';
import { Request } from 'express';
import validator from 'validator';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import BadRequestError from '../errors/BadRequestErr';

export interface IUser {
  _id: ObjectId;
  email?: string;
  password?: string;
  name?: string;
  about?: string;
  avatar?: string;
}
export interface IGetUserRequest extends Request {
  user?: IUser;
}

// для типизации
interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
    Promise<mongoose.Document<IUser>>
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 30,
    validate: {
      validator(v: string) {
        return validator.isEmail(v);
      },
      message: 'Неправильный email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 130,
    select: false,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    minlength: 4,
    maxlength: 230,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/,
  },
});

// собственный метод модели для логина - findUserByCredentials
userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  // this - это модель User, select('+password') возвращает пароль при аутентификации
  return this.findOne({ email }).select('+password')
    .then((user: IUser) => {
      // не нашёлся — отклоняем промис
      if (!user) {
        return new BadRequestError('Неправильные поля пользователя. Пользователь не найден.');
      }
      // нашёлся — сравниваем хеши
      if (user.password) {
        return bcrypt.compare(password, user.password)
          .then((matched:any) => {
            if (!matched) {
              return new BadRequestError('Неправильные поля пользователя. Пользователь не найден.');
            }
            return user;
          });
      }
      return new BadRequestError('Неправильные поля пользователя. Пользователь не найден.');
    });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
