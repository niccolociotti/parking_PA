import { Router } from "express";
import { ReservationController } from "../controllers/reservationController";
import { ReservationService } from "../services/reservationService";
import { ReservationDAO } from "../dao/reservationDAO";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { AuthService } from "../services/authService";
import { UserDAO } from "../dao/userDAO";

const router = Router();

const reservationDAO = new ReservationDAO();
const reservationService = new ReservationService(reservationDAO);
const reservationController = new ReservationController(reservationService);
const userDAO = new UserDAO();
const authService = new AuthService(userDAO);
const authMiddleware = new AuthMiddleware(authService);

router.use(authMiddleware.authenticateToken);

router.post("/reservation", reservationController.create);
router.get("/reservations", reservationController.list);
router.get("/reservation/:id", reservationController.listById);
router.get("/reservations/user/:userId", reservationController.listByUser);
router.delete("/reservation/:id", reservationController.delete);
router.post("/reservation/update/:id", reservationController.updateStatus);

export default router;
