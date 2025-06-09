import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseConnection from '../database/databaseConnection';
export type PaymentCreationAttributes = InferCreationAttributes<Payment>;

const sequelize = DatabaseConnection.getInstance();

/**
 * Classe che rappresenta i pagamenti effettuati dagli utenti per le prenotazioni.
 * Utilizzato per registrare i dettagli del pagamento, come l'importo, l'ID dell'utente,
 * l'ID della prenotazione e il numero di tentativi di pagamento.
 *
 * @class Payment
 */
export class Payment extends Model<InferAttributes<Payment>, InferCreationAttributes<Payment>> {
  declare id: string;
  declare price : number;
  declare userId: string;
  declare reservationId: string | null;
  declare paymentAttemps: number;
  declare remainingTokens: number;
}

Payment.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    reservationId: {
      type: DataTypes.STRING,
      allowNull: true,
        references: {
            model: 'Reservations', 
            key: 'id',
        },
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Users', 
        key: 'id',
      },
    },
    paymentAttemps: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    remainingTokens: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'Payments',
    timestamps: true, 
  }
);