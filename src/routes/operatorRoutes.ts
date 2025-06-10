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
import { OperatorController } from "../controllers/operatorController";
import { OperatorService } from "../services/operatorService";
import { UUIDMiddleware } from "../middleware/UUIDMiddleware";

const router = Router();  // nuova istanza di Express Router

/**
 * Inizializzazione delle dipendenze per le rotte degli operatori.
 * - `ParkingCapacityDao`: gestisce l'accesso ai dati delle capacità dei parcheggi.
 * - `ReservationDAO`: gestisce l'accesso ai dati delle prenotazioni.
 * - `ParkingDao`: gestisce l'accesso ai dati dei parcheggi.
 * - `ParkingService`: fornisce metodi per operazioni sui parcheggi, come ottenere statistiche.
 * - `ParkingController`: espone le rotte HTTP per le operazioni sui parcheggi.
 * - `ReservationService`: fornisce metodi per operazioni sulle prenotazioni, come generare report.
 * - `ReservationController`: espone le rotte HTTP per le operazioni sulle prenotazioni.
 * - `UserDAO`: gestisce l'accesso ai dati degli utenti.
 * - `AuthService`: fornisce metodi per l'autenticazione degli utenti.
 * - `AuthMiddleware`: gestisce l'autenticazione e l'autorizzazione degli utenti. 
 * @description Queste rotte sono accessibili solo agli operatori autenticati e forniscono funzionalità per ottenere report sulle prenotazioni e statistiche sui parcheggi.
 */
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
const operatoService = new OperatorService(userDAO);
const operatorController = new OperatorController(operatoService);
const uuidMiddleware = new UUIDMiddleware();

/**
 * Middleware per autenticare l'utente.
 * Questo middleware viene applicato a tutte le rotte definite in questo file.
 * Gli utenti devono essere autenticati per accedere a queste rotte.
 * @description Se l'utente non è autenticato, viene restituito un errore 401 (Unauthorized).
 * @throws Error Se l'utente non è autorizzato ad accedere a queste rotte.
 */
router.use(authMiddleware.authenticateToken);

/**
 * Middleware per verificare se l'utente è un operatore.
 * Questo middleware viene applicato a tutte le rotte definite in questo file.
 * Gli operatori sono autorizzati a generare report sulle prenotazioni e ottenere statistiche sui parcheggi.
 * @description Se l'utente non è un operatore, viene restituito un errore 403 (Forbidden).
 * @throws Error Se l'utente non è autorizzato ad accedere a queste rotte.
 */
router.use(authMiddleware.isOperator);

/**
 * @route POST /reports/reservations
 * @description Questa rotta consente agli operatori di generare un report sulle prenotazioni.
 * Gli operatori possono inviare una richiesta POST con i parametri necessari per filtrare le prenotazioni.
 * Il controller `reservationController` gestisce la logica per generare il report e restituirlo come risposta.
 * @returns Un oggetto contenente i dati del report sulle prenotazioni.
 * @throws Se si verifica un errore durante la generazione del report.
 */
router.post('/reports/reservations',reservationController.postReservationsReport);

/**
 * @route GET /stats/:parkingId
 * @description Questa rotta consente agli operatori di ottenere le statistiche di un parcheggio specifico.
 * Gli operatori possono inviare una richiesta GET con l'ID del parcheggio come parametro.
 * Il controller `parkingController` gestisce la logica per recuperare le statistiche del parcheggio e restituirle come risposta.
 * @param {string} parkingId - ID del parcheggio di cui ottenere le statistiche.
 * @returns Un oggetto contenente le statistiche del parcheggio richiesto.
 * @throws Se si verifica un errore durante il recupero delle statistiche del parcheggio.
 */
router.get('/stats/:parkingId',uuidMiddleware.validateUUID,parkingController.getStats);

/**
 * @route PUT /user/tokens
 * @description Questa rotta consente agli operatori di aggiornare i token degli utenti.
 * Gli operatori possono inviare una richiesta POST per aggiornare i token associati agli utenti.
 * Il controller `operatorController` gestisce la logica per aggiornare i token e restituire una risposta appropriata.
 * @returns Un oggetto contenente un messaggio di conferma dell'aggiornamento dei token.
 * @throws Se si verifica un errore durante l'aggiornamento dei token.
 */

router.put('/user/tokens', operatorController.updateTokens);

export default router;