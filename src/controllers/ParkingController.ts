import { NextFunction, Request, Response } from "express";
import { ParkingService } from "../services/ParkingService";
import { StatusCodes } from "http-status-codes";
import { ErrorFactory } from "../factories/errorFactory";
import { parseDateString } from "../helpers/dateParser";

/**
 * Controller per gestire le operazioni sui parcheggi.
 * 
 * @class ParkingController
 */
export class ParkingController {
constructor(private parkingService: ParkingService) {}
  
  /**
   * Crea un nuovo parcheggio.
   * 
   * @route POST /parking
   * @param req - Request contenente `name`, `address`, `capacity`, `closedData` nel body
   * @param res - Response con oggetto parcheggio creato
   * @param next - Funzione di middleware per gestire errori
   */
 createParking = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { name, address,capacity, closedData } = req.body;
    if (!name || !address || !closedData) {
     throw ErrorFactory.entityNotFound("Parking");;
    }

    const parking = await this.parkingService.create(name, address,capacity,closedData );
    res.status(StatusCodes.CREATED).json(parking);
  } catch (error) {
    next(error);
  } 
}
  /**  Elenco dei parcheggi
   * @route GET /parkings
   * @param req - Request senza parametri
   * @param res - Response con lista dei parcheggi
   * @param next - Funzione di middleware per gestire errori
   */

  listParking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parkings = await this.parkingService.findAll();
      res.status(StatusCodes.OK).json(parkings);
    } catch (error) {
      next(error); 
      }
  }

  /**  Eliminazione di un parcheggio
   * @route DELETE /parking/:id
   * @param req - Request con parametro `id` del parcheggio da eliminare
   * @param res - Response con messaggio di conferma
   * @param next - Funzione di middleware per gestire errori
   */

  DeleteParking = async (req: Request, res: Response, next: NextFunction) => {                      
    const deleted = await this.parkingService.delete(req.params.id);
      
     if (deleted > 0) {
      res.status(StatusCodes.OK).json({ message: `Parking with ID ${req.params.id} deleted.` });
    } else {
      throw ErrorFactory.entityNotFound("Parking");
    }

  }

  /**  Ottenimento di un parcheggio
   * @route GET /parking/:id
   * @param req - Request con parametro `id` del parcheggio da ottenere
   * @param res - Response con oggetto parcheggio
   * @param next - Funzione di middleware per gestire errori
   */
  getParking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parkingid = req.params.id;
      const parking = await this.parkingService.findById(parkingid);
      if (parking) { 
        res.status(StatusCodes.OK).json(parking);
      } else {
        throw ErrorFactory.entityNotFound("Parking");
      }
    } catch (error) {
      next(error);
      }
  }

  /** Aggiornamento di un parcheggio
   * @route POST /parking/update/:id
   * @param req - Request con parametro `id` del parcheggio da aggiornare e body con i dati da aggiornare
   * @param res - Response con oggetto parcheggio aggiornato
   * @param next - Funzione di middleware per gestire errori
   */
  UpdateParking = async (req: Request, res: Response, next: NextFunction) => {

    const status = req.body; 
    const parkingid = req.params.id;
    try {
      const updatedParking = await this.parkingService.update(parkingid, status);
      if (updatedParking) {
        res.status(StatusCodes.OK).json(updatedParking);
      } else {
        throw ErrorFactory.entityNotFound("Parking");
      }
    }catch (error) {
      next(error); 
      }

  }

  /** Ottenimento delle statistiche di un parcheggio
   * @route GET /stats/:parkingId
   * @param req - Request con parametro `parkingId` e query `start` e `end` per il periodo
   * @param res - Response con le statistiche del parcheggio
   * @param next - Funzione di middleware per gestire errori
   */ 
  getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { parkingId } = req.params;
      let { start: startRaw, end: endRaw } = req.query as { start?: string; end?: string };

      let startTime: Date | undefined = undefined;
      let endTime: Date | undefined = undefined;

      if (startRaw) {
        const parsedStart = parseDateString(startRaw);
        if (!parsedStart) {
          throw ErrorFactory.badRequest("Formato data non valido");
        }
        startTime = parsedStart;
      }

      if (endRaw) {
        const parsedEnd = parseDateString(endRaw);
        if (!parsedEnd) {
          throw ErrorFactory.badRequest("Formato data non valido");
        }
        endTime = parsedEnd;
      }

      if (startTime && endTime && startTime.getTime() > endTime.getTime()) {
        throw ErrorFactory.badRequest('“start” non può essere successivo a “end”.');
      }

      const stats = await this.parkingService.getParkingStatistics(
        parkingId,
        startTime,
        endTime
      );

    res.json({ parkingId, stats });

    }catch (error) {
      console.error("Error in getStats:", error);
      next(error);
    }
  } 

}