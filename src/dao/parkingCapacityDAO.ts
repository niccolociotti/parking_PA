import { Parking } from "../models/parking";
import { Reservation } from '../models/reservation';
import { ParkingCapacity } from "../models/parkingCapacity";
import { ErrorFactory } from "../factories/errorFactory";
import { Op } from "sequelize";
import { Vehicles } from "../utils/Vehicles";
import { Status } from "../utils/Status";


 interface IDaoParkingCapacityInterface{
  findAll(): Promise<Parking[]>; 
  findById(id: string): Promise<ParkingCapacity | null>; 
  findByParkingAndType(id:string,vehicle: string): Promise<ParkingCapacity | null>;
  findByParkingsById(parkingId: string): Promise<ParkingCapacity[] | null>;
  //findByVeicleTypeAndDayAndPeriod(id: string, vehicleType: string): Promise<ParkingCapacity | null>;  
}

export class ParkingCapacityDao implements IDaoParkingCapacityInterface {
  async findAll(): Promise<Parking[]> {
    return await Parking.findAll();
  }                                                                                            

  async findById(id: string): Promise<ParkingCapacity | null> {
    return await ParkingCapacity.findByPk(id);
  }

  async findByVeicleTypeAndDayAndPeriod(id: string, vehicle: string, startTime: Date, endTime: Date): Promise<ParkingCapacity | null> {
    
    const capacity = await ParkingCapacity.findOne({ where: { parkingId: id, vehicle: vehicle } });
    if (!capacity) {
      throw ErrorFactory.entityNotFound("Parking Capacity");
    } 
    // Trova le prenotazioni attive per il parcheggio e il tipo di veicolo specificato   
    const prenotazioniAttive = await Reservation.count({ where: {parkingId: id , status: [Status.CONFIRMED, Status.PENDING],
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

  async findByParkingAndType(parkingId:string,vehicle: Vehicles): Promise<ParkingCapacity | null> {
      const  parking = await  ParkingCapacity.findOne({
        where: {
          parkingId: parkingId,
          vehicle: vehicle as Vehicles}})
      return parking;
      }

  async findByParkingsById(parkingId: string): Promise<ParkingCapacity[] | null> {
    return await ParkingCapacity.findAll({
      where: {
        parkingId: parkingId
      }
    });
  }
}

