import { ErrorFactory } from "../factories/errorFactory"; 
import { randomUUID } from "crypto";
import { ReservationDAO } from "../dao/reservationDAO";
import { Status } from "../utils/Status";
import { Reservation } from "../models/reservation";
import { User } from "../models/user";
import { ParkingDao } from "../dao/ParkingDao";
import { Vehicles } from "../utils/Vehicles";


export class ReservationService {

  constructor(private reservationDAO: ReservationDAO, private parkingDAO: ParkingDao) {}

  async createReservation( userId: string, parkingId: string, licensePlate: string, vehicle: Vehicles ,paymentAttemps : number , status?: Status): Promise<Reservation> {
  
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
      status: status || Status.PENDING,
      startTime,
      endTime,
      paymentAttemps : 0
  }
    return this.reservationDAO.create(reservationData);
  }

  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | null> {
    const reservations = await this.reservationDAO.update(id, updates);
    if (!reservations) {
      throw ErrorFactory.entityNotFound('Reservation');
    }
    return reservations
  }

  async findReservationsByUserId(userId: string): Promise<Reservation[]> {
    const reservations = await this.reservationDAO.findAllByUser(userId);
    if (!reservations) {
      throw ErrorFactory.entityNotFound('Reservations');
    }
    return reservations;
  }

  async findReservationById(id: string): Promise<Reservation | null> {
    const reservation = this.reservationDAO.findById(id);
    if(!reservation) {
      throw ErrorFactory.entityNotFound('Reservation');
    }
    return reservation;
  }

  async deleteReservation(id: string): Promise<number> {
    const deleted = await this.reservationDAO.delete(id);
    if (deleted === 0) {
      throw ErrorFactory.entityNotFound('Reservation');
    }
    return deleted;
  }

  async findAllReservations(): Promise<Reservation[]> {
    const reservations = await this.reservationDAO.findAll();
    if (!reservations) {
      throw ErrorFactory.entityNotFound('Reservations');
  }
    return reservations;
  }  

  async getReservationsByPlatesPeriod(plates: string[], startTime: Date, endTime: Date): Promise<Reservation[]> {
    const reservations = await this.reservationDAO.findByPlatesAndPeriod(plates, startTime, endTime);
    if (!reservations) {
      throw ErrorFactory.entityNotFound('Reservations');
    } 
    return reservations
  }

}
