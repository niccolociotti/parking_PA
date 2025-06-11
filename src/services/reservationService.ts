import { ErrorFactory } from "../factories/errorFactory"; 
import { randomUUID } from "crypto";
import { ReservationDAO } from "../dao/reservationDAO";
import { Status } from "../utils/Status";
import { Reservation } from "../models/reservation";
import { User } from "../models/user";
import { ParkingDao } from "../dao/ParkingDao";
import { Vehicles } from "../utils/Vehicles";
import { StatusCodes } from "http-status-codes";

/**
 * Classe contenente metodi per creare, aggiornare, eliminare e recuperare prenotazioni.
 * @class ReservationService
 */
export class ReservationService {

  constructor(private reservationDAO: ReservationDAO, private parkingDAO: ParkingDao) {}

  /**
   * Crea una nuova prenotazione per un utente e un parcheggio specifico.
   * Questa funzione verifica prima l'esistenza dell'utente e del parcheggio, poi genera una nuova prenotazione
   * con i dati forniti e la salva tramite il DAO. Viene utilizzata dal ReservationController nella rotta POST /reservation
   * per permettere agli utenti di prenotare un posto auto.
   * @param userId - ID dell'utente che effettua la prenotazione
   * @param parkingId - ID del parcheggio dove si vuole prenotare
   * @param licensePlate - Targa del veicolo da associare alla prenotazione
   * @param vehicle - Tipo di veicolo (auto, moto, ecc.)
   * @param status - Stato iniziale della prenotazione (es. "pending")
   * @returns La prenotazione creata
   * @throws Errore se l'utente o il parcheggio non esistono
   */
  async createReservation(userId: string, parkingId: string, licensePlate: string, vehicle: Vehicles, status: Status): Promise<Reservation> {
  
    const user = await User.findByPk(userId);
    if (!user) throw ErrorFactory.entityNotFound("User");

    const parking = await this.parkingDAO.findById(parkingId);
    if (!parking) throw ErrorFactory.entityNotFound("Parking");

    const startTime = new Date();
    const endTime = new Date(startTime);
    endTime.setDate(startTime.getDate() + 5);


    const reservationData= {
      id: randomUUID(),
      userId,
      parkingId,
      licensePlate,
      vehicle,
      status,
      startTime,
      endTime,
      paymentAttemps : 0
  }
    return this.reservationDAO.create(reservationData);
  }

