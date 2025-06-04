import { randomUUID } from "crypto";
import { Parking } from "../models/parking";
import { ParkingDao } from "../dao/ParkingDao";
import { InferCreationAttributes } from "sequelize/types/model";
import { ErrorFactory } from "../factories/errorFactory";

export class ParkingService {  
  constructor(private parkingDao: ParkingDao) {}

  async findAll(): Promise<Parking[]> {
    return this.parkingDao.findAll();
  } 

  async create(name: string, address: string, capacity:number, closedData: Date): Promise<Parking> {
  if (!name || !address || !closedData) {
    throw ErrorFactory.entityNotFound("Parking");
  }

  const parkingData= {
    id: randomUUID(),
    name,
    address,
    capacity,
    closedData,
  } 
  return this.parkingDao.create(parkingData);
  }

  async delete(id: string): Promise<number> {
    const deleted= await this.parkingDao.delete(id);
    if (deleted === 0) {
      throw ErrorFactory.entityNotFound('Parking');
    }
    return deleted;
  }

  async findById(id: string): Promise<Parking | null> {
    return this.parkingDao.findById(id);
  }

  async update(id: string, updates: Partial<Parking>): Promise<Parking | null> {
    const parkings = await this.parkingDao.update(id, updates);
    if (!parkings) {
      throw ErrorFactory.entityNotFound('Parking');
    }
    return parkings
  }

}
