import CommonError from './CommonError';

class NotFoundErr extends CommonError {
  statusCode: number;

  name: string;

  message: string;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundErr';
    this.message = message;
  }
}

export default NotFoundErr;
