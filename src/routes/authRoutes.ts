import { Router, Request, Response} from 'express';
import { AuthController } from '../controllers/authController';
import { AuthMiddleware } from '../middleware/authMiddleware';

const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

router.post('/login', authController.login);
router.get('/verify', authMiddleware.authenticateToken, (req: Request, res: Response) => {
  // L'utente è stato salvato nel middleware
  const user = (req as any).user;
  res.json( user );
});


export default router;
