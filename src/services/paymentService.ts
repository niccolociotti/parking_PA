import { ReservationDAO } from "../dao/reservationDAO";
import { UserDAO } from "../dao/userDAO";
import { ParkingCapacityDao } from "../dao/parkingCapacityDAO";
import { ErrorFactory } from "../factories/errorFactory";
import { Status } from "../utils/Status";
import { StatusCodes } from "http-status-codes";
import { Payment } from "../models/payment";
import { Vehicles } from "../utils/Vehicles";
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from 'pdfkit';
import { PassThrough } from "stream";
import { buffer } from "stream/consumers";
import QRCode from 'qrcode';
import {PaymentDAO} from "../dao/paymentDAO";
/**
 * Questa classe fornisce metodi per effettuare il pagamento di una prenotazione,
 * calcolare il prezzo in base a regole tariffarie, generare e scaricare la ricevuta PDF
 * e produrre QR code per i pagamenti. Gestisce anche i tentativi di pagamento e la cancellazione
 * automatica della prenotazione dopo 3 tentativi falliti.
 * @class PaymentService
 */
export class PaymentService {
  constructor(
    private userDAO: UserDAO,
    private parkingCapacityDAO: ParkingCapacityDao,
    private paymentDAO: PaymentDAO = new PaymentDAO(),
    private reservationDAO: ReservationDAO = new ReservationDAO()
  ) {}

  /**
   * Esegue il pagamento di una prenotazione.
   * Verifica che la prenotazione esista e appartenga all'utente.
   * Scala i token all'utente se sufficienti, aggiorna lo stato della prenotazione e azzera i tentativi.
   * Dopo 3 tentativi falliti per credito insufficiente, elimina la prenotazione.
   * Usata dal PaymentController nella rotta GET /pay/:paymentId.
   * @param paymentId - ID della pagamanto da effettuare
   * @param userId - ID dell'utente che effettua il pagamento
   * @returns Il pagamento e aggiorna la prenotazione
   * @throws Errore se la prenotazione non esiste, non appartiene all'utente, non è pagabile o per credito insufficiente
   */
  async payReservation(paymentId: string, userId: string): Promise<Payment> {
    const payment = await this.paymentDAO.findById(paymentId);

    if (!payment) 
      throw ErrorFactory.entityNotFound('Reservation');

    if (!payment.reservationId) {
      throw ErrorFactory.customMessage('Pagamento non associato a una prenotazione valida', StatusCodes.BAD_REQUEST);
    }
    const reservation = await this.reservationDAO.findById(payment.reservationId);
    if (!reservation) 
      throw ErrorFactory.entityNotFound('Reservation');

    if(payment.userId !== userId)
      throw ErrorFactory.customMessage('Nessun bollettino trovato per questo utente', StatusCodes.FORBIDDEN);
    
    const user = await this.userDAO.findById(userId);
    if (!user) throw ErrorFactory.entityNotFound('User');

    const price = Math.floor(payment.price);

    if (reservation.status == Status.CONFIRMED) {
      throw ErrorFactory.customMessage('Prenotazione già confermata', StatusCodes.BAD_REQUEST);
    }

    if (user.tokens >= price) {
      const newTokens = user.tokens - price;
      reservation.status = Status.CONFIRMED;
      payment.paymentAttemps = 0;
      await user.update({ tokens: newTokens });
      await reservation.save();
      payment.setDataValue('remainingTokens',newTokens);
      await payment.save();
      return payment;
    } else {
      payment.paymentAttemps = (payment.paymentAttemps ?? 0) + 1;
      if (payment.paymentAttemps >= 3) {
        await this.reservationDAO.delete(payment.reservationId);
        throw ErrorFactory.customMessage("Credito insufficiente. Prenotazione cancellata dopo 3 tentativi.",StatusCodes.BAD_REQUEST);
      }
      await payment.save();
      throw ErrorFactory.customMessage('Credito insufficiente. Tentativo ' + payment.paymentAttemps + ' di 3.' ,StatusCodes.BAD_REQUEST);
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
  async downloadPaymentSlip(reservationId: string,userId:string): Promise<Buffer> {

    const reservation = await this.reservationDAO.findById(reservationId);
    if (!reservation) throw ErrorFactory.entityNotFound('Reservation');

    if (reservation.status == Status.CONFIRMED) {
      throw ErrorFactory.customMessage('Reservation is already confirmed', StatusCodes.BAD_REQUEST);
    }

    if(reservation.userId !== userId)
      throw ErrorFactory.customMessage('Nessun bollettino trovato per questo utente', StatusCodes.FORBIDDEN);

    const parking = await this.parkingCapacityDAO.findByParkingAndType(reservation.parkingId, reservation.vehicle.trim().toLowerCase() as Vehicles);
    if (!parking) throw ErrorFactory.entityNotFound('Parking or veichle');

    const amount = PaymentService.calculatePrice(parking.price, reservation.startTime, reservation.endTime);
    const licensePlate = reservation.licensePlate;

    const user = await this.userDAO.findById(reservation.userId);
    if (!user) throw ErrorFactory.entityNotFound('User');

    //Genera UUID pagamento
    const paymentId = uuidv4();

    const paymentData = {
      id: paymentId,
      price: amount,
      userId : reservation.userId,
      reservationId: reservation.id, 
      remainingTokens: user.tokens,
      paymentAttemps: 0,
    };

    const payment = await this.paymentDAO.create(paymentData);
    
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
  async generateQrBuffer(paymentId: string, licensePlate: string, amount: number): Promise<Buffer> {
    const qrString = `${paymentId}|${licensePlate}|${amount.toFixed(2)}`;
    return QRCode.toBuffer(qrString);
  }

    /**
     * Elimina il pagamento associato a una prenotazione, solo se il pagamento non è stato confermato.
     * Questa funzione viene usata dal PaymentController nella rotta DELETE /pay/:paymentId
     * per consentire all'utente di annullare un pagamento non ancora confermato.
     * @param id - ID del pagamento da eliminare
     * @returns Numero di pagamenti eliminati (0 o 1)
     * @throws Errore se il pagamento è già confermato o già eliminato
     */
    async deletePayment(id: string): Promise<number> {

      const payment = await this.paymentDAO.findById(id);
      if (!payment?.reservationId) {
        throw ErrorFactory.entityNotFound('Payment not associated with a reservation');
      }
      const reservation = await this.reservationDAO.findById(payment.reservationId);
      if (!reservation) {
        throw ErrorFactory.entityNotFound('Reservation');
      }
      reservation.status= Status.REJECTED;
      await reservation.save();

      const deletedPayment = await this.paymentDAO.delete(id);
      if (deletedPayment === 0) {
        throw ErrorFactory.entityNotFound('Payment');
      }
      return deletedPayment;
    }
}
