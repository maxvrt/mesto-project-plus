import CommonError from './CommonError';

class ForbiddenErr extends CommonError {
  statusCode: number;

  name: string;

  message: string;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
    this.name = 'ForbiddenErr';
    this.message = message;
  }
}

export default ForbiddenErr;
