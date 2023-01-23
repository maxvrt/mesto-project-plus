import CommonError from './CommonError';

class DoubleErr extends CommonError {
  statusCode: number;

  name: string;

  message: string;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
    this.name = 'DoubleErr';
    this.message = message;
  }
}

export default DoubleErr;
