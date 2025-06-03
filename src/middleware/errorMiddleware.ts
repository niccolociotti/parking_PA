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
