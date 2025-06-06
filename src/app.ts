import express from 'express';
import dotenv from 'dotenv';
import reservationRoutes from "./routes/reservationRoutes";
import authRoutes from "./routes/authRoutes";
import fineRoutes from "./routes/fineRoutes";
import parkingRoutes from "./routes/ParkingRoutes";
import parkingCapacityRoutes from "./routes/parkingCapacityRoutes";
import { errorMiddleware } from './middleware/errorMiddleware';
import operatorRoutes from "./routes/operatorRoutes";


/** 
  * Carica le variabili d'ambiente dal file .env.
  * Questo permette di utilizzare variabili senza ancorarle nel codice.
  */
dotenv.config();

/**
 * Crea un'istanza dell'applicazione Express.
 *
 * @constant {express.Application} app
 */
const app = express();

/**
 * Questo middleware è necessario per poter leggere i dati inviati
 * in formato JSON nelle richieste POST o PUT.
 * Utilizza `express.json()` (middleware integrato in Express) per il parsing automatico dei payload JSON nelle richieste
 * e lo trasforma in un oggetto Javascript utilizzabile.
 */
app.use(express.json());

/**
 * Questa route gestisce le richieste relative all'autenticazione degli utenti.
 * Utilizza il router definito in `authRoutes.js` per gestire le operazioni di login, registrazione e gestione degli utenti.
 * @see authRoutes.js
 * @module authRoutes
 */
app.use('', authRoutes);

/**
 * Questa route gestisce le richieste relative agli operatori.
 * Utilizza il router definito in `operatorRoutes.js` per gestire le degli operatori.
 * Le operazioni possono includere la generazione di report sulle prenotazioni e statistiche sui parcheggi.
 * @see operatorRoutes.js
 * @module operatorRoutes
 */
app.use('/operator', operatorRoutes);

/**
 * Questa route gestisce le richieste relative alle prenotazioni.
 * Utilizza il router definito in `reservationRoutes.js` per gestire le operazioni CRUD sulle prenotazioni.
 * Le operazioni possono includere la creazione, la lettura, l'aggiornamento e la cancellazione delle prenotazioni.
 * @see reservationRoutes.js
 * @module reservationRoutes
 */
app.use("/api", reservationRoutes);

/**
 * Questa route gestisce le richieste relative alle multe.
 * Utilizza il router definito in `fineRoutes.js` per gestire le operazioni CRUD sulle multe.
 * Le operazioni possono includere la creazione, la lettura, l'aggiornamento e la cancellazione delle multe.
 * @see fineRoutes.js
 * @module fineRoutes
 */
app.use("/check", fineRoutes);

/**
 * Questa route gestisce le richieste relative ai parcheggi.
 * Utilizza il router definito in `ParkingRoutes.js` per gestire le operazioni CRUD sui parcheggi.
 * Le operazioni possono includere la creazione, la lettura, l'aggiornamento e la cancellazione dei parcheggi.
 * @see ParkingRoutes.js
 * @module ParkingRoutes
 */
app.use('/park',parkingRoutes);

/**
 * Questa route gestisce le richieste relative alla capacità dei parcheggi.
 * Utilizza il router definito in `parkingCapacityRoutes.js` per gestire le operazioni CRUD sui parcheggi.
 * Le operazioni possono includere la visualizzazione della capacità attuale, l'aggiornamento della capacità, ecc.
 */
app.use('/info', parkingCapacityRoutes);

/**
 * Questo middleware gestisce gli errori che possono verificarsi durante l'elaborazione delle richieste.
 * È definito in un file separato `errorMiddleware.js` e viene utilizzato per catturare e gestire gli errori in modo centralizzato.
 * Questo middleware deve essere posizionato dopo tutte le route per poter catturare gli errori generati da esse.
 */
app.use(errorMiddleware);

/**
 * Definisce la porta su cui il server sarà in esecuzione.
 * Utilizza il valore della variabile d'ambiente `PORT` oppure, in assenza, utilizza la porta 3000.
 *
 * @constant {number|string} port
 */
const PORT = process.env.PORT || 3000;

/**
 * Avvia il server Express e lo mette in ascolto sulla porta specificata.
 * Stampa un messaggio di log per indicare che il server è in esecuzione.
 * @param {number|string} PORT - La porta su cui il server ascolterà le richieste.
 */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/**
 * Esporta l'istanza dell'applicazione per utilizzarla in altri moduli.
 * @exports app
 */
export default app;
