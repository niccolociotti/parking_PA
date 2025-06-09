import { Router } from 'express';
import { ParkingCapacityDao } from '../dao/parkingCapacityDAO';
import { ParkingCapacityController } from '../controllers/ParkingCapacityController';
import { ParkingCapacityService } from '../services/parkingCapacityService';
import { UUIDMiddleware } from '../middleware/UUIDMiddleware';

const router = Router(); //nuova istanza di Router

/** Importazione del ParkingCapacityDao, ParkingCapacityController e ParkingCapacityService
 * @description Questi moduli gestiscono le operazioni sulle capacità dei parcheggi.
 * * ParkingCapacityDao: Interagisce con il database per le capacità dei parcheggi.
 * * ParkingCapacityController: Gestisce le richieste HTTP relative alle capacità dei parcheggi.
 * * ParkingCapacityService: Fornisce metodi per trovare capacità dei parcheggi per ID, tipo di veicolo e periodo.
 * */
const parkingCapacityDao = new ParkingCapacityDao();
const parkingCapacityService = new ParkingCapacityService(parkingCapacityDao);
const parkingCapacityController = new ParkingCapacityController(parkingCapacityService);
const uuidMiddleware = new UUIDMiddleware();

/** Rotta per ottenere la capacità di un parcheggio per ID, tipo di veicolo, data e periodo.
 * @description Questa rotta gestisce le richieste GET per ottenere la disponibilità di un parcheggio specifico.
 * @param id - ID del parcheggio
 * @param vehicle - Tipo di veicolo
 * @param data - Data in formato ISO (YYYY-MM-DD)
 * @param period - Periodo in ore
 * */
router.get('/parcheggi/:id/:vehicle/:data/:period',uuidMiddleware.validateUUID, parkingCapacityController.getParkingCapacityByIdAndVehicleAndDayAndPeriod);           

export default router;