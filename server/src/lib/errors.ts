export class BadRequestError extends Error {}

export class InvalidGameTokenError extends Error {
  constructor() {
    super('Invalid game token.');
  }
}
