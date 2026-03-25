export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class InvalidGameTokenError extends ApiError {
  constructor() {
    super('Invalid game token.', 400);
  }
}

export class ConfigurationError extends ApiError {
  constructor(message: string) {
    super(message, 500);
  }
}
