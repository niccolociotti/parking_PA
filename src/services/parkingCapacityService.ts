import { Parking } from "../models/parking";
import { ParkingCapacityDao } from "../dao/parkingCapacityDAO";
import { ParkingCapacity } from "../models/parkingCapacity";
import { Vehicles } from "../utils/Vehicles";

export class ParkingCapacityService {  
  constructor(private parkingCapacityDao: ParkingCapacityDao) {}

  async findAll(): Promise<Parking[]> {
    return this.parkingCapacityDao.findAll();
  }

  async findById(id: string): Promise<ParkingCapacity | null> {
    const parkingCapacity= this.parkingCapacityDao.findById(id);
    if (!parkingCapacity) {
      throw new Error(`Parking capacity with id ${id} not found`);
    }
    return parkingCapacity;
  }

  async findByVehicleType(id: string, vehicle: Vehicles): Promise<ParkingCapacity | null> {
    const parkingCapacity= this.parkingCapacityDao.findByParkingAndType(id, vehicle);
    if (!parkingCapacity) {
      throw new Error(`Parking capacity for vehicle type ${vehicle} in parking ${id} not found`);
    }
    return parkingCapacity;
  }

async findByVehicleTypeAndDayAndPeriod(id: string, vehicle: string, startTime:Date, endTime:Date): Promise<ParkingCapacity | null> {
const parkingCapacity = this.parkingCapacityDao.findByVeicleTypeAndDayAndPeriod(id, vehicle,startTime, endTime);
if (!parkingCapacity) {
throw new Error(`Parking capacity for vehicle type ${vehicle} in parking ${id} not found in this ${startTime} with period ${endTime}`);
}
return parkingCapacity;
}

}
