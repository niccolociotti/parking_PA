import { Router } from "express";
import { ReservationController } from "../controllers/reservationController";
import { ReservationService } from "../services/reservationService";
import { ReservationDAO } from "../dao/reservationDAO";

const router = Router();

const reservationDAO = new ReservationDAO();
const reservationService = new ReservationService(reservationDAO);
const reservationController = new ReservationController(reservationService);

router.post("/reservation", reservationController.create);
router.get("/reservations", reservationController.list);
router.get("/reservation/:id", reservationController.listById);
router.get("/reservations/user/:userId", reservationController.listByUser);
router.delete("/reservation/:id", reservationController.delete);
router.post("/reservation/update/:id", reservationController.updateStatus);

export default router;
