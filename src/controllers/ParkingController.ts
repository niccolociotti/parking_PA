import e, { NextFunction, Request, Response } from "express";
import { ParkingService } from "../services/ParkingService";

export class ParkingController {
constructor(private parkingService: ParkingService) {}

 createParking = async (req: Request, res: Response, next: NextFunction) => {
  try {

    /*const { name, address, closedDate } = req.body;
     if (!name || !address || !closedDate) {
      return res.status(400).json({ error: "Name, address, and closedDate are required." });
    }*/

    const Parking = await this.parkingService.create(req.body.name, req.body.address, req.body.closedDate);
    console.log(req.body.name, req.body.address, req.body.closedDate);
    

    res.status(201).json(Parking);
  } catch (error) {
    console.error("Error creating parking:");
  }
next(); 
};
/*
  listParking = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parkings = await this.parkingService.findAll();
      res.json(parkings);
    } catch (error) {
      next(error); // passa l'errore al middleware di errore
    }
  }*/

  listParking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Controller: listParking chiamato");
    const parkings = await this.parkingService.findAll();
    console.log("Controller: Risposta", parkings);
    res.json(parkings);
  } catch (error) {
    console.error("Errore nel listParking:", error);
    next(error);
  }
};


  DeleteParking = async (req: Request, res: Response, next: NextFunction) => {                      
    try {
      //const deleted = await this.parkingService.deleteParking(req.params.id);
      const id = req.body;
        const deleted = await this.parkingService.delete(id);
        res.status(200).json({ message: `Parking with ID ${id} deleted.`});
    } catch (error) {
      next(error); // passa l'errore al middleware di errore
    }
    next();
  }

     getParking = async (req: Request, res: Response, next: NextFunction) => {
       try {
            const id = req.params.id; // Assicurati che l'ID venga passato come parametro nella richiesta
            const parking = await this.parkingService.findById(id);
            if (parking) { 
              res.json(parking);
         } else {
              res.status(404).json({ message: "Parking not found" });
   }
        } catch (error) {
          next(error); // passa l'errore al middleware di errore
          }
     next();
   };

   UpdateParking = async (req: Request, res: Response, next: NextFunction) => {
try {
const { id, name, address, closedDate } = req.body; // Assicurati che questi campi siano presenti nel corpo della richiesta

const updatedParking = await this.parkingService.update(id, name, address, closedDate);
if (updatedParking) {
res.json(updatedParking);
} else {
res.status(404).json({ message: "Parking not found" });
}
} catch (error) {
next(error); // passa l'errore al middleware di errore
}
next();
}

}