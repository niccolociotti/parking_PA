import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import jwt from 'jsonwebtoken';
import { CustomError, ErrorFactory } from '../factories/errorFactory';

const authService = new AuthService();

export class AuthMiddleware {
  authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ErrorFactory.unauthorized('Token mancante o non valido');
    }

    const token = authHeader.split(' ')[1];
    const user = authService.verifyToken(token);
    req.user = user;

    next();

  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(ErrorFactory.unauthorized('Token scaduto'));
    }
    if (err instanceof CustomError) {
      return next(err);
    }
    return next(ErrorFactory.forbidden('Token non valido'));
  }
};

}



