import e, { NextFunction, Request, Response } from "express";
import { ParkingService } from "../services/ParkingService";
import { StatusCodes } from "http-status-codes";
import { ErrorFactory } from "../factories/errorFactory";
import { parseDateString } from "../helpers/dateParser";

export class ParkingController {
constructor(private parkingService: ParkingService) {}

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
};

  listParking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parkings = await this.parkingService.findAll();
      res.status(StatusCodes.OK).json(parkings);
    } catch (error) {
      next(error); 
    }
  }


  DeleteParking = async (req: Request, res: Response, next: NextFunction) => {                      
      const deleted = await this.parkingService.delete(req.params.id);
      
      if (deleted > 0) {
          res.status(StatusCodes.OK).json({ message: `Parking with ID ${req.params.id} deleted.` });
    } else {
      throw ErrorFactory.entityNotFound("Parking");
    }

  }


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

  UpdateParking = async (req: Request, res: Response, next: NextFunction) => {

  const status = req.body; 
  const parkingid = req.params.id;
  try {
    const updatedParking = await this.parkingService.update(parkingid, status);
    if (updatedParking) {
      res.status(StatusCodes.OK).json(updatedParking);
      }  else {
    throw ErrorFactory.entityNotFound("Parking");
        }
    }catch (error) {
      next(error); 
      }

  }

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