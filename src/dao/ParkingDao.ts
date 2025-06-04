import { Parking, ParkingCreationAttributes } from "../models/parking";


 interface IDaoParkingInterface{
  create(data: Parking): Promise<Parking>; 
  findAll(): Promise<Parking[]>; 
  delete(id: string): Promise<number>; 
  findById(id: string): Promise<Parking | null>; 
  update(id: string, updates:Partial<Parking>): Promise<Parking | null>;
  
}


export class ParkingDao implements IDaoParkingInterface {
  async findAll(): Promise<Parking[]> {
    return await Parking.findAll();
  }

  async create(parking: ParkingCreationAttributes): Promise<Parking> {
    return await Parking.create(parking);
  }

  async delete(id: string): Promise<number> {
    return await Parking.destroy({ where: { id } });
  }                                                                                                   

async findById(id: string): Promise<Parking | null> {
  return await Parking.findByPk(id);
                                                                                                    
}
async update(id: string, updates: Partial<Parking>): Promise<Parking | null> {
  const parking = await Parking.findByPk(id);
  if (parking === null) {    
    throw new Error(`Parking with id ${id} not found`);
  }

  return await parking.update(updates);
}
}