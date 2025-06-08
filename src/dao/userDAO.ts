import { User } from '../models/user';

/** 
 * Interfaccia per il Data Access Object (DAO) degli utenti.
 * Questa interfaccia definisce i metodi per accedere ai dati degli utenti nel database.
 * I metodi principali sono:
 * - `findByEmail`: per cercare un utente in base all'email.
 * - `findById`: per cercare un utente in base all'ID.
 * Questa interfaccia viene implementata dalla classe `UserDAO`, che utilizza il modello `User` per interagire con il database. 
 * L'implementazione concreta di questi metodi consente di separare la logica di accesso ai dati dalla logica di business,
 * permettendo una maggiore modularità e testabilità del codice.
 * 
 */
interface UserDAOInterface {
  findByEmail(data: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}

/**
 * Classe che implementa l'interfaccia UserDAOInterface per accedere ai dati degli utenti.
 * Questa classe utilizza il modello `User` per interagire con il database e implementa i metodi definiti nell'interfaccia.
 * @implements {UserDAOInterface}
 * @description Questa classe fornisce metodi per cercare gli utenti nel database
 * in base all'email o all'ID. Utilizza il modello `User` per effettuare le query.
 */
export class UserDAO implements UserDAOInterface {

  /** 
   * Metodo per cercare un utente nel database in base all'email.
   * @param {string} email - L'email dell'utente da cercare.
   * @return {Promise<User | null>} Una promessa che risolve con l'utente trovato o null se non esiste.
   * @description Questo metodo esegue una query sul modello `User` per trovare un utente
   * con l'email specificata. Se l'utente esiste, viene restituito come oggetto `User`, altrimenti viene restituito `null`.
   * * Utilizzato per verificare l'esistenza di un utente durante il processo di login o registrazione.
   * * @throws {Error} Se si verifica un errore durante l'interrogazione del database.
   * */
   async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({where: {email}});
  }

  /** 
   * Metodo per cercare un utente nel database in base all'ID.
   * @param {string} id - L'ID dell'utente da cercare.
   * @return {Promise<User | null>} Una promessa che risolve con l'utente trovato o null se non esiste.
   * @description Questo metodo esegue una query sul modello `User` per trovare un utente
   * con l'ID specificato. Se l'utente esiste, viene restituito come oggetto `User`, altrimenti viene restituito `null`.
   * Utilizzato per recuperare i dettagli di un utente specifico, ad esempio durante la visualizzazione del profilo.
   * @throws {Error} Se si verifica un errore durante l'interrogazione del database.
   */
  async findById(id: string): Promise<User | null> {
    return await User.findOne({where: {id}});
  }
  
  /**
   *  Metodo per aggiornare un utente nel database.
   * * @description Questo metodo cerca un utente esistente in base all'ID fornito e aggiorna i suoi dati.
   * * Se l'utente non esiste, viene sollevata un'eccezione.
   * @param user 
   * @return {Promise<User>} Una promessa che risolve con l'utente aggiornato.
   * @throws Error Se l'utente con l'ID specificato non esiste.
   */
  async update(user: User): Promise<User> {
    const existingUser = await User.findByPk(user.id);
    if (!existingUser) {
      throw new Error(`User with id ${user.id} not found`);
    }
    existingUser.tokens = user.tokens;
    return await existingUser.save();
  }

}