import { Router, Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from '../middleware/authMiddleware';
import { ParkingController } from '../controllers/ParkingController';
import { ParkingService } from "../services/ParkingService";
import { ParkingDao } from '../dao/ParkingDao';
import { UserDAO } from "../dao/userDAO";
import { AuthService } from "../services/authService";
import { ReservationDAO } from '../dao/reservationDAO';
import { ParkingCapacityDao } from '../dao/parkingCapacityDAO';
import { UUIDMiddleware } from '../middleware/UUIDMiddleware';

const router = Router(); //nuova istanza di Router

const parkingDao = new ParkingDao();
const reservationDAO = new ReservationDAO();
const parkingCapacityDao = new ParkingCapacityDao();
const parkingService = new ParkingService(parkingDao,reservationDAO, parkingCapacityDao);
const parkingController = new ParkingController(parkingService)
const userDAO = new UserDAO();
const authService = new AuthService(userDAO);
const authMiddleware = new AuthMiddleware(authService);
const uuidMiddleware = new UUIDMiddleware();

/** Middleware per autenticazione e autorizzazione degli operatori
 * @middleware authenticateToken
 * */
router.use(authMiddleware.authenticateToken);

/** Middleware per verificare se l'utente è un operatore
* @middleware isOperator
* */
router.use(authMiddleware.isOperator);

/** Rotte per la gestione dei parcheggi
 * @route POST /parking - Crea un nuovo parcheggio
 * @param req - Request contenente `name`, `address`, `capacity`, `closedData` nel body
 * @param res - Response con oggetto parcheggio creato
 * @param next - Funzione di middleware per gestire errori
 * */ 
router.post('/parking',  parkingController.createParking);

/** Rotte per la lista dei parcheggi
 * @route GET /parkings - Elenco dei parcheggi
 * @param req - Request senza parametri
 * @param res - Response con lista dei parcheggi
 * @param next - Funzione di middleware per gestire errori
 * */
router.get('/parkings', parkingController.listParking);

/** Rotte per eliminare un parcheggio
* @route DELETE /parking/:id - Eliminazione di un parcheggio
* @param req - Request con parametro `id` del parcheggio da eliminare
* @param res - Response con messaggio di conferma
* @param next - Funzione di middleware per gestire errori
* */
router.delete('/parking/:id',uuidMiddleware.validateUUID, parkingController.DeleteParking);

/** Rotte per ottenere le statistiche di un parcheggio
 * @route GET /stats/:parkingId - Ottenere le statistiche di un parcheggio
 * @param req - Request con parametro `parkingId`
 * @param res - Response con le statistiche del parcheggio
 * @param next - Funzione di middleware per gestire errori
 */
router.get('/parking/:id',uuidMiddleware.validateUUID, parkingController.getParking);

/** Rotte per aggiornare un parcheggio
 * @route POST /parking/update/:id - Aggiornamento di un parcheggio
 * @param req - Request con parametro `id` del parcheggio da aggiornare e i dati nel body
 * @param res - Response con il parcheggio aggiornato
 * @param next - Funzione di middleware per gestire errori
 */
router.post('/parking/update/:id',uuidMiddleware.validateUUID ,parkingController.UpdateParking);

export default router;