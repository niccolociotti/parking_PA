import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { StatusCodes } from 'http-status-codes';

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email,password);  
      res.status(StatusCodes.OK).json({ token, message: 'Login successful' });
    } catch (error) {
      next(error);
    }
  }
}