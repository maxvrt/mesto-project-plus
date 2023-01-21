class AuthErr extends Error {
  statusCode: number;

  name: string;

  message: string;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
    this.name = 'AuthError';
    this.message = message;
  }
}

export default AuthErr;
