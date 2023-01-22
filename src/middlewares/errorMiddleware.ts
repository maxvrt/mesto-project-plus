import { NextFunction, Response, Request } from 'express';
import CommonError from '../errors/CommonError';
import BadRequestError from '../errors/BadRequestErr';
import AuthError from '../errors/AuthErr';
import NotFoundErr from '../errors/NotFoundErr';

const errorHandler = (err: CommonError, req: Request, res:Response, next: NextFunction) => {
  if (err instanceof BadRequestError || err instanceof AuthError || err instanceof NotFoundErr) {
    res.status(err.statusCode)
      .send({ message: err.message });
  }
  res.status(500).send({ message: `Общая ошибка: ${err.message} Type:${err.name}` });
  next();
};

export default errorHandler;
