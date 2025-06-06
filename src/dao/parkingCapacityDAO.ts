import { Parking } from "../models/parking";
import { Reservation } from '../models/reservation';
import { ParkingCapacity } from "../models/parkingCapacity";
import { ErrorFactory } from "../factories/errorFactory";
import { Op } from "sequelize";
import { Vehicles } from "../utils/Vehicles";
import { Status } from "../utils/Status";

/** ParkingCapacityDao per gestire le operazioni sulle capacità dei parcheggi nel database.
 * @class ParkingCapacityDao
 * @implements IDaoParkingCapacityInterface
 * @description Fornisce metodi per trovare capacità dei parcheggi per ID, tipo di veicolo e periodo.
 * */
interface IDaoParkingCapacityInterface{
  findAll(): Promise<Parking[]>; 
  findById(id: string): Promise<ParkingCapacity | null>; 
  findByParkingAndType(id:string,vehicle: string): Promise<ParkingCapacity | null>;
  findByParkingsById(parkingId: string): Promise<ParkingCapacity[] | null>;
}

/** ParkingCapacityDao implementa IDaoParkingCapacityInterface per interagire con il database delle capacità dei parcheggi.
 * @class ParkingCapacityDao
 * @implements IDaoParkingCapacityInterface
 * @description Fornisce metodi per trovare capacità dei parcheggi per ID, tipo di veicolo e periodo.
 * @param IDaoParkingCapacityInterface - Interfaccia per le operazioni sulle capacità dei parcheggi
 * */
export class ParkingCapacityDao implements IDaoParkingCapacityInterface {

  /** Trova tutti i parcheggi nel database.
   * @return Promise<Parking[]> - Lista di parcheggi
   * */
  async findAll(): Promise<Parking[]> {
    return await Parking.findAll();
  }                                                                                        

  /** Trova una capacità di parcheggio per ID e tipo di veicolo.
   * @param id - ID del parcheggio
   * @param vehicle - Tipo di veicolo
   * @return Promise<ParkingCapacity | null> - La capacità trovata o null se non esiste
   * */
  async findById(id: string): Promise<ParkingCapacity | null> {
    return await ParkingCapacity.findByPk(id);
  }

  /** Trova una capacità di parcheggio per ID e tipo di veicolo.
   * @param id - ID del parcheggio
   * @param vehicle - Tipo di veicolo
   * @return Promise<ParkingCapacity | null> - La capacità trovata o null se non esiste
   * */
  async findByVeicleTypeAndDayAndPeriod(id: string, vehicle: string, startTime: Date, endTime: Date): Promise<ParkingCapacity | null> {
    const capacity = await ParkingCapacity.findOne({ where: { parkingId: id, vehicle: vehicle } });
    if (!capacity) {
      throw ErrorFactory.entityNotFound("Parking Capacity");
    } 
  
    const prenotazioniAttive = await Reservation.count({ where: {parkingId: id , status: [Status.CONFIRMED, Status.PENDING],
        [Op.or]: [
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gt]: startTime }
          }
        ]
      }});
    const availableCapacity = Math.max(0, capacity.capacity - prenotazioniAttive);
    capacity.setDataValue('capacity', availableCapacity);
    return capacity;
  }

  /** Trova una capacità di parcheggio per ID e tipo di veicolo.
   * @param parkingId - ID del parcheggio
   * @param vehicle - Tipo di veicolo
   * @return Promise<ParkingCapacity | null> - La capacità trovata o null se non esiste
   * */
  async findByParkingAndType(parkingId:string,vehicle: Vehicles): Promise<ParkingCapacity | null> {
    const  parking = await  ParkingCapacity.findOne({
      where: {
        parkingId: parkingId,
        vehicle: vehicle as Vehicles}})
    return parking;
  }

  /** Trova tutte le capacità di parcheggio per ID del parcheggio.
   * @param parkingId - ID del parcheggio
   * @return Promise<ParkingCapacity[] | null> - Lista di capacità trovate o null se non esistono
   * */
  async findByParkingsById(parkingId: string): Promise<ParkingCapacity[] | null> {
    return await ParkingCapacity.findAll({
      where: {
        parkingId: parkingId
      }
    });
  }
}

