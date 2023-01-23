import CommonError from './CommonError';

class BadRequestErr extends CommonError {
  statusCode: number;

  name: string;

  message: string;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
    this.name = 'BadRequestError';
    this.message = message;
  }
}

export default BadRequestErr;
