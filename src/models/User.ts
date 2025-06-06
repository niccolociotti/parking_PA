/**
 * Questo modello definisce lo schema per la tabella 'User' nel database.
 * Ogni utente contiene informazioni identificative, credenziali, ruolo e saldo token.
 *
 * Attributi:
 *  - id: Identificativo univoco dell'utente (UUID, chiave primaria).
 *  - name: Nome dell'utente.
 *  - email: Email dell'utente.
 *  - password: Password cifrata dell'utente.
 *  - role: Ruolo dell'utente (es. Operatore, Automobilista).
 *  - tokens: Numero di token disponibili per l'utente.
 *
 * Il modello utilizza una connessione singleton al database per garantire un'unica istanza.
 *
 * @param {Model} - Estende Sequelize Model per tipizzazione e metodi di istanza.
 *
 * @exports User - Modello Sequelize per gli utenti.
 */
import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import { Roles } from '../utils/Roles';
import DatabaseConnection from '../database/databaseConnection';

const sequelize = DatabaseConnection.getInstance();

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare password: string; 
  declare role: Roles;
  declare tokens: number;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokens: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: 'User',timestamps: true,}
);

export default User;

