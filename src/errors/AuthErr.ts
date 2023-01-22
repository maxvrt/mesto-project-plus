import CommonError from './CommonError';

class AuthErr extends CommonError {
  statusCode: number;

  name: string;

  message: string;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
    this.name = 'AuthErr';
    this.message = message;
  }
}

export default AuthErr;
