import { UserDAO } from "../dao/userDAO";
import { ErrorFactory } from "../factories/errorFactory";
import User from "../models/User";

/**
 * Service per gestire le operazioni degli operatori.
 * @class OperatorService
 * Questo service fornisce funzionalità per aggiornare i token degli utenti.
 * @description Le operazioni sono accessibili solo agli operatori autenticati.
 * @param userDAO - Istanza di UserDAO per gestire le operazioni sugli utenti.
 * 
 */
export class OperatorService {
  constructor(private userDAO: UserDAO) {}

 /**
 * Aggiorna i token di un utente.
 * * @description Questa funzione consente agli operatori di aggiornare i token di un utente specifico.
 * * Gli operatori possono inviare una richiesta con il corpo contenente `userId` e `delta`.
 * * `userId` è l'ID dell'utente di cui aggiornare i token e `delta` è la quantità di token da aggiungere.
 * @param userId 
 * @param delta 
 * @returns  Oggetto User aggiornato con i nuovi token.
 */ 
async updateTokens(userId: string, delta: number): Promise<User> {                                                                                                 

const user = await this.userDAO.findById(userId);
if (!user) {
throw ErrorFactory.entityNotFound("User");
}

const newTokenCount = user.tokens + delta;
if (newTokenCount < 0) throw new Error('I token non possono essere negativi');
user.tokens = newTokenCount;
await this.userDAO.update(user);
return user;
}
}