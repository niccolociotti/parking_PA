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

const parkingDao = new ParkingDao();
const parkingService = new ParkingService(parkingDao);
const parkingController = new ParkingController(parkingService)

const parkingCapacityDao = new ParkingCapacityDao();
const parkingCapacityService = new ParkingCapacityService(parkingCapacityDao);
const parkingCapacityController = new ParkingCapacityController(parkingCapacityService);

const reservationDAO = new ReservationDAO();
const reservationService = new ReservationService(reservationDAO,parkingDao);
const reservationController = new ReservationController(reservationService);

router.get('/parcheggi', parkingController.listParking);
router.get('/parcheggio/:id', parkingController.getParking);
router.get('/posti/:id/:vehicleType' , parkingCapacityController.getParkingCapacityByIdAndVehicle);

router.get("/prenotazioni", reservationController.list);

router.get('/parcheggi/:id/:vehicleType/:data/:period', parkingCapacityController.getParkingCapacityByIdAndVehicleAndDayAndPeriod);           

export default router;