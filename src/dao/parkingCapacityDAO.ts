import { Parking } from "../models/parking";
import { Reservation } from '../models/reservation';
import { ParkingCapacity } from "../models/parkingCapacity";
import { ErrorFactory } from "../factories/errorFactory";
import { Op } from "sequelize";


 interface IDaoParkingCapacityInterface{
  findAll(): Promise<Parking[]>; 
  findById(id: string): Promise<ParkingCapacity | null>; 
  //findByVeicleType(id: string,vehicleType: string, startTime:Date, period: number): Promise<ParkingCapacity | null>;
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

  /*async findByVeicleType(id: string,vehicle: string): Promise<ParkingCapacity | null> {
    return await ParkingCapacity.findOne({ where: { parkingId: id, vehicle: vehicle } });
  }*/

  /*async findByVeicleTypeAndDayAndPeriod(id: string, vehicleType: string, startTime: Date, durationHours: number): Promise<ParkingCapacity | null> {
    const capacity = await ParkingCapacity.findOne({ where: { parkingId: id, vehicle }});
    if (!capacity) {
      throw ErrorFactory.entityNotFound("Parking Capacity");
    }
    // Calcolo l'orario di fine basato sulla durata in ore 
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);    
    const prenotazioniAttive = await Reservation.count({ where: {parkingId: id , status: 'In attesa di pagamento' ,
        [Op.or]: [
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gt]: startTime }
          }
        ]
      }
    });
      const disponibili = Math.max(0, capacity.capacity - prenotazioniAttive);
    return {
      vehicle,
      capacity: capacity.capacity,
      price: capacity.price
    };
   
  }*/

  findByParkingAndType(id:string,vehicle: string): Promise<ParkingCapacity | null>;
  async findByParkingAndType(id:string,vehicle: string): Promise<ParkingCapacity | null> {
      return await ParkingCapacity.findOne({
        where: {
          parkingId: id,
          vehicle: vehicle}})
      }
}

