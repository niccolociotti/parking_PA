import { NextFunction, Request, Response } from "express";
import { FineService } from "../services/fineService";
import { StatusCodes } from "http-status-codes";

export class FineController {   
    constructor(private fineService: FineService) {}
    createFine = async (req: Request, res: Response, next: NextFunction) => {
    
    const { licensePlate, parkingId } = req.body;
    console.log("Richiesta di creazione multa:", parkingId);

    try {
      
      const fine = await this.fineService.checkAndCreateFine(licensePlate, parkingId);
      if (!fine) {
        // Accesso regolare
        res.status(StatusCodes.OK).json( "Accesso consentito.");
      }
      res.status(StatusCodes.CREATED).json({
        message: "Multa creata con successo.",
        fine: fine,
      });
    } catch (error) {
        next(error);
      
    }
};
}