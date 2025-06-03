import jwt from 'jsonwebtoken';
import { privateKey, publicKey } from '../utils/jwt';
import { UserPayload } from '../@types/CustomUser';

export class AuthService {
  generateToken(payload: UserPayload): string {
    return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
  }

  verifyToken(token: string): UserPayload {
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as UserPayload;
  }
}