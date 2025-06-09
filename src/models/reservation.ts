import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseConnection from '../database/databaseConnection';
import { Vehicles } from '../utils/Vehicles';
export type ReservationCreationAttributes = InferCreationAttributes<Reservation>;

/**
 *
 * Questo modello definisce lo schema per la tabella 'Reservations' nel database.
 * Ogni prenotazione contiene informazioni sull'utente, il parcheggio, il veicolo,
 * lo stato della prenotazione, i tentativi di pagamento e il periodo di validità.
 *
 * Attributi:
 *  - id: Identificativo univoco della prenotazione (UUID, chiave primaria).
 *  - status: Stato della prenotazione (es. PENDING, CONFIRMED, REJECTED).
 *  - userId: ID dell'utente che ha effettuato la prenotazione (chiave esterna).
 *  - parkingId: ID del parcheggio prenotato (chiave esterna).
 *  - licensePlate: Targa del veicolo associato alla prenotazione.
 *  - vehicle: Tipo di veicolo (auto, moto, ecc.).
 *  - paymentAttemps: Numero di tentativi di pagamento effettuati.
 *  - startTime: Data e ora di inizio della prenotazione.
 *  - endTime: Data e ora di fine della prenotazione.
 *
 * Il modello utilizza una connessione singleton al database per garantire un'unica istanza.
 *
 * @param {Model} - Estende Sequelize Model per tipizzazione e metodi di istanza.
 *
 * @exports Reservation - Modello Sequelize per le prenotazioni.
 */

const sequelize = DatabaseConnection.getInstance();

export class Reservation extends Model<InferAttributes<Reservation>, InferCreationAttributes<Reservation>> {
  declare id: string;
  declare status?: string;
  declare userId: string;      
  declare parkingId: string;
  declare licensePlate: string;
  declare vehicle: Vehicles;
  declare startTime: Date;
  declare endTime: Date;
}

Reservation.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicle: {
      type: DataTypes.ENUM,
      values: Object.values(Vehicles),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Nome tabella User
        key: 'id',
      },
    },
    parkingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Parkings', // Nome tabella Parking
        key: 'id',
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false, 
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },  
  },
  { sequelize, tableName: 'Reservations', timestamps: true }
);

export default Reservation;