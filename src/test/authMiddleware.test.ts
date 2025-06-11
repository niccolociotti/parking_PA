import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../middleware/authMiddleware';
import jwt from 'jsonwebtoken';
import { CustomError } from '../factories/errorFactory';
import { Roles } from '../utils/Roles';
import { StatusCodes } from 'http-status-codes';

describe('AuthMiddleware', () => {
  let mockAuthService: any;
  let middleware: AuthMiddleware;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockAuthService = {
      verifyToken: jest.fn(),
    };
    middleware = new AuthMiddleware(mockAuthService);
    next = jest.fn();
  });

  describe('authenticateToken', () => {
    it('chiama next con errore se Authorization è assente', () => {
      req = { headers: {} };
      middleware.authenticateToken(req as Request, {} as Response, next);
      const err = (next as jest.Mock).mock.calls[0][0];
      expect(err).toBeInstanceOf(CustomError);
      expect(err.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('chiama next con errore se token è malformato', () => {
      req = { headers: { authorization: 'InvalidFormat' } };
      middleware.authenticateToken(req as Request, {} as Response, next);
      const err = (next as jest.Mock).mock.calls[0][0];
      expect(err).toBeInstanceOf(CustomError);
      expect(err.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('aggiunge user e chiama next se token è valido', () => {
      const mockUser = { id: '123', role: Roles.AUTOMOBILISTA };
      req = { headers: { authorization: 'Bearer valid.token.here' } };

      mockAuthService.verifyToken.mockReturnValue(mockUser);

      middleware.authenticateToken(req as Request, {} as Response, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalledWith();
    });

    it('chiama next con TokenExpiredError', () => {
      const expiredError = new jwt.TokenExpiredError('Token expired', new Date());
      mockAuthService.verifyToken.mockImplementation(() => { throw expiredError; });

      req = { headers: { authorization: 'Bearer expired.token' } };

      middleware.authenticateToken(req as Request, {} as Response, next);

      const err = (next as jest.Mock).mock.calls[0][0];
      expect(err).toBeInstanceOf(CustomError);
      expect(err.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });

    it('chiama next con errore generico se verifyToken lancia errore', () => {
      mockAuthService.verifyToken.mockImplementation(() => { throw new Error('BOOM') });
      req = { headers: { authorization: 'Bearer bad.token' } };

      middleware.authenticateToken(req as Request, {} as Response, next);

      const err = (next as jest.Mock).mock.calls[0][0];
      expect(err).toBeInstanceOf(CustomError);
      expect(err.statusCode).toBe(StatusCodes.FORBIDDEN);
    });
  });

  describe('isUser', () => {
    it('passa se ruolo è AUTOMOBILISTA', () => {
      req = { user: { id:"user" ,role: Roles.AUTOMOBILISTA } };
      middleware.isUser(req as Request, {} as Response, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('blocca se ruolo NON è AUTOMOBILISTA', () => {
      req = { user: { id:"user",role: Roles.OPERATORE } };
      middleware.isUser(req as Request, {} as Response, next);
      const err = (next as jest.Mock).mock.calls[0][0];
      expect(err).toBeInstanceOf(CustomError);
      expect(err.statusCode).toBe(StatusCodes.FORBIDDEN);
    });
  });

  describe('isOperator', () => {
    it('passa se ruolo è OPERATORE', () => {
      req = { user: { id:"user",role: Roles.OPERATORE } };
      middleware.isOperator(req as Request, {} as Response, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('blocca se ruolo NON è OPERATORE', () => {
      req = { user: { id:"user",role: Roles.AUTOMOBILISTA } };
      middleware.isOperator(req as Request, {} as Response, next);
      const err = (next as jest.Mock).mock.calls[0][0];
      expect(err).toBeInstanceOf(CustomError);
      expect(err.statusCode).toBe(StatusCodes.FORBIDDEN);
    });
  });
});
