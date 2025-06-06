import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/paymentService';
import { ErrorFactory } from '../factories/errorFactory';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import * as fs from 'fs/promises';
import { ReservationService } from '../services/reservationService';


export class PaymentController {
  constructor(private paymentService: PaymentService,private reservationService: ReservationService) {}
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

    deletePayment = async (req: Request, res: Response, next: NextFunction) => {   
    const deleted = await this.reservationService.deletePayment(req.params.reservationId);

    try{
    console.log("deleted", deleted);
    if (deleted > 0) {
    res.status(StatusCodes.OK).json({ message: `Reservation with ID ${req.params.reservationId} deleted.` });
  } else {
    throw ErrorFactory.entityNotFound("Reservation");
    }
}catch (err) {
    next(err);

  }
}


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