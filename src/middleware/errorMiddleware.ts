/**
 * Middleware globale per la gestione centralizzata degli errori.
 * Intercetta tutte le eccezioni propagate nelle route e nei middleware.
 * Se l'errore è una CustomError (gestita dall'applicazione), restituisce il relativo status e messaggio.
 * In caso contrario, restituisce un errore generico 500 "Internal server error".
 *
 * @param err - Oggetto errore sollevato
 * @param req - Oggetto Request di Express
 * @param res - Oggetto Response di Express
 * @param next - Funzione next di Express (non usata, ma richiesta dalla firma)
 */
import { Request, Response, NextFunction } from "express";
import { CustomError, ErrorFactory } from "../factories/errorFactory";
import { StatusCodes } from "http-status-codes";

// Middleware globale per la gestione degli errori
export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof CustomError) {
    res
      .status(err.statusCode)
      .json({ error: err.message});
  }else {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}
