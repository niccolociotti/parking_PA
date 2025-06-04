import { IDAOBaseInterface } from "./BaseDAO";
import { Parking } from "../models/parking";
import { InferCreationAttributes } from "sequelize/types/model";

export interface IDaoParkingInterface<T = Parking, CreateData = Partial<Parking>>{
  findAll(): Promise<T[]>; 
  delete(id: string): Promise<void>; 
  findById(id: string): Promise<T | null>; 
  update(id: string, data: Partial<T>): Promise<T>; 
  create(data: CreateData): Promise<T>; 
}


export class ParkingDao implements IDaoParkingInterface<Parking, Partial<Parking>> {
  async findAll(): Promise<Parking[]> {
    console.log("DAO: Cerco tutti i parcheggi...");
    const result = await Parking.findAll();
    console.log("DAO: Trovati", result.length, "parcheggi");
    return await Parking.findAll();
  }


  async create(data: Omit<InferCreationAttributes<Parking>, never>): Promise<Parking> {
    return await Parking.create(data);
  }
  /*async create(data: Partial<Parking>): Promise<Parking> {
    return await Parking.create(data);
  }*/

async delete(id: string): Promise<void> {
 await Parking.destroy({ where: { id } });
}                                                                                                   

async findById(id: string): Promise<Parking | null> {
  return await Parking.findByPk(id);
                                                                                                    
}
async update(id: string, data: Partial<Parking>): Promise<Parking> {
  const [_, [updatedParking]] = await Parking.update(data, {
    where: { id },
    returning: true,
  });

  if (!updatedParking) {
    throw new Error(`Parking with id ${id} not found or not updated`);
  }

  return updatedParking;
}


}