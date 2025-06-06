import { ReservationDAO } from "../dao/reservationDAO";
import { UserDAO } from "../dao/userDAO";
import { ParkingCapacityDao } from "../dao/parkingCapacityDAO";
import { ErrorFactory } from "../factories/errorFactory";
import { Status } from "../utils/Status";
import { StatusCodes } from "http-status-codes";
import Reservation from "../models/reservation";
import { Vehicles } from "../utils/Vehicles";
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import { PassThrough } from "stream";
import { buffer } from "stream/consumers";
import QRCode from 'qrcode';

/**
 * Questa classe fornisce metodi per effettuare il pagamento di una prenotazione,
 * calcolare il prezzo in base a regole tariffarie, generare e scaricare la ricevuta PDF
 * e produrre QR code per i pagamenti. Gestisce anche i tentativi di pagamento e la cancellazione
 * automatica della prenotazione dopo 3 tentativi falliti.
 * @class PaymentService
 */
export class PaymentService {
  constructor(
    private reservationDAO: ReservationDAO,
    private userDAO: UserDAO,
    private parkingCapacityDAO: ParkingCapacityDao,
  ) {}

  /**
   * Esegue il pagamento di una prenotazione.
   * Verifica che la prenotazione esista, appartenga all'utente e sia in stato PENDING.
   * Scala i token all'utente se sufficienti, aggiorna lo stato della prenotazione e azzera i tentativi.
   * Dopo 3 tentativi falliti per credito insufficiente, elimina la prenotazione.
   * Usata dal PaymentController nella rotta GET /pay/:reservationId.
   * @param reservationId - ID della prenotazione da pagare
   * @param userId - ID dell'utente che effettua il pagamento
   * @returns La prenotazione aggiornata e confermata
   * @throws Errore se la prenotazione non esiste, non appartiene all'utente, non è pagabile o per credito insufficiente
   */
  async payReservation(reservationId: string, userId: string): Promise<Reservation> {
    const reservation = await this.reservationDAO.findById(reservationId);

    if (!reservation) 
      throw ErrorFactory.entityNotFound('Reservation');

    if(reservation.userId !== userId)
      throw ErrorFactory.customMessage('Nessuna prenotazione trovata per questo utente', StatusCodes.FORBIDDEN);

    if (reservation.status !== Status.PENDING)
      throw ErrorFactory.badRequest('Reservation is not in pending state');
    
    const user = await this.userDAO.findById(userId);
    if (!user) throw ErrorFactory.entityNotFound('User');
   
    const parkingCapacity = await this.parkingCapacityDAO.findByParkingAndType(reservation.parkingId, reservation.vehicle.trim().toLowerCase() as Vehicles);
    if (!parkingCapacity) throw ErrorFactory.entityNotFound('Parking');
    
    const price = PaymentService.calculatePrice(parkingCapacity.price, reservation.startTime, reservation.endTime);

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

  /**
   * Calcola il prezzo totale della prenotazione in base alla durata, weekend e sconti.
   * +50% nel weekend, sconto 5% se durata > 12h.
   * @param pricePerMinute - Prezzo base al minuto
   * @param startTime - Data/ora di inizio
   * @param endTime - Data/ora di fine
   * @returns Prezzo totale arrotondato a due decimali
   */
  static calculatePrice(pricePerMinute: number, startTime: Date, endTime: Date): number {
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

  /**
   * Genera e restituisce la ricevuta di pagamento in PDF per una prenotazione confermata.
   * Inserisce nel PDF i dati della prenotazione, l'importo e un QR code.
   * Usata dal PaymentController nella rotta GET /paymentslip/:id.
   * @param reservationId - ID della prenotazione
   * @returns Buffer del file PDF generato
   * @throws Errore se la prenotazione non esiste o non è confermata
   */
  async downloadPaymentSlip(reservationId: string): Promise<Buffer> {

    const reservation = await this.reservationDAO.findById(reservationId);
    if (!reservation) throw ErrorFactory.entityNotFound('Reservation');

    if (reservation.status !== Status.CONFIRMED) {
      throw ErrorFactory.customMessage('Reservation is not confirmed', StatusCodes.BAD_REQUEST);
    }

    const parking = await this.parkingCapacityDAO.findByParkingAndType(reservation.parkingId, reservation.vehicle.trim().toLowerCase() as Vehicles);
    if (!parking) throw ErrorFactory.entityNotFound('Parking');

    const amount = PaymentService.calculatePrice(parking.price, reservation.startTime, reservation.endTime);
    const licensePlate = reservation.licensePlate;

    //Genera UUID pagamento
    const paymentId = uuidv4();
    
    // Genera QR code
    const qrBuffer = await this.generateQrBuffer(paymentId, licensePlate, amount);

    // Crea il PDF
    const doc = new PDFDocument();
    const stream = doc.pipe(new PassThrough());

    doc.fontSize(18).text('Bollettino di Pagamento', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Targa: ${licensePlate}`);
    doc.text(`Importo: € ${amount.toFixed(2)}`);
    doc.text(`ID Pagamento: ${paymentId}`);
    doc.moveDown();
    doc.image(qrBuffer, { fit: [150, 150], align: 'center' });

    doc.end();
    const pdfBuffer = await buffer(stream);

    return pdfBuffer;
  }

  /**
   * Genera un QR code in formato Buffer con i dati del pagamento.
   * @param paymentId - ID univoco del pagamento
   * @param licensePlate - Targa del veicolo
   * @param amount - Importo pagato
   * @returns Buffer contenente il QR code
   */
  generateQrBuffer(paymentId: string, licensePlate: string, amount: number): Promise<Buffer> {
    const qrString = `${paymentId}|${licensePlate}|${amount.toFixed(2)}`;
    return QRCode.toBuffer(qrString);
  }

}
