import { Router, Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { ParkingController } from '../controllers/ParkingController';
import { ParkingService } from "../services/ParkingService";
import { ParkingDao } from '../dao/ParkingDao';

const router = Router();


const parkingDao = new ParkingDao();
const parkingService = new ParkingService(parkingDao);
const parkingController = new ParkingController(parkingService)

router.post('/parking',  parkingController.createParking);
router.get('/parkinglist', parkingController.listParking);
router.delete('/park', parkingController.DeleteParking);
router.get('/parkingspecifico', parkingController.getParking);

export default router;