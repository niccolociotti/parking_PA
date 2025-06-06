import { Parking } from "../models/parking";
import { ParkingCapacityDao } from "../dao/parkingCapacityDAO";
import { ParkingCapacity } from "../models/parkingCapacity";
import { Vehicles } from "../utils/Vehicles";

/** ParkingCapacityService gestisce le operazioni sulle capacità dei parcheggi.
 * @class ParkingCapacityService
 * @description Fornisce metodi per trovare capacità dei parcheggi per ID, tipo di veicolo e periodo.
 * @param parkingCapacityDao - Istanza di ParkingCapacityDao per interagire con il database delle capacità dei parcheggi
 * */
export class ParkingCapacityService {  
  constructor(private parkingCapacityDao: ParkingCapacityDao) {}

  /**
   * Trova tutti i parcheggi
   * @returns Lista di parcheggi
   */
  async findAll(): Promise<Parking[]> {
    return this.parkingCapacityDao.findAll();
  }

  /**
   * Trova una capacità di parcheggio per ID
   * @param id - ID della capacità di parcheggio da trovare
   * @returns La capacità di parcheggio trovata o null se non esiste
   */
  async findById(id: string): Promise<ParkingCapacity | null> {
    const parkingCapacity= this.parkingCapacityDao.findById(id);
    if (!parkingCapacity) {
      throw new Error(`Parking capacity with id ${id} not found`);
      }
    return parkingCapacity;
  }

  /**
   * Trova una capacità di parcheggio per ID e tipo di veicolo
   * @param id - ID del parcheggio
   * @param vehicle - Tipo di veicolo
   * @returns La capacità di parcheggio trovata o null se non esiste
   */
  async findByVehicleType(id: string, vehicle: Vehicles): Promise<ParkingCapacity | null> {
    const parkingCapacity= this.parkingCapacityDao.findByParkingAndType(id, vehicle);
    if (!parkingCapacity) {
      throw new Error(`Parking capacity for vehicle type ${vehicle} in parking ${id} not found`);
    }
    return parkingCapacity;
  }

  /**
   * Trova una capacità di parcheggio per ID, tipo di veicolo e periodo
   * @param id - ID del parcheggio
   * @param vehicle - Tipo di veicolo
   * @param startTime - Ora di inizio del periodo
   * @param endTime - Ora di fine del periodo
   * @returns La capacità di parcheggio trovata o null se non esiste
   */
  async findByVehicleTypeAndDayAndPeriod(id: string, vehicle: string, startTime:Date, endTime:Date): Promise<ParkingCapacity | null> {
    const parkingCapacity = this.parkingCapacityDao.findByVeicleTypeAndDayAndPeriod(id, vehicle,startTime, endTime);
    if (!parkingCapacity) {
      throw new Error(`Parking capacity for vehicle type ${vehicle} in parking ${id} not found in this ${startTime} with period ${endTime}`);
      }
    return parkingCapacity;
  }

}
