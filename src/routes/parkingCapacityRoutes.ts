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
const reservationDAO = new ReservationDAO();
const parkingCapacityDao = new ParkingCapacityDao();
const parkingService = new ParkingService(parkingDao,reservationDAO,parkingCapacityDao);
const parkingController = new ParkingController(parkingService)


const parkingCapacityService = new ParkingCapacityService(parkingCapacityDao);
const parkingCapacityController = new ParkingCapacityController(parkingCapacityService);

const reservationService = new ReservationService(reservationDAO,parkingDao);
const reservationController = new ReservationController(reservationService);

router.get('/parcheggi', parkingController.listParking);
router.get('/parcheggio/:id', parkingController.getParking);
router.get('/posti/:id/:vehicle' , parkingCapacityController.getParkingCapacityByIdAndVehicle);

router.get("/prenotazioni", reservationController.list);

router.get('/parcheggi/:id/:vehicle/:data/:period', parkingCapacityController.getParkingCapacityByIdAndVehicleAndDayAndPeriod);           

export default router;