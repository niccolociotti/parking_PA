import { ReservationDAO } from "../dao/reservationDAO";
import { UserDAO } from "../dao/userDAO";
import { ParkingCapacityDao } from "../dao/parkingCapacityDAO";
import { ErrorFactory } from "../factories/errorFactory";
import { Status } from "../utils/Status";
import { StatusCodes } from "http-status-codes";
import Reservation from "../models/reservation";

export class PaymentService {
  constructor(
    private reservationDAO: ReservationDAO,
    private userDAO: UserDAO,
    private parkingCapacityDAO: ParkingCapacityDao,
  ) {}

  async payReservation(reservationId: string, userId: string): Promise<Reservation> {
    const reservation = await this.reservationDAO.findById(reservationId);
 
    if (!reservation || reservation.userId !== userId)
      throw ErrorFactory.entityNotFound('Reservation');

    if (reservation.status !== Status.PENDING)
      throw ErrorFactory.badRequest('Reservation is not in pending state');

    
    const user = await this.userDAO.findById(userId);
    if (!user) throw ErrorFactory.entityNotFound('User');

   
    const parking = await this.parkingCapacityDAO.findByParkingAndType(reservation.parkingId, reservation.vehicle);
    if (!parking) throw ErrorFactory.entityNotFound('Parking');
    
    const price = this.calculatePrice(parking.price, reservation.startTime, reservation.endTime);

    if (user.tokens >= price) {
      user.tokens -= price;
      reservation.status = Status.CONFIRMED;
      reservation.paymentAttemps = 0;
      await user.save();
      await reservation.save();
      return reservation;
    } else {
      reservation.paymentAttemps = (reservation.paymentAttemps ?? 0) + 1;
      if (reservation.paymentAttemps >= 3) {
        await this.reservationDAO.delete(reservationId);
        throw ErrorFactory.customMessage("Credito insufficiente. Prenotazione cancellata dopo 3 tentativi.",StatusCodes.BAD_REQUEST);
      }
      await reservation.save();
      throw ErrorFactory.customMessage('Credito insufficiente. Tentativo ' + reservation.paymentAttemps + ' di 3.' ,StatusCodes.BAD_REQUEST);
    }
  }

  // Funzione di calcolo prezzo secondo le regole della specifica
  calculatePrice(pricePerMinute: number, startTime: Date, endTime: Date): number {
  const msPerMinute = 1000 * 60;
  let totalPrice = 0;
  let cursor = new Date(startTime.getTime()); // data “corrente” che avanzeremo minuto per minuto

  while (cursor < endTime) {
    const day = cursor.getDay(); // 0 = domenica, 6 = sabato
    const isWeekendMinute = (day === 0 || day === 6);
    const tariffaAttuale = isWeekendMinute 
      ? pricePerMinute * 1.5  // +50% nel weekend
      : pricePerMinute;

    totalPrice += tariffaAttuale;
    cursor = new Date(cursor.getTime() + msPerMinute);
  }

  // Sconto 5% se durata totale > 12h
  const totalMinutes = Math.ceil((endTime.getTime() - startTime.getTime()) / msPerMinute);
  if (totalMinutes > 12 * 60) {
    totalPrice *= 0.95;
  }

  return Math.round(totalPrice * 100) / 100;
}

}
