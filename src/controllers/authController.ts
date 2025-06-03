import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { UserPayload } from '../@types/CustomUser';

const authService = new AuthService();

export class AuthController {
  login(req: Request, res: Response) {
    // Normalmente controllerbbe anche username/password dal req.body
    const payload : UserPayload = { id: '1' ,name: 'Luca', role : 'admin' };
    const token = authService.generateToken(payload);     
    res.json({ token, expiresIn: '1h' });
  }
}