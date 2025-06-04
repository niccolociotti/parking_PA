import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import jwt from 'jsonwebtoken';
import { CustomError, ErrorFactory } from '../factories/errorFactory';
import { UserDAO } from '../dao/userDAO';
import { Roles } from '../utils/Roles';

const userDAO = new UserDAO(); 
const authService = new AuthService(userDAO);

export class AuthMiddleware {
constructor(private authService: AuthService) {}

  authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ErrorFactory.unauthorized('Token mancante o non valido');
    }

    const token = authHeader.split(' ')[1];
    const user = this.authService.verifyToken(token);
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

isUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== Roles.AUTOMOBILISTA) {
      return next(ErrorFactory.forbidden('Accesso negato: utente non autorizzato'));
    }
    next();
  }

}



