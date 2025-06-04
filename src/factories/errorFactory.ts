import { StatusCodes } from "http-status-codes";

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ErrorFactory {
  static createError(message: string, statusCode: number): CustomError {
    return new CustomError(message, statusCode);
  }

  static badRequest(message = "Bad Request"): CustomError {
    return this.createError(message, StatusCodes.BAD_REQUEST);
  }

  static unauthorized(message = "Unauthorized"): CustomError {
    return this.createError(message, StatusCodes.UNAUTHORIZED);
  }

  static forbidden(message = "Forbidden"): CustomError {
    return this.createError(message, StatusCodes.FORBIDDEN);
  }

  static entityNotFound(entity: string): CustomError {
  return this.createError(`${entity} not found`, StatusCodes.NOT_FOUND);
  }

  static customMessage(message: string, statusCode: number): CustomError {
    return this.createError(message, statusCode);
}

}

export { CustomError, ErrorFactory };
