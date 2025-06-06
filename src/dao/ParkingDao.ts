import { Parking, ParkingCreationAttributes } from "../models/parking";

/** ParkingDao per gestire le operazioni sui parcheggi nel database.
* @class ParkingDao
* @implements IDaoParkingInterface
* @description Fornisce metodi per creare, trovare, aggiornare ed eliminare parcheggi.
* */
interface IDaoParkingInterface{
  create(data: Parking): Promise<Parking>; 
  findAll(): Promise<Parking[]>; 
  delete(id: string): Promise<number>; 
  findById(id: string): Promise<Parking | null>; 
  update(id: string, updates:Partial<Parking>): Promise<Parking | null>; 
}

/** ParkingDao implementa IDaoParkingInterface per interagire con il database dei parcheggi.
 * @class ParkingDao
 * @implements IDaoParkingInterface
 * @description Fornisce metodi per creare, trovare, aggiornare ed eliminare parcheggi.
 * @param IDaoParkingInterface - Interfaccia per le operazioni sui parcheggi
 * */
export class ParkingDao implements IDaoParkingInterface {
  async findAll(): Promise<Parking[]> {
    return await Parking.findAll();
  }

  /** Crea un nuovo parcheggio nel database.  
   * @param parking - Oggetto contenente i dati del parcheggio da creare
   * @return Promise<Parking> - Il parcheggio creato
   * */
  async create(parking: ParkingCreationAttributes): Promise<Parking> {
    return await Parking.create(parking);
  }

  /** Elimina un parcheggio dal database per ID.
   * @param id - ID del parcheggio da eliminare
   * @return Promise<number> - Numero di parcheggi eliminati (0 o 1)
   * */ 
  async delete(id: string): Promise<number> {
    return await Parking.destroy({ where: { id } });
  }                                                                                                   

  /** Trova un parcheggio per ID.
   * @param id - ID del parcheggio da trovare
   * @return Promise<Parking | null> - Il parcheggio trovato o null se non esiste
   * */
  async findById(id: string): Promise<Parking | null> {
    return await Parking.findByPk(id);                                                                                                   
  }

  /** Aggiorna un parcheggio per ID.
   * @param id - ID del parcheggio da aggiornare
   * @param updates - Oggetto con i campi da aggiornare
   * @return Promise<Parking | null> - Il parcheggio aggiornato o null se non esiste
   * */
  async update(id: string, updates: Partial<Parking>): Promise<Parking | null> {
    const parking = await Parking.findByPk(id);
    if (parking === null) {    
      throw new Error(`Parking with id ${id} not found`);
      }
    return await parking.update(updates);
  }
}