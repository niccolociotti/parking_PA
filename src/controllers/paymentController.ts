import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/paymentService';
import { ErrorFactory } from '../factories/errorFactory';
import { StatusCodes } from 'http-status-codes';


export class PaymentController {
  constructor(private paymentService: PaymentService) {}
    pay = async (req: Request, res: Response, next: NextFunction) => {
        try {
        const reservationId  = req.body.reservationId;
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
}