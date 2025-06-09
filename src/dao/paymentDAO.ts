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
   * Trova un pagamento tramite ID.
   * @param id 
   * @returns 
   */
  async findById(id: string): Promise<Payment | null> {
    return await Payment.findByPk(id);
  }
}
