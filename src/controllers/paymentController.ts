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
   * Recupera l'ID del pagamento dai parametri e l'utente autenticato dalla request.
   * Chiama il PaymentService per effettuare il pagamento e restituisce il pagamento e aggiorna la prenotazione.
   * Usata nella rotta GET /pay/:paymentId.
   * @param req - Richiesta HTTP con paymentId nei parametri e utente autenticato
   * @param res - Risposta HTTP con conferma pagamento e dettagli del pagamento
   * @param next - Funzione per la gestione degli errori
   * @returns Restituisce una risposta HTTP con il pagamento pagato o errore
   */
  pay = async (req: Request, res: Response, next: NextFunction) => {
         const paymentId  = req.params.paymentId;
        try {
        const user = (req as any).user; 
        if (!user || !user.id) {
        throw ErrorFactory.unauthorized();
        }
        const userId: string = user.id;
        const payment = await this.paymentService.payReservation(paymentId, userId);
        if (payment) {
            res.status(StatusCodes.OK).json({message: "Pagamento effettuato.",payment});
        } else {
            throw ErrorFactory.badRequest();
        }
    } catch (err) {
        next(err);
    }
    }

  /**
   * Elimina il pagamento associato a una prenotazione e cambia stato in REJECTED.
   * Recupera l'ID dai parametri e chiama il ReservationService per eliminare il pagamento.
   * Usata nella rotta DELETE /pay/:paymentId.
   * @param req - Richiesta HTTP con paymentId nei parametri
   * @param res - Risposta HTTP di conferma eliminazione
   * @param next - Funzione per la gestione degli errori
   * @returns Restituisce una risposta HTTP di conferma eliminazione o errore se non trovata
   */
  deletePayment = async (req: Request, res: Response, next: NextFunction) => {   
    const deleted = await this.paymentService.deletePayment(req.params.paymentId);

    try{
    if (deleted > 0) {
    res.status(StatusCodes.OK).json({ message: `Paymnet with ID ${req.params.paymentId} deleted.` });
  } else {
    throw ErrorFactory.entityNotFound("Payment");
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
            const user = (req as any).user; 
            if (!user || !user.id) {
            throw ErrorFactory.unauthorized();
            }
            const reservationId = req.params.id;
            if (!reservationId) {
                throw ErrorFactory.badRequest('ReservationId not valid.');
            }

            const pdfBuffer  = await this.paymentService.downloadPaymentSlip(reservationId,user.id);

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