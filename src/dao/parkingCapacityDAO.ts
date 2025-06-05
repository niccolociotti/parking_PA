import { Parking } from "../models/parking";
import { Reservation } from '../models/reservation';
import { ParkingCapacity } from "../models/parkingCapacity";
import { ErrorFactory } from "../factories/errorFactory";
import { Op } from "sequelize";


 interface IDaoParkingCapacityInterface{
  findAll(): Promise<Parking[]>; 
  findById(id: string): Promise<ParkingCapacity | null>; 
  findByParkingAndType(id:string,vehicle: string): Promise<ParkingCapacity | null>;
  //findByVeicleTypeAndDayAndPeriod(id: string, vehicleType: string): Promise<ParkingCapacity | null>;  
}

export class ParkingCapacityDao implements IDaoParkingCapacityInterface {
  async findAll(): Promise<Parking[]> {
    return await Parking.findAll();
  }                                                                                            

  async findById(id: string): Promise<ParkingCapacity | null> {
    return await ParkingCapacity.findByPk(id);
  }

  async findByVeicleTypeAndDayAndPeriod(id: string, vehicleType: string, startTime: Date, endTime: Date): Promise<ParkingCapacity | null> {
    
    const capacity = await ParkingCapacity.findOne({ where: { parkingId: id, vehicle: vehicleType } });
    if (!capacity) {
      throw ErrorFactory.entityNotFound("Parking Capacity");
    } 
    // Trova le prenotazioni attive per il parcheggio e il tipo di veicolo specificato   
    const prenotazioniAttive = await Reservation.count({ where: {parkingId: id , status: 'In attesa di pagamento' ,
        [Op.or]: [
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gt]: startTime }
          }
        ]
      }
    });
  // Calcola la capacità rimanente (virtuale)
  const availableCapacity = Math.max(0, capacity.capacity - prenotazioniAttive);

  // Aggiunge una proprietà virtuale all'oggetto restituito
  capacity.setDataValue('capacity', availableCapacity);

  return capacity;
   
  }

  findByParkingAndType(id:string,vehicle: string): Promise<ParkingCapacity | null>;
  async findByParkingAndType(id:string,vehicle: string): Promise<ParkingCapacity | null> {
      return await ParkingCapacity.findOne({
        where: {
          parkingId: id,
          vehicle: vehicle}})
      }
}

