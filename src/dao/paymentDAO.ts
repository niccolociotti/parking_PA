import { Payment } from '../models/payment';
import { PaymentCreationAttributes } from '../models/payment'; 

/**
 * DAO per la gestione dei pagamenti.
 * Fornisce metodi per creare e recuperare pagamenti.
 * Utilizzato dal PaymentService per la persistenza e la ricerca dei pagamenti.
 * @interface PaymentDAOInterface
 */
interface PaymentDAOInterface {
  create(data: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByReservationId(reservationId: string): Promise<Payment | null>
  delete(id: string): Promise<number>;
}

/**
 * Implementazione del DAO per la gestione dei pagamenti.
 * @class PaymentDAO
 */
export class PaymentDAO implements PaymentDAOInterface {
  
 /**
  * Crea un nuovo pagamento.
  * @param data - Dati del pagamento da creare
  * @returns Il pagamento creato
  */
  async create(data: PaymentCreationAttributes): Promise<Payment> {
    return await Payment.create(data);
  }

  /**
   * Trova un pagamento tramite ID
   * @param id 
   * @returns Il pagamento trovato o null se non esiste
   */
  async findById(id: string): Promise<Payment | null> {
    return await Payment.findByPk(id);
  }

   /**
   * Trova un pagamento tramite ID
   * @param id - ID della prenotazione
   * @returns Il pagamento trovato o null se non esiste
   */
  async findByReservationId(reservationId: string): Promise<Payment | null> {
    return await Payment.findOne({ where: { reservationId } });
  }

  /**
   * Elimina un pagamento tramite ID.
   * @param id - ID del pagamento da eliminare
   * @returns Numero di righe eliminate o null se non trovato
   */
  async delete(id: string): Promise<number> {
     return await Payment.destroy({ where: { id } });
  }
}
