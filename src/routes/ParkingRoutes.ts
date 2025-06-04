import { Router, Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { ParkingController } from '../controllers/ParkingController';
import { ParkingService } from "../services/ParkingService";
import { ParkingDao } from '../dao/ParkingDao';
import { UserDAO } from "../dao/userDAO";
import { AuthService } from "../services/authService";

const router = Router();

const parkingDao = new ParkingDao();
const parkingService = new ParkingService(parkingDao);
const parkingController = new ParkingController(parkingService)
const userDAO = new UserDAO();
const authService = new AuthService(userDAO);
const authMiddleware = new AuthMiddleware(authService);

router.use(authMiddleware.authenticateToken);
router.use(authMiddleware.isOperator);

router.post('/parking',  parkingController.createParking);
router.get('/parkings', parkingController.listParking);
router.delete('/parking/:id', parkingController.DeleteParking);
router.get('/parking/:id', parkingController.getParking);
router.post('/parking/update/:id', parkingController.UpdateParking);

export default router;