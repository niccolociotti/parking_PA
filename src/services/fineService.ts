import { Fine } from "../models/fine";
import { randomUUID } from "crypto";
import { FineDAO } from "../dao/fineDAO";

/**
 * Classe che fornisce metodi per creare una multa in base alla targa, parcheggio.
 * Il prezzo viene determinato automaticamente in base al motivo della multa.
 * Utilizzato dal TransitService per generare multe automatiche in caso di transito non valido.
 *
 * @class FineService
 */
export class FineService {

  constructor(private fineDAO: FineDAO) {}

  /**
   * Crea una nuova multa.
   * Il prezzo viene impostato in base al motivo.
   * @param licensePlate - Targa del veicolo
   * @param parkingId - ID del parcheggio
   * @param reason - Motivo della multa
   * @returns La multa creata o null
   */
  async createFine(licensePlate: string, parkingId: string ,reason: string): Promise<Fine | null> {

    let price = 0;
    const fineId = randomUUID();

    if(reason === "Transito senza prenotazione valida"){
      price = 50;
    } else if(reason === "Transito fuori orario prenotazione") {
      price = 30;
    }
    
    return await this.fineDAO.create({
        id: fineId,
        licensePlate,
        parkingId,
        price, 
        reason
      });
  }
}

