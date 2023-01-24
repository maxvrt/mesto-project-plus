import express, { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import User, { IGetUserRequest, IUser } from '../models/user';
import AuthError from '../errors/AuthErr';
import NotFoundError from '../errors/NotFoundErr';

const { JWT_SECRET = 'secret-key' } = process.env;

export default (req: IGetUserRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthError('Необходима авторизация.');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthError('Необходима авторизация.'));
  }
  const id = new ObjectId((payload as JwtPayload)._id);
  // из пейлоада извлекается только _id
  req.user = { _id: id };
  return next();
};
