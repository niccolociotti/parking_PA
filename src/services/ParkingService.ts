import { randomUUID } from "crypto";
import { Parking } from "../models/parking";
import { ParkingDao } from "../dao/ParkingDao";
import { InferCreationAttributes } from "sequelize/types/model";

export class ParkingService {  
  constructor(private parkingDao: ParkingDao) {}

  async findAll(): Promise<Parking[]> {
    return this.parkingDao.findAll();
  } 

  async create(name: string, address: string, closedDate: Date): Promise<Parking> {
  if (!name || !address || !closedDate) {
    throw new Error("Invalid parking data");
  }

  return await this.parkingDao.create({
    id: randomUUID(),
    name,
    address,
    closedDate,
  } as InferCreationAttributes<Parking>);
}


  async delete(id: string): Promise<void> {
    await this.parkingDao.delete(id);
  }

  async findById(id: string): Promise<Parking | null> {
    return this.parkingDao.findById(id);
  }

  async update(id: string, name: string, address: string, closedDate: Date): Promise<Parking | null> {
    const parking = await this.parkingDao.findById(id);
    if (!parking) {
      return null; 
    }
    parking.name = name;
    parking.address = address;
    parking.closedDate = closedDate;
    return this.parkingDao.update(id,parking);

}
}
