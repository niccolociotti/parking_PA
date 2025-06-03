import { Fine } from "../models/fine";
import { randomUUID } from "crypto";
import { FineDAO } from "../dao/fineDAO";
import { ReservationDAO } from "../dao/reservationDAO";

export class FineService {

  constructor(private fineDAO: FineDAO, private reservationDAO: ReservationDAO) {}

  async checkAndCreateFine(licensePlate: string, parkingId: string, now: Date = new Date()): Promise<Fine | null> {
    // 1. Trova la reservation più recente per quella targa/parcheggio
    const reservation = await this.reservationDAO.findByPlate(licensePlate);

    const violatedTime = new Date('2025-06-04')

    const fineId = randomUUID();

    // 2. Se NON esiste reservation: crea multa!
    if (!reservation) {
      return await this.fineDAO.create({
        id: fineId,
        licensePlate,
        parkingId,
        violationTime: violatedTime,
        price: 100, 
        reason: "Transito senza prenotazione valida"
      });
    }
    // 3. Se esiste reservation:
    // - Se la reservation è valida ORA (ora è tra start e end), nessuna multa
    if ( 
      reservation.startTime <= violatedTime && 
      reservation.endTime >= violatedTime
    ) 
      return null;
    

    // - Se la reservation è scaduta (endTime < now), crea multa con motivo diverso
    if (reservation.endTime < violatedTime) {
      return await this.fineDAO.create({
        id: fineId,
        licensePlate,
        parkingId,
        violationTime: violatedTime,
        price: 150,
        reason: "Transito con prenotazione scaduta"
      });
    }

    // - Se la reservation non è ancora iniziata
    if (reservation.startTime > violatedTime) {
      return await this.fineDAO.create({
        id: fineId,
        licensePlate,
        parkingId,
        violationTime: violatedTime,
        price: 50,
        reason: "Transito prima dell'inizio della prenotazione"
      });
    }
    return null

  }
}

