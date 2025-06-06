import { Transit } from '../models/transit';
import { TransitCreationAttributes } from '../models/transit';

/**
 * Interfaccia per il DAO dei transiti.
 */
interface TransitDAOInterface {
  createTransit(data: Transit): Promise<Transit>;
}

export class TransitDAO implements TransitDAOInterface {
  /**
   * Crea un nuovo record di transito.
   * @param data - Dati del transito da registrare
   * @returns Il transito creato
   */
  async createTransit(data: TransitCreationAttributes): Promise<Transit> {
    const transit = await Transit.create(data);
    return transit;
  }
}
