import { Reservation } from '../models/reservation';
import { ReservationCreationAttributes } from '../models/reservation'; 
import { Op,fn,col,where as seqWhere } from 'sequelize';
import { Vehicles } from '../utils/Vehicles';
import { Status } from '../utils/Status';

/**
 * DAO per la gestione delle prenotazioni.
 *
 * Fornisce metodi per creare, aggiornare, eliminare e recuperare prenotazioni dal database.
 * Utilizzato dal ReservationService e da altri service per la persistenza e la ricerca delle prenotazioni.
 * @interface ReservationDAOInterface
 */
interface ReservationDAOInterface {
    create(data: Reservation): Promise<Reservation>;
    update(id: string, updates:Partial<Reservation>): Promise<Reservation | null>;
    findAllByUser(userId:string): Promise<Reservation[]>;
    findById(id: string): Promise<Reservation | null>;
    delete(id: string): Promise<number>;
    findAll(): Promise<Reservation[]>;
    report(userId: string,parkingId?: string, startTime?: Date, endTime?: Date): Promise<Reservation[]>;
    findActiveReservation(licensePlate: string, time:Date, parkingId:string): Promise<Reservation | null> ;
}

/**
 * Implementazione del DAO per la gestione delle prenotazioni.
 * @class ReservationDAO
 */
export class ReservationDAO implements ReservationDAOInterface {
    /**
     * Crea una nuova prenotazione.
     * @param reservation - Dati della prenotazione
     * @returns La prenotazione creata
     */
    async create(reservation: ReservationCreationAttributes): Promise<Reservation> {
        return await Reservation.create(reservation);
    }

    /**
     * Aggiorna una prenotazione tramite ID.
     * @param id - ID della prenotazione
     * @param updates - Campi da aggiornare
     * @returns La prenotazione aggiornata o null se non trovata
     */
    async update(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
        const reservation = await Reservation.findByPk(id);
        if (reservation === null ) {
            throw new Error(`Reservation with id ${id} not found`);
        }
        return await reservation.update(updates);
    }

    /**
     * Trova tutte le prenotazioni di un utente.
     * @param userId - ID dell'utente
     * @returns Array di prenotazioni dell'utente
     */
    async findAllByUser(userId:string): Promise<Reservation[]> {
        return await Reservation.findAll({where: { userId }});
    }

    /**
     * Trova una prenotazione tramite ID.
     * @param id - ID della prenotazione
     * @returns La prenotazione trovata o null se non esiste
     */
    async findById(id: string): Promise<Reservation | null> {
        return await Reservation.findByPk(id);
    }

    /**
     * Elimina una prenotazione tramite ID.
     * @param id - ID della prenotazione
     * @returns Numero di prenotazioni eliminate (0 o 1)
     */
    async delete(id: string): Promise<number> {
       return await Reservation.destroy({ where: { id } });
    }

    /**
     * Elimina una prenotazione solo se confermata.
     * @param id - ID della prenotazione
     * @returns Numero di prenotazioni eliminate (0 o 1)
     */
    async deleteByIdStatus(id: string): Promise<number> {
        const deletedCount = await Reservation.destroy({
            where: {
                id,
                status: Status.CONFIRMED
            }
        });
        return deletedCount;
    }

    /**
     * Restituisce tutte le prenotazioni.
     * @returns Array di tutte le prenotazioni
     */
    async findAll(): Promise<Reservation[]> {
        return await Reservation.findAll();
    }

    /**
     * Trova una prenotazione tramite targa.
     * @param licensePlate - Targa del veicolo
     * @returns La prenotazione trovata o null se non esiste
     */
    async findByPlate(licensePlate: string): Promise<Reservation | null> {
        return await Reservation.findOne({ where: { licensePlate } });
    }

    /**
     * Conta le prenotazioni sovrapposte per parcheggio e veicolo.
     * @param parkingId - ID del parcheggio
     * @param vehicle - Tipo di veicolo
     * @param startTime - Data/ora di inizio
     * @param endTime - Data/ora di fine
     * @returns Numero di prenotazioni sovrapposte
     */
    async countOverlapping(
    parkingId: string,
    vehicle: Vehicles,
    startTime: Date,
    endTime: Date
  ): Promise<number> {
    return await Reservation.count({
      where: {
        parkingId,
        vehicle,
        status: { [Op.in]: [Status.PENDING, Status.CONFIRMED] },
        // condizione di “overlap”:
        // NON (prenotazione endTime < nostro startTime
        //    OR prenotazione startTime > nostro endTime)
        [Op.not]: [
          { endTime: { [Op.lt]: startTime } },
          { startTime: { [Op.gt]: endTime } },
        ],
      },
    });
  }

  /**
   * Trova prenotazioni per targhe e periodo.
   * @param plates - Array di targhe
   * @param startTime - Data di inizio periodo
   * @param endTime - Data di fine periodo
   * @param parkingIds - (Opzionale) Array di ID parcheggi
   * @returns Array di prenotazioni trovate
   */
  async findByPlatesAndPeriod( plates: string[], startTime: Date, endTime: Date, parkingIds?: string[]): Promise<Reservation[]> {

    const whereClause: any = {
    licensePlate: { [Op.in]: plates },
    status:       { [Op.in]: [Status.PENDING, Status.CONFIRMED] },
    // Confrontiamo solo la parte “data” di startTime e endTime, 
    // escludendo l’orario:
    [Op.and]: [
      // DATE("startTime") >= 'YYYY-MM-DD'
      seqWhere(fn("DATE", col("startTime")), { [Op.gte]: startTime }),
      // DATE("endTime")   <= 'YYYY-MM-DD'
      seqWhere(fn("DATE", col("endTime")),   { [Op.lte]: endTime   }),
    ],
  };

  if (parkingIds && parkingIds.length > 0) {
    whereClause.parkingId = { [Op.in]: parkingIds };
  }

  return await Reservation.findAll({
    where: whereClause,
    order: [["startTime", "ASC"]],
  });
  }

  /**
   * Trova prenotazioni di un parcheggio in un periodo.
   * @param parkingId - ID del parcheggio
   * @param startTimeMin - (Opzionale) Data di inizio periodo
   * @param endTimeMax - (Opzionale) Data di fine periodo
   * @returns Array di prenotazioni trovate
   */
  async findAllByParkingAndPeriod(parkingId: string, startTimeMin?: Date, endTimeMax?: Date): Promise<Reservation[]> {

    const whereClause: any = {
    parkingId,
    status: { [Op.in]: [Status.PENDING, Status.CONFIRMED, Status.REJECTED] }
  };

  if (startTimeMin) {
    whereClause.startTime = { [Op.gte]: startTimeMin };
  }
  if (endTimeMax) {
    whereClause.endTime = { [Op.lte]: endTimeMax };
  }

  return await Reservation.findAll({
    where: whereClause,
    order: [['startTime', 'ASC']],
  });
  }

  /**
   * Trova prenotazioni di un utente, opzionalmente filtrate.
   * @param userId - ID dell'utente
   * @param parkingId - (Opzionale) ID del parcheggio
   * @param startTime - (Opzionale) Data di inizio periodo
   * @param endTime - (Opzionale) Data di fine periodo
   * @returns Array di prenotazioni trovate
   */
  async report( userId: string,parkingId?: string, startTime?: Date, endTime?: Date): Promise<Reservation[]> {
    const whereClause: any = {};

    whereClause.userId = userId;

    if (parkingId) {
      whereClause.parkingId = parkingId;
    }
    if (startTime) {
      whereClause.startTime = { [Op.gte]: startTime };
    }
    if (endTime) {
      whereClause.endTime = { [Op.lte]: endTime };
    }
    return await Reservation.findAll({ where: whereClause });
  }

  /**
   * Trova una prenotazione attiva per targa, data e parcheggio.
   * @param licensePlate - Targa del veicolo
   * @param time - Data/ora da verificare
   * @param parkingId - ID del parcheggio
   * @returns La prenotazione trovata o null se non esiste
   */
  async findActiveReservation(licensePlate: string,time: Date, parkingId: string): Promise<Reservation | null> {
    const res = await Reservation.findOne({
      where: {
        licensePlate,
        parkingId,
        startTime: { [Op.lte]: time },
        endTime: { [Op.gte]: time }
      }
    });

    return res;

  }

}
