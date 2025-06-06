import { Request, Response, NextFunction } from 'express';
import { ErrorFactory } from '../factories/errorFactory';
import { Vehicles } from '../utils/Vehicles';
import { ParkingCapacityDao } from '../dao/parkingCapacityDAO';
import { ReservationDAO } from '../dao/reservationDAO';
import { ParkingDao } from '../dao/ParkingDao';
import { parseDateString } from '../helpers/dateParser';

/**
 * Middleware per la gestione delle logiche di capacità e chiusura dei parcheggi.
 * Utilizzato nelle rotte di creazione prenotazione per garantire che non vengano superati i limiti di capacità
 * e che non si possa prenotare in giorni di chiusura.
 *
 * @class ParkingMiddleware
 */
export class ParkingMiddleware {
  constructor(private parkingCapacityDao: ParkingCapacityDao, private reservatioDAO: ReservationDAO, private parkingDao: ParkingDao) {}

  /**
   * Verifica la disponibilità di posti per il tipo di veicolo e intervallo richiesto.
   * Se la capacità è esaurita, imposta res.locals.capacityRejected = true.
   * @param req - Richiesta HTTP con parkingId, vehicle, startTime, endTime nel body
   * @param res - Risposta HTTP (usa res.locals per comunicare la capacità)
   * @param next - Funzione per la gestione degli errori o passaggio al middleware successivo
   */
  checkCapacity = async (req: Request, res: Response, next: NextFunction ) => {
    try {
      const { parkingId, vehicle, startTime : startRaw ,endTime : endRaw } = req.body;
      if (!parkingId || !vehicle ) {
        throw ErrorFactory.badRequest();
      }

      const startTime = parseDateString(startRaw as string);
      const endTime = parseDateString(endRaw as string);

      if (!startTime || !endTime) {
          throw ErrorFactory.badRequest();
        }

      // 1) Recupero il record di capacità per quel parcheggio e quel tipo di veicolo
      const capacityRecord = await this.parkingCapacityDao.findByParkingAndType(parkingId, vehicle as Vehicles);
      if (!capacityRecord) {
        throw ErrorFactory.entityNotFound('Parking');
      }
      const totalePosti = capacityRecord.capacity;

      // 2) Conto quante prenotazioni già attive (PENDING o CONFIRMED) si sovrappongono
      //    all'intervallo [startTime, endTime]
      const occupiedSpots = await this.reservatioDAO.countOverlapping(
        parkingId,
        vehicle as Vehicles,
        startTime,
        endTime
      );
      
      if (occupiedSpots >= totalePosti) {
          res.locals.capacityRejected = true;
      }

      // Se arrivo qui, ci sono posti → next()
      next();
    } catch (err) {
      next(err);
    }
  }

  /**
   * Verifica se il parcheggio è chiuso in una delle date richieste.
   * Se trova una data di chiusura nell'intervallo, blocca la prenotazione con errore.
   * @param req - Richiesta HTTP con parkingId, startTime, endTime nel body
   * @param res - Risposta HTTP
   * @param next - Funzione per la gestione degli errori o passaggio al middleware successivo
   */
  checkParkingClosed = async ( req: Request, res: Response, next: NextFunction) => {
    try {
      const { parkingId, startTime: startRaw, endTime: endRaw } = req.body;
      if (!parkingId || !startRaw || !endRaw) {
        throw ErrorFactory.badRequest();
      }

      const startTime = parseDateString(startRaw);
      const endTime = parseDateString(endRaw);
      if (!startTime || !endTime) {
        throw ErrorFactory.badRequest('Formato data non valido. Usa "DD-MM-YYYY" o ISO.');
      } 

      // 1) Recupera il parcheggio
      const parking = await this.parkingDao.findById(parkingId);
      if (!parking) {
        throw ErrorFactory.entityNotFound('Parking');
      }

      // 2) Ottieni l’array di date di chiusura: Date[]
      const closedDates: Date[] = parking.closedData || []; 

      // Funzione che normalizza una Date a mezzanotte (solo giorno-mese-anno)
      const normalizeDate = (d: Date) => {
        const tmp = new Date(d);
        tmp.setHours(0, 0, 0, 0);
        return tmp;
      };

      const startNorm = normalizeDate(startTime);
      const endNorm = normalizeDate(endTime);

      // 3) Verifica se c’è almeno una closedDate compresa fra startNorm e endNorm
      for (const closed of closedDates) {
        const closedNorm = normalizeDate(closed);
        if (
            closedNorm.getTime() >= startNorm.getTime() &&
            closedNorm.getTime() <= endNorm.getTime()
        ) {
            // Il parcheggio è chiuso in quella data
            const dayStr = closedNorm.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            }); 
            // Genero un errore con status 400
            throw ErrorFactory.badRequest(`Il parcheggio è chiuso il giorno ${dayStr}`);
        }
      }

      // Se arrivo qui, non ho trovato giorni di chiusura: ok → next()
      next();
    } catch (err) {
      next(err);
    }
  }
}
