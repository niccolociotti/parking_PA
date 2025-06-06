/**
 * Questo modello definisce lo schema per la tabella 'ParkingCapacity' nel database.
 * Ogni record rappresenta la capacità e il prezzo associati a un tipo di veicolo per uno specifico parcheggio.
 *
 * Attributi:
 *  - id: Identificativo univoco della capacità (UUID, chiave primaria).
 *  - parkingId: ID del parcheggio a cui si riferisce la capacità (chiave esterna).
 *  - vehicle: Tipo di veicolo (auto, moto, ecc.).
 *  - capacity: Numero massimo di posti disponibili per quel tipo di veicolo.
 *  - price: Prezzo per la prenotazione di un posto per quel tipo di veicolo.
 *
 * Il modello utilizza una connessione singleton al database per garantire un'unica istanza.
 *
 * @param {Model} - Estende Sequelize Model per tipizzazione e metodi di istanza.
 *
 * @exports ParkingCapacity - Modello Sequelize per la capacità e i prezzi dei parcheggi.
 */
import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseConnection from '../database/databaseConnection';
import { Vehicles } from '../utils/Vehicles';

const sequelize = DatabaseConnection.getInstance();

export class ParkingCapacity extends Model<InferAttributes<ParkingCapacity>, InferCreationAttributes<ParkingCapacity>> {
  declare id: string;
  declare parkingId: string;
  declare vehicle: Vehicles;    
  declare capacity: number;
  declare price: number;
}

ParkingCapacity.init(
{
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    parkingId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vehicle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  { sequelize, modelName: 'ParkingCapacity',timestamps: true,}
);

export default ParkingCapacity;