import { Router, Request, Response} from 'express';
import { AuthController } from '../controllers/authController';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { User } from '../models/user';
import { UserDAO } from '../dao/userDAO';
import { AuthService } from '../services/authService';

const router = Router();
const userDAO = new UserDAO();
const authService = new AuthService(userDAO);
const authController = new AuthController(authService);

router.post('/login', authController.login);

export default router;
