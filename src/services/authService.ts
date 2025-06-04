import jwt from 'jsonwebtoken';
import { privateKey, publicKey } from '../utils/jwt';
import { UserPayload } from '../@types/CustomUser';
import { UserDAO } from '../dao/userDAO';
import { ErrorFactory } from '../factories/errorFactory';

export class AuthService {

  constructor(private userDAO: UserDAO) {}

  generateToken(payload: UserPayload): string {
    return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
  }

  verifyToken(token: string): UserPayload {
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as UserPayload;
  }

  login = async (email: string, password: string): Promise<string> => {
    const user = await this.userDAO.findByEmail(email);
    if (!user) {
      throw ErrorFactory.entityNotFound('User');
    }
    if (user.password !== password) {
      throw ErrorFactory.unauthorized('Invalid password');
    }

    const payload: UserPayload = {
      id: user.id,
      role: user.role
    };

    return this.generateToken(payload);
  }
}