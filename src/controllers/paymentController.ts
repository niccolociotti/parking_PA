import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/paymentService';
import { ErrorFactory } from '../factories/errorFactory';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import * as fs from 'fs/promises';
import { ReservationService } from '../services/reservationService';

/**
 * Controller per gestire le operazioni di pagamento delle prenotazioni.
 * @class PaymentController
 * @description Fornisce metodi per effettuare pagamenti, eliminare pagamenti e scaricare ricevute in PDF.
 */
export class PaymentController {
  constructor(private paymentService: PaymentService, private reservationService: ReservationService) {}

  /**
   * Esegue il pagamento di una prenotazione.
   * Recupera l'ID della prenotazione dai parametri e l'utente autenticato dalla request.
   * Chiama il PaymentService per effettuare il pagamento e restituisce la prenotazione aggiornata.
   * Usata nella rotta GET /pay/:reservationId.
   * @param req - Richiesta HTTP con reservationId nei parametri e utente autenticato
   * @param res - Risposta HTTP con conferma pagamento e dettagli prenotazione
   * @param next - Funzione per la gestione degli errori
   * @returns Restituisce una risposta HTTP con la prenotazione pagata o errore
   */
  pay = async (req: Request, res: Response, next: NextFunction) => {
         const reservationId  = req.params.reservationId;
        try {
        const user = (req as any).user; 
        if (!user || !user.id) {
        throw ErrorFactory.unauthorized();
        }
        const userId: string = user.id;
        const reservation = await this.paymentService.payReservation(reservationId, userId);

        if (reservation) {
            res.status(StatusCodes.OK).json({message: "Pagamento effettuato.",reservation });
        } else {
            throw ErrorFactory.badRequest();
        }
    } catch (err) {
        next(err);
    }
    }

  /**
   * Elimina il pagamento associato a una prenotazione.
   * Recupera l'ID della prenotazione dai parametri e chiama il ReservationService per eliminare il pagamento.
   * Usata nella rotta DELETE /pay/:reservationId.
   * @param req - Richiesta HTTP con reservationId nei parametri
   * @param res - Risposta HTTP di conferma eliminazione
   * @param next - Funzione per la gestione degli errori
   * @returns Restituisce una risposta HTTP di conferma eliminazione o errore se non trovata
   */
  deletePayment = async (req: Request, res: Response, next: NextFunction) => {   
    const deleted = await this.reservationService.deletePayment(req.params.reservationId);

    try{
    if (deleted > 0) {
    res.status(StatusCodes.OK).json({ message: `Reservation with ID ${req.params.reservationId} deleted.` });
  } else {
    throw ErrorFactory.entityNotFound("Reservation");
    }
}catch (err) {
    next(err);

  }
}

/**
   * Scarica la ricevuta di pagamento in formato PDF per una prenotazione.
   * Recupera l'ID della prenotazione dai parametri, genera il PDF tramite il PaymentService e lo invia come allegato.
   * Usata nella rotta GET /paymentslip/:id.
   * @param req - Richiesta HTTP con id della prenotazione nei parametri
   * @param res - Risposta HTTP con il PDF allegato
   * @param next - Funzione per la gestione degli errori
   * @returns Restituisce il file PDF della ricevuta di pagamento
   */
  downloadPaymentSlip = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reservationId = req.params.id;
            if (!reservationId) {
                throw ErrorFactory.badRequest('ReservationId not valid.');
            }
            

            const pdfBuffer  = await this.paymentService.downloadPaymentSlip(reservationId);

            const pdfDir = path.resolve(__dirname, '../../pdf');
            const filename = `payment-slip-${reservationId}.pdf`;
            const filePath = path.join(pdfDir, filename);

            await fs.mkdir(pdfDir, { recursive: true });
            await fs.writeFile(filePath, pdfBuffer);

            // Set headers for PDF download
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=payment-slip-${reservationId}.pdf`);
            res.send(pdfBuffer);
        } catch (err) {
            next(err);
        }
    }

 }