import { Router } from "express";
import { ReservationController } from "../controllers/reservationController";
import { ReservationService } from "../services/reservationService";
import { ReservationDAO } from "../dao/reservationDAO";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { AuthService } from "../services/authService";
import { UserDAO } from "../dao/userDAO";
import { PaymentService } from "../services/paymentService";
import { ParkingCapacityDao } from "../dao/parkingCapacityDAO";
import { PaymentController } from "../controllers/paymentController";
import { ParkingDao} from "../dao/ParkingDao";
import { ParkingMiddleware } from "../middleware/parkingMiddleware";
import { PaymentDAO } from "../dao/paymentDAO";
import { UUIDMiddleware } from "../middleware/UUIDMiddleware";

const router = Router();

const parkingCapacityDAO = new ParkingCapacityDao();
const parkingDAO = new ParkingDao(); 
const paymentDAO = new PaymentDAO();
const reservationDAO = new ReservationDAO();
const reservationService = new ReservationService(reservationDAO,parkingDAO);
const reservationController = new ReservationController(reservationService);
const userDAO = new UserDAO();
const authService = new AuthService(userDAO);
const paymentService = new PaymentService(userDAO,parkingCapacityDAO,paymentDAO,reservationDAO);
const paymentController = new PaymentController(paymentService,reservationService);
const authMiddleware = new AuthMiddleware(authService);
const parkingMiddleware = new ParkingMiddleware(parkingCapacityDAO,reservationDAO,parkingDAO);
const uuidMiddleware = new UUIDMiddleware();

router.use(authMiddleware.authenticateToken);
router.use(authMiddleware.isUser);


/**
 * Rotta per creare una prenotazione
 * @route POST /reservation - Crea una prenotazione per un parcheggio     
 * @param req - Richiesta contenente i dati della prenotazione
 * @param res - Risposta da inviare al client
 * @param next - Funzione per passare al middleware successivo
 */
router.post("/reservation", parkingMiddleware.checkCapacity, parkingMiddleware.checkParkingClosed, reservationController.create);

/**
 * Rotta per ottenere una prenotazione specifica
 * @route GET /reservation/:id - Restituisce i dettagli di una prenotazione specifica
 * @param req - Richiesta contenente l'ID della prenotazione
 * @param res - Risposta contenente i dettagli della prenotazione
 * @param next - Funzione per passare al middleware successivo
 */
router.get("/reservation/:id",uuidMiddleware.validateUUID ,reservationController.listById);

/**
 * Rotta per ottenere le prenotazioni di un utente specifico
 * @route GET /reservations - Restituisce le prenotazioni di un utente specifico
 * @param req - Richiesta contenente l'ID dell'utente
 * @param res - Risposta contenente le prenotazioni dell'utente
 * @param next - Funzione per passare al middleware successivo
 */
router.get("/reservations", reservationController.listByUser);

/**
 * Rotta per eliminare una prenotazione
 * @route DELETE /reservation/:id - Elimina una prenotazione specifica
 * @param req - Richiesta contenente l'ID della prenotazione da eliminare
 * @param res - Risposta da inviare al client
 * @param next - Funzione per passare al middleware successivo
 */
router.delete("/reservation/:id",uuidMiddleware.validateUUID, reservationController.delete);

/**
 * Rotta per aggiornare una prenotazione
 * @route POST /reservation/update/:id - Aggiorna una prenotazione specifica
 * @param req - Richiesta contenente l'ID della prenotazione e i dati da aggiornare
 * @param res - Risposta da inviare al client
 * @param next - Funzione per passare al middleware successivo
 */
router.post("/reservation/update/:id",uuidMiddleware.validateUUID,reservationController.update);

/**
 * Rotta per effettuare il pagamento di una prenotazione
 * @route GET /pay/:paymentId - Effettua il pagamento di una prenotazione
 * @param req - Richiesta contenente l'ID del pagamento
 * @param res - Risposta da inviare al client
 * @param next - Funzione per passare al middleware successivo
 */
router.get('/pay/:paymentId',uuidMiddleware.validateUUID,paymentController.pay);

/**
 * Rotta per scaricare la ricevuta di pagamento di una prenotazione
 * @route GET /paymentslip/:id - Scarica la ricevuta di pagamento di una prenotazione
 * @param req - Richiesta contenente l'ID della prenotazione
 * @param res - Risposta da inviare al client
 * @param next - Funzione per passare al middleware successivo
 */
router.get('/paymentslip/:id',uuidMiddleware.validateUUID, paymentController.downloadPaymentSlip);

/**
 * Rotta per eliminare un pagamento di una prenotazione
 * @route DELETE /pay/:paymentId - Elimina il pagamento di una prenotazione
 * @param req - Richiesta contenente l'ID del pagamento da eliminare
 * @param res - Risposta da inviare al client
 * @param next - Funzione per passare al middleware successivo
 */
router.delete('/pay/:paymentId',uuidMiddleware.validateUUID, paymentController.deletePayment);

/**
 * Rotta per generare un report delle prenotazioni
 * @route POST /reservationsReport - Genera un report delle prenotazioni in base a targa, periodo e formato
 * @param req - Richiesta contenente le targhe, il periodo e il formato del report
 * @param res - Risposta da inviare al client
 * @param next - Funzione per passare al middleware successivo
 */
router.get('/reservationsReport/:format', reservationController.reportReservations);

export default router;
