import { ParkingCapacity } from '../models/parkingCapacity';

interface ParkingCapacityDAOInterface {
  findByParkingAndType(id:string,vehicle: string): Promise<ParkingCapacity | null>;
}

export class ParkingCapacityDAO implements ParkingCapacityDAOInterface {
   async findByParkingAndType(id:string,vehicle: string): Promise<ParkingCapacity | null> {
    return await ParkingCapacity.findOne({
      where: {
        parkingId: id,
        vehicle: vehicle}})
    }

}
