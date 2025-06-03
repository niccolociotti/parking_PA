import { Router } from "express";
import { FineController } from "../controllers/fineController";
import { FineService } from "../services/fineService";
import { FineDAO } from "../dao/fineDAO";
import { ReservationDAO } from "../dao/reservationDAO";

const router = Router();

const fineDAO = new FineDAO();
const reservationDAO = new ReservationDAO(); 
const fineService = new FineService(fineDAO,reservationDAO);
const fineController = new FineController(fineService);


router.post("/fine",fineController.createFine);

export default router;