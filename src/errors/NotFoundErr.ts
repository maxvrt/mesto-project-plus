class NotFoundErr extends Error {
  statusCode: number;
  name: string;
  message: string;
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
    this.message = message;
  }
}

export default NotFoundErr;
