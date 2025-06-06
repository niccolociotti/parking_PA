import { Fine } from '../models/fine';
import { FineCreationAttributes } from '../models/fine'; 

/**
 * DAO per la gestione delle multe.
 *
 * Fornisce metodi per creare nuove multe nel database.
 * Utilizzato dal FineService per la persistenza delle multe.
 *
 * @interface FineDAOInterface
 * @class FineDAO
 */
interface FineDAOInterface {
  create(data: Fine): Promise<Fine>;
}

export class FineDAO implements FineDAOInterface {
  /**
   * Crea una nuova multa.
   * @param data - Dati della multa da registrare
   * @returns La multa creata
   */
  async create(data: FineCreationAttributes): Promise<Fine> {
    return await Fine.create(data);
  }
}
