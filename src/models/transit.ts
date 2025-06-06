/**
 * Questo modello definisce lo schema per la tabella 'Transits' nel database.
 * Ogni record rappresenta un transito di un veicolo (ingresso o uscita) in un parcheggio,
 * con eventuale riferimento alla prenotazione associata.
 *
 * Attributi:
 *  - id: Identificativo univoco del transito (UUID, chiave primaria).
 *  - type: Tipo di transito (ingresso o uscita).
 *  - licensePlate: Targa del veicolo.
 *  - parkingId: ID del parcheggio.
 *  - time: Data e ora del transito.
 *  - reservationId: ID della prenotazione associata (può essere null).
 *
 * Il modello utilizza una connessione singleton al database per garantire un'unica istanza.
 *
 * @param {Model} - Estende Sequelize Model per tipizzazione e metodi di istanza.
 *
 * @exports Transit - Modello Sequelize per i transiti.
 */
import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseConnection from '../database/databaseConnection';
export type TransitCreationAttributes = InferCreationAttributes<Transit>;

export enum TransitType {
  IN = 'ingresso',
  OUT = 'uscita',
}

const sequelize = DatabaseConnection.getInstance();

export class Transit extends Model<InferAttributes<Transit>, InferCreationAttributes<Transit>> {
  declare id: string;
  declare type : TransitType;
  declare licensePlate: string;
  declare parkingId: string;
  declare time: Date; 
  declare reservationId: string | null;
}

Transit.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(TransitType.IN, TransitType.OUT),
      allowNull: false,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parkingId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reservationId: {
      type: DataTypes.UUID,
      allowNull: true, 
    }     
  },
  {
    sequelize,
    tableName: 'Transits',
  }
);

export default Transit;