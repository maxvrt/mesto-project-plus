class BadRequestErr extends Error {
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
