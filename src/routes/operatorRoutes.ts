import { Router } from "express";
import { ReservationController } from "../controllers/reservationController";
import { UserDAO } from "../dao/userDAO";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { AuthService } from "../services/authService";
import { ReservationDAO } from "../dao/reservationDAO";
import { ReservationService } from "../services/reservationService";
import { ParkingDao } from "../dao/ParkingDao";

const router = Router();

const parkingDAO = new ParkingDao(); 
const reservationDAO = new ReservationDAO();
const reservationService = new ReservationService(reservationDAO,parkingDAO);
const reservationController = new ReservationController(reservationService);
const userDAO = new UserDAO();
const authService = new AuthService(userDAO);
const authMiddleware = new AuthMiddleware(authService);

router.use(authMiddleware.authenticateToken);
router.use(authMiddleware.isOperator);
router.post('/reports/reservations',reservationController.postReservationsReport);

export default router;