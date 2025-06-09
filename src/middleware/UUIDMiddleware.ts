// src/middlewares/UUIDMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { validate as isUUID } from 'uuid';
import { ErrorFactory } from '../factories/errorFactory';
import { StatusCodes } from 'http-status-codes';

export class UUIDMiddleware {
  private static ID_PARAMS = [
    'id',
    'userId',
    'reservationId',
    'paymentId',
    'parkingId',
    'fineId',
    'parkingCapacityId',
    'transitId',
  ] as const;

   validateUUID = (req: Request, res: Response, next: NextFunction) => {
    for (const name of UUIDMiddleware.ID_PARAMS) {
      const v = req.params[name];
      if (v && !isUUID(v)) {
        return next(
          ErrorFactory.customMessage(
            `Parametro '${name}' non valido: deve essere un UUID`,
            StatusCodes.BAD_REQUEST
          )
        );
      }
    }
    next();
  };
}
