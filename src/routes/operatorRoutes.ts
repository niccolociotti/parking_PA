import { Router } from "express";
import { ReservationController } from "../controllers/reservationController";
import { UserDAO } from "../dao/userDAO";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { AuthService } from "../services/authService";
import { ReservationDAO } from "../dao/reservationDAO";
import { ReservationService } from "../services/reservationService";
import { ParkingDao } from "../dao/ParkingDao";
import { ParkingController } from "../controllers/ParkingController";
import { ParkingService } from "../services/ParkingService";
import { ParkingCapacityDao } from "../dao/parkingCapacityDAO";

const router = Router();

const parkingCapacityDAO = new ParkingCapacityDao()
const reservationDAO = new ReservationDAO();
const parkingDAO = new ParkingDao(); 
const parkingService = new ParkingService(parkingDAO,reservationDAO,parkingCapacityDAO);
const parkingController = new ParkingController(parkingService);
const reservationService = new ReservationService(reservationDAO,parkingDAO);
const reservationController = new ReservationController(reservationService);
const userDAO = new UserDAO();
const authService = new AuthService(userDAO);
const authMiddleware = new AuthMiddleware(authService);

router.use(authMiddleware.authenticateToken);
router.use(authMiddleware.isOperator);
router.post('/reports/reservations',reservationController.postReservationsReport);
router.get('/stats/:parkingId',parkingController.getStats);

export default router;