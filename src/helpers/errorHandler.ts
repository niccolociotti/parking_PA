import { Request, Response, NextFunction } from 'express';

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Errore interno del server';

  res.status(statusCode).json({ error: message });
}

export default errorHandler;