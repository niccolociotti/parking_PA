import { Router } from 'express';
import { ParkingCapacityDao } from '../dao/parkingCapacityDAO';
import { ParkingCapacityController } from '../controllers/ParkingCapacityController';
import { ParkingCapacityService } from '../services/parkingCapacityService';


const router = Router();

const parkingCapacityDao = new ParkingCapacityDao();


const parkingCapacityService = new ParkingCapacityService(parkingCapacityDao);
const parkingCapacityController = new ParkingCapacityController(parkingCapacityService);

router.get('/parcheggi/:id/:vehicle/:data/:period', parkingCapacityController.getParkingCapacityByIdAndVehicleAndDayAndPeriod);           

export default router;