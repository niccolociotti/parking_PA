import { NextFunction, Request, Response } from "express";
import { TransitService } from "../services/transitService";
import { StatusCodes } from "http-status-codes";
import { Fine } from "../models/fine";
import { ErrorFactory } from "../factories/errorFactory";
import { TransitType } from "../models/transit";
import { Transit } from "../models/transit";
import { ParkingService } from "../services/ParkingService";

/**
 * Classe che fornisce un endpoint per registrare un transito (ingresso/uscita) di un veicolo in un parcheggio.
 * Se il transito non è valido, viene generata automaticamente una multa tramite il TransitService.
 * Usato nella rotta POST /transit/:type.
 *
 * @class FineTransitController
 */
export class FineTransitController {   
    constructor(private transitService: TransitService, private parkingService : ParkingService) {}
    
    /**
     * Registra un transito o genera una multa se il transito non è valido.
     * Prende il tipo di transito dai parametri e i dati dal body.
     * Se il transito è valido, restituisce il record di transito; altrimenti restituisce la multa generata.
     * @param req - Richiesta HTTP con type nei parametri e licensePlate, parkingId nel body
     * @param res - Risposta HTTP con il transito o la multa creata
     * @param next - Funzione per la gestione degli errori
     * @returns Restituisce una risposta HTTP con il transito o la multa
     */
    createFineOrTransit = async (req: Request, res: Response, next: NextFunction) => {
      const type = req.params.type;
      const { licensePlate, parkingId } = req.body;
      try {
        if (!licensePlate || !parkingId) {
          throw ErrorFactory.badRequest("License plate and parking ID are required.");
        }
        const parking = await this.parkingService.findById(parkingId);
        if (!parking) {
          throw ErrorFactory.entityNotFound("Parking");
        }
        const fineOrTransit = await this.transitService.creaTransitoFine(licensePlate, parkingId, type as TransitType);
        if (!fineOrTransit) {
          throw ErrorFactory.badRequest();
        }
        if (fineOrTransit instanceof Fine) {
          res.status(StatusCodes.CREATED).json({ message: "Multa", fineOrTransit });
        } else if (fineOrTransit instanceof Transit) {
          res.status(StatusCodes.CREATED).json({ message: "Transito in " + req.params.type, fineOrTransit });
        }
      } catch (error) {
        next(error);
      }
    };
}