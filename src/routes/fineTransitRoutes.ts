import { Router } from "express";
import { FineTransitController } from "../controllers/fineTransitController";
import { FineService } from "../services/fineService";
import { FineDAO } from "../dao/fineDAO";
import { TransitService } from "../services/transitService";
import { AuthService } from "../services/authService";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { UserDAO } from "../dao/userDAO";
import { TransitDAO } from "../dao/transitDAO";
import { ReservationDAO } from "../dao/reservationDAO";
import { ParkingService } from "../services/ParkingService";
import { ParkingDao } from "../dao/ParkingDao";


const router = Router();

const fineDAO = new FineDAO();
const transitDAO = new TransitDAO();
const parkingDao = new ParkingDao();
const reservatioDAO = new ReservationDAO();
const fineService = new FineService(fineDAO);
const transitService = new TransitService(transitDAO,reservatioDAO,fineService);
const parkingService = new ParkingService(parkingDao,reservatioDAO);
const fineController = new FineTransitController(transitService,parkingService);
const userDAO = new UserDAO();
const authService = new AuthService(userDAO);
const authMiddleware = new AuthMiddleware(authService);

/**
 * Middleware per autenticare l'utente e verificare il ruolo.
 * @param res - La risposta HTTP.
 * @param next - La funzione per passare al middleware successivo.
 * @throws CustomError Se il token è mancante, scaduto o non valido, o se l'utente non ha il ruolo richiesto.
 * @returns Passa al middleware successivo se l'autenticazione e l'autorizzazione hanno successo.
 */
router.use(authMiddleware.authenticateToken);

/**
 * Middleware per verificare se l'utente ha il ruolo di automobilista.   
 * @description Questo middleware controlla se l'utente autenticato ha il ruolo di automobilista.
 * @throws CustomError Se l'utente non è autenticato o non ha il ruolo di automobilista.
 * @returns Passa al middleware successivo se l'utente ha il ruolo corretto.
 */
router.use(authMiddleware.isUser);

/**
 * @route Post /transit/:type
 * @description Registra un transito (ingresso o uscita) di un veicolo in un parcheggio, oppure genera una multa 
 * se il transito non è valido.
 * @returns Restituisce una risposta HTTP con il transito o la multa creata.
 */
router.post("/transit/:type",fineController.createFineOrTransit);

export default router;