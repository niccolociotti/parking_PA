/**
 * Questo modello definisce lo schema per la tabella 'Parking' nel database.
 * Ogni parcheggio contiene informazioni identificative, indirizzo, capacità massima e giorni di chiusura.
 *
 * Attributi:
 *  - id: Identificativo univoco del parcheggio (UUID, chiave primaria).
 *  - name: Nome del parcheggio.
 *  - address: Indirizzo del parcheggio.
 *  - capacity: Numero massimo di posti disponibili.
 *  - closedData: Array di date in cui il parcheggio è chiuso.
 *
 * Il modello utilizza una connessione singleton al database per garantire un'unica istanza.
 *
 * @param {Model} - Estende Sequelize Model per tipizzazione e metodi di istanza.
 *
 * @exports Parking - Modello Sequelize per i parcheggi.
 */
import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseConnection from '../database/databaseConnection';
export type ParkingCreationAttributes = InferCreationAttributes<Parking>;

const sequelize = DatabaseConnection.getInstance();

export class Parking extends Model<InferAttributes<Parking>, InferCreationAttributes<Parking>> {
  declare id: string;
  declare name: string;
  declare address: string;
  declare capacity: number;
  declare closedData: Date[];
}

Parking.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    closedData: {
      type: DataTypes.ARRAY(DataTypes.DATE),
      allowNull: false,
      defaultValue: [],
    }
  },
  { sequelize, modelName: 'Parking', timestamps:true }
);

export default Parking;