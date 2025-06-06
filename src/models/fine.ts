/**
 * Questo modello definisce lo schema per la tabella 'Fines' nel database.
 * Ogni multa contiene informazioni sull'importo, la targa del veicolo, il parcheggio e il motivo della sanzione.
 *
 * Attributi:
 *  - id: Identificativo univoco della multa (UUID, chiave primaria).
 *  - price: Importo della multa.
 *  - licensePlate: Targa del veicolo a cui è associata la multa.
 *  - parkingId: ID del parcheggio dove è stata rilevata la violazione (chiave esterna).
 *  - reason: Motivo della multa.
 *
 * Il modello utilizza una connessione singleton al database per garantire un'unica istanza.
 *
 * @param {Model} - Estende Sequelize Model per tipizzazione e metodi di istanza.
 *
 * @exports Fine - Modello Sequelize per le multe.
 */
import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseConnection from '../database/databaseConnection';
export type FineCreationAttributes = InferCreationAttributes<Fine>;

const sequelize = DatabaseConnection.getInstance();

export class Fine extends Model<InferAttributes<Fine>, InferCreationAttributes<Fine>> {
  declare id: string;
  declare price: number;
  declare licensePlate: string;
  declare parkingId: string;
  declare reason: string;
}

Fine.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    parkingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Parkings', 
        key: 'id',
      },
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
  },
  {
    sequelize,
    tableName: "Fines",
    timestamps: true,
  }
);

export default Fine;
