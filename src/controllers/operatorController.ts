import { NextFunction, Request, Response } from "express";
import { ErrorFactory } from "../factories/errorFactory";
import { OperatorService } from "../services/operatorService";

/**
 * Controller per gestire le operazioni degli operatori.                                            
 * @class OperatorController
 * * Questo controller fornisce funzionalità per aggiornare i token degli utenti.
 * * @description Le operazioni sono accessibili solo agli operatori autenticati.
 * * @param operatorService - Istanza di OperatorService per gestire le operazioni sugli utenti.
 * * @throws ErrorFactory.badRequest se il delta è negativo o mancante.
 * * @throws ErrorFactory.entityNotFound se l'ID utente non è fornito.
 * * @throws ErrorFactory.entityNotFound se l'utente con l'ID specificato non esiste.
 * * @returns Oggetto JSON con l'utente aggiornato se l'operazione ha successo.
 */
 export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  /**
   * Aggiorna i token di un utente.
   * @route POST /operator/update-tokens
   * @description Questa rotta consente agli operatori di aggiornare i token di un utente specifico.
   * Gli operatori possono inviare una richiesta POST con il corpo contenente `userId` e `delta`.
   * `userId` è l'ID dell'utente di cui aggiornare i token e `delta` è la quantità di token da aggiungere.
   * @param req 
   * @param res 
   * @param next 
   */
 updateTokens = async (req: Request, res: Response, next:NextFunction) => {
  const { userId, delta } = req.body;
  if (delta < 0) {
throw ErrorFactory.badRequest("Delta cannot be negative.");
}
  if (!delta) {
    throw ErrorFactory.badRequest("Delta are required.");
    }
 if(!userId) {
   throw ErrorFactory.entityNotFound("User ID");
  }
try {
    const updatedUser = await this.operatorService.updateTokens(userId, parseInt(delta));
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
}
}