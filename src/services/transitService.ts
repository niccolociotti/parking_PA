import { TransitDAO } from '../dao/transitDAO';
import { ReservationDAO } from '../dao/reservationDAO';
import { TransitType } from '../models/transit';
import { Transit } from '../models/transit';
import { randomUUID } from 'crypto';
import { FineService } from './fineService';
import { Fine } from '../models/fine';
import { Status } from '../utils/Status';
import { ErrorFactory } from '../factories/errorFactory';
import { StatusCodes } from 'http-status-codes';

/**
 * Questa classe fornisce metodi per registrare un transito (ingresso/uscita) di un veicolo in un parcheggio,
 * verificando la validità della prenotazione e generando una multa se il transito avviene senza prenotazione valida
 * o fuori dall'orario consentito.
 * Utilizzata dai controller per gestire le logiche di accesso ai parcheggi e la generazione automatica delle multe.
 *
 * @class TransitService
 */
export class TransitService {
    constructor(private transitDao: TransitDAO, private reservationDAO: ReservationDAO, private fineService: FineService) {}

    /**
     * Registra un transito (ingresso/uscita) di un veicolo in un parcheggio.
     * Se non esiste una prenotazione valida o il transito avviene fuori orario, genera una multa.
     * @param licensePlate - Targa del veicolo
     * @param parkingId - ID del parcheggio
     * @param type - Tipo di transito (ingresso/uscita)
     * @param time - Data e ora del transito (default: ora attuale)
     * @returns Il transito registrato o la multa generata
     * @throws Errore se la prenotazione non è valida o se la multa non può essere creata
     */
    async creaTransitoFine(licensePlate: string, parkingId: string, type: TransitType, time: Date = new Date()): Promise<Transit | Fine> {

        // Cerca una prenotazione attiva per la targa, data e parcheggio
        const reservation = await this.reservationDAO.findActiveReservation(licensePlate, time, parkingId);
        
        if(!reservation) {
            // Se non c'è prenotazione valida, genera una multa
            const fine = await this.fineService.createFine(
                licensePlate,
                parkingId,
                "Transito senza prenotazione valida"
            );
            if (!fine) {
                throw new Error("Errore nella creazione della multa");
            }
            return fine;
        }

        // Se il transito avviene fuori dall'orario della prenotazione, genera una multa
        if ((time < reservation.startTime)||(time > reservation.endTime)) {
            const fine = await this.fineService.createFine(
                licensePlate,
                parkingId,
                "Transito fuori orario prenotazione"
            );
            if (!fine) {
                throw new Error("Errore nella creazione della multa");
            }
            return fine;
        }

         // La prenotazione deve essere CONFIRMED o PENDING
        if (reservation?.status !== Status.CONFIRMED && reservation?.status !== Status.PENDING) {
            const fine = await this.fineService.createFine(
                licensePlate,
                parkingId,
                "Transito con prenotazione non pagata"
            );
            if (!fine) {
                throw new Error("Errore nella creazione della multa");
            }
            return fine;
        }
        
        // Se tutto è valido, registra il transito
        const transitData ={
            id: randomUUID(), 
            type,
            licensePlate,
            parkingId,
            time,
            reservationId : reservation? reservation.id : null
        };

        return await this.transitDao.createTransit(transitData);
    }
}