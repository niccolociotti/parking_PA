import { Router } from 'express';
import { ParkingController } from '../controllers/ParkingController';
import { ParkingService } from "../services/ParkingService";
import { ParkingDao } from '../dao/ParkingDao';
import { ParkingCapacityDao } from '../dao/parkingCapacityDAO';
import { ParkingCapacityController } from '../controllers/ParkingCapacityController';
import { ParkingCapacityService } from '../services/parkingCapacityService';
import { ReservationController } from "../controllers/reservationController";
import { ReservationService } from "../services/reservationService";
import { ReservationDAO } from "../dao/reservationDAO";

const router = Router();

const parkingCapacityDao = new ParkingCapacityDao();


const parkingCapacityService = new ParkingCapacityService(parkingCapacityDao);
const parkingCapacityController = new ParkingCapacityController(parkingCapacityService);

router.get('/parcheggi/:id/:vehicle/:data/:period', parkingCapacityController.getParkingCapacityByIdAndVehicleAndDayAndPeriod);           

export default router;