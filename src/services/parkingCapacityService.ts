import { Parking } from "../models/parking";
import { ParkingCapacityDao } from "../dao/parkingCapacityDAO";
import { ParkingCapacity } from "../models/parkingCapacity";

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

  async findByVehicleType(id: string, vehicleType: string): Promise<ParkingCapacity | null> {
    const parkingCapacity= this.parkingCapacityDao.findByVeicleType(id, vehicleType);
    if (!parkingCapacity) {
      throw new Error(`Parking capacity for vehicle type ${vehicleType} in parking ${id} not found`);
    }
    return parkingCapacity;
  }

async findByVehicleTypeAndDayAndPeriod(id: string, vehicleType: string, startTime:Date, period: number): Promise<ParkingCapacity | null> {
const parkingCapacity = this.parkingCapacityDao.findByVeicleTypeAndDayAndPeriod(id, vehicleType,startTime, period);
if (!parkingCapacity) {
throw new Error(`Parking capacity for vehicle type ${vehicleType} in parking ${id} not found in this ${startTime} with period ${period}`);
}
return parkingCapacity;
}

}