  /**
   * Aggiorna una prenotazione esistente con i dati forniti.
   * La funzione cerca la prenotazione tramite ID e aggiorna solo i campi specificati nell'oggetto updates.
   * Viene usata dal ReservationController nella rotta POST /reservation/update/:id per consentire agli utenti
   * di modificare una prenotazione già effettuata.
   * @param id - ID della prenotazione da aggiornare
   * @param updates - Oggetto contenente i campi da aggiornare
   * @returns La prenotazione aggiornata
   * @throws Errore se la prenotazione non esiste
   */
  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
    const reservations = await this.reservationDAO.update(id, updates);
    if (!reservations) {
      throw ErrorFactory.entityNotFound('Reservation');
    }
    return reservations
  }

  /**
   * Restituisce tutte le prenotazioni associate a uno specifico utente.
   * Questa funzione recupera tutte le prenotazioni dal DAO filtrando per userId.
   * È utilizzata dal ReservationController nella rotta GET /reservations/user/:userId
   * per mostrare all'utente tutte le sue prenotazioni.
   * @param userId - ID dell'utente
   * @returns Array di prenotazioni dell'utente
   * @throws Errore se non vengono trovate prenotazioni per l'utente
   */
  async findReservationsByUserId(userId: string): Promise<Reservation[]> {
    const reservations = await this.reservationDAO.findAllByUser(userId);
    if (!reservations) {
      throw ErrorFactory.entityNotFound('Reservations');
    }
    return reservations;
  }

  async findReservationById(reservationId: string): Promise<Reservation> {
    const reservation = await this.reservationDAO.findById(reservationId);
    if (!reservation) {
      throw ErrorFactory.entityNotFound('Reservation');
    }
    return reservation;
  }

  /**
   * Restituisce una singola prenotazione dato il suo ID.
   * La funzione cerca la prenotazione tramite il DAO e restituisce i dettagli se trovata.
   * È usata dal ReservationController nella rotta GET /reservation/:id per ottenere i dettagli
   * di una prenotazione specifica.
   * @param id - ID della prenotazione
   * @returns La prenotazione trovata
   * @throws Errore se la prenotazione non esiste
   */
  async findReservationByIdAndUser(id: string,userId:string): Promise<Reservation | null> {
    const reservation = this.reservationDAO.findByIdAndUser(id,userId);
    if(!reservation) {
      throw ErrorFactory.entityNotFound('Reservation for this user');
    }
    return reservation;
  }

  /**
   * Elimina una prenotazione dato il suo ID.
   * La funzione elimina la prenotazione tramite il DAO e restituisce il numero di record eliminati.
   * È utilizzata dal ReservationController nella rotta DELETE /reservation/:id per permettere
   * all'utente di cancellare una propria prenotazione.
   * @param id - ID della prenotazione da eliminare
   * @returns Numero di prenotazioni eliminate (0 o 1)
   * @throws Errore se la prenotazione non esiste
   */
  async deleteReservation(id: string): Promise<number> {
    const deleted = await this.reservationDAO.delete(id);
    if (deleted === 0) {
      throw ErrorFactory.entityNotFound('Reservation');
    }
    return deleted;
  }

  /**
   * Restituisce tutte le prenotazioni presenti nel sistema.
   * Recupera tutte le prenotazioni tramite il DAO, senza filtri.
   * È usata dal ReservationController nella rotta GET /reservations per mostrare
   * l'elenco completo delle prenotazioni (ad esempio per l'amministratore).
   * @returns Array di tutte le prenotazioni
   * @throws Errore se non ci sono prenotazioni
   */
  async findAllReservations(): Promise<Reservation[]> {
    const reservations = await this.reservationDAO.findAll();
    if (!reservations) {
      throw ErrorFactory.entityNotFound('Reservations');
  }
    return reservations;
  }  

  /**
   * Restituisce le prenotazioni filtrate per targhe e periodo di tempo.
   * Questa funzione permette di ottenere solo le prenotazioni che corrispondono a una lista di targhe
   * e che rientrano in un intervallo di date specificato. È usata dal ReservationController per
   * generare report o statistiche sulle prenotazioni.
   * @param plates - Array di targhe da filtrare
   * @param startTime - Data di inizio periodo
   * @param endTime - Data di fine periodo
   * @returns Array di prenotazioni trovate
   * @throws Errore se non vengono trovate prenotazioni
   */
  async getReservationsByPlatesPeriod(plates: string[], startTime: Date, endTime: Date): Promise<Reservation[]> {
    const reservations = await this.reservationDAO.findByPlatesAndPeriod(plates, startTime, endTime);
    if (!reservations) {
      throw ErrorFactory.entityNotFound('Reservations');
    } 
    return reservations
  }

  /**
   * Genera un report delle prenotazioni per utente, parcheggio e periodo.
   * Questa funzione permette di ottenere tutte le prenotazioni di un utente, eventualmente filtrate
   * anche per parcheggio e intervallo di tempo. È usata dal ReservationController nella rotta
   * GET /reservationsReport/:id/:format per esportare report personalizzati.
   * @param userId - ID dell'utente
   * @param parkingId - (Opzionale) ID del parcheggio
   * @param startTime - (Opzionale) Data di inizio periodo
   * @param endTime - (Opzionale) Data di fine periodo
   * @returns Array di prenotazioni trovate per il report
   * @throws Errore se non vengono trovate prenotazioni
   */
  async getReservationsReport(userId: string, parkingId?: string, startTime?: Date, endTime?: Date): Promise<Reservation[]> {

    const reservations = await this.reservationDAO.report(userId,parkingId, startTime, endTime);
    if (!reservations) {
      throw ErrorFactory.entityNotFound('Reservations');
    }
    return reservations;
  }


}
