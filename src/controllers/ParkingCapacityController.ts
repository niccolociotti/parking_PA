import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ErrorFactory } from "../factories/errorFactory";
import { ParkingCapacityService } from "../services/parkingCapacityService";

export class ParkingCapacityController {
constructor(private parkingCapacityService: ParkingCapacityService) {}

   getParkingCapacityByIdAndVehicle = async (req: Request, res: Response, next: NextFunction) => {
     try {
       const parkingId = req.params.id;
       const vehicleType = req.params.vehicleType;
     //  const day = new Date(req.params.day);
     //  const time = req.params.time;

       const parkingCapacity = await this.parkingCapacityService.findByVehicleType(parkingId, vehicleType);
       if (parkingCapacity) {
         res.status(StatusCodes.OK).json(parkingCapacity);
       } else {
         throw ErrorFactory.entityNotFound("Parking Capacity");
       }
     } catch (error) {
       next(error);
     }
   }

   getParkingCapacityByIdAndVehicleAndDayAndPeriod = async (req: Request, res: Response, next: NextFunction) => {
     try {
       const parkingId = req.params.id;
       const vehicleType = req.params.vehicleType;
       const startTime = new Date(req.params.data);
       const period = parseFloat(req.params.period as string);

      // // Calcolo l'orario di fine basato sulla durata in ore
       const endTime = new Date(startTime.getTime() + period * 60 * 60 * 1000);

       //res.status(StatusCodes.OK).json({ startTime, endTime });

       const parkingCapacity = await this.parkingCapacityService.findByVehicleTypeAndDayAndPeriod(parkingId, vehicleType, startTime, endTime);
       if (parkingCapacity) {
         res.status(StatusCodes.OK).json(parkingCapacity);
       } else {
         throw ErrorFactory.entityNotFound("Parking Capacity");
       }
     } catch (error) {
       next(error);
     }
   }


}