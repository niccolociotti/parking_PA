import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorFactory } from "../factories/errorFactory";
import { ParkingCapacityService } from "../services/parkingCapacityService";
import { parseDateString } from "../helpers/dateParser";

/**
 * Controller per gestire le operazioni sulle capacità dei parcheggi.
 * @class ParkingCapacityController
 * @description Fornisce metodi per ottenere la capacità di un parcheggio in base all'ID, al tipo di veicolo e al periodo.
 * @param parkingCapacityService - Istanza di ParkingCapacityService per interagire con il database delle capacità dei parcheggi
 */
export class ParkingCapacityController {
  constructor(private parkingCapacityService: ParkingCapacityService) {}
  
    /** Ottiene la capacità di un parcheggio per ID,tipo di veicolo la data e il periodo. 
     * @param req - Request con parametri `id`, `vehicle`, `data` e `period`
     * @param res - Response con oggetto capacità del parcheggio
     * @param next - Funzione di middleware per gestire errori
     * */
    getParkingCapacityByIdAndVehicleAndDayAndPeriod = async (req: Request, res: Response, next: NextFunction) => {
     try {
       const parkingId = req.params.id;
       const vehicle = req.params.vehicle;
       const period = parseFloat(req.params.period as string);

        if (!parkingId || !vehicle || isNaN(period)) {
          throw ErrorFactory.customMessage("Parametri non corretti", StatusCodes.BAD_REQUEST);
        }
        const parsedStartTime = parseDateString(req.params.data);
        if (!parsedStartTime) {
          throw ErrorFactory.customMessage("Data non valida", StatusCodes.BAD_REQUEST);
        }
       
       const endTime = new Date(parsedStartTime.getTime() + period * 60 * 60 * 1000);

       const parkingCapacity = await this.parkingCapacityService.findByVehicleTypeAndDayAndPeriod(parkingId, vehicle, parsedStartTime, endTime);
       if (parkingCapacity) {
         res.status(StatusCodes.OK).json({Disponibilità : parkingCapacity.capacity});
        } else {
          throw ErrorFactory.entityNotFound("Parking");
          }  
        } catch (error) {
          next(error);
      }
    }
}