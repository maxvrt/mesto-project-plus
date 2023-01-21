import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import User, { IGetUserRequest, IUser } from '../models/user';

const { JWT_SECRET = 'secret-key' } = process.env;

export default (req: IGetUserRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const id = new ObjectId((payload as JwtPayload)._id);
  // из пейлоада извлекается только _id
  req.user = { _id: id };
  return next();
};
