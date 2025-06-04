import { Router } from "express";
import { FineController } from "../controllers/fineController";
import { FineService } from "../services/fineService";
import { FineDAO } from "../dao/fineDAO";
import { ReservationDAO } from "../dao/reservationDAO";
import { AuthService } from "../services/authService";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { UserDAO } from "../dao/userDAO";

const router = Router();

const fineDAO = new FineDAO();
const reservationDAO = new ReservationDAO(); 
const fineService = new FineService(fineDAO,reservationDAO);
const fineController = new FineController(fineService);
const userDAO = new UserDAO();
const authService = new AuthService(userDAO);
const authMiddleware = new AuthMiddleware(authService);

router.use(authMiddleware.isUser);

router.post("/fine",fineController.createFine);

export default router;