import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseConnection from '../database/databaseConnection';

const sequelize = DatabaseConnection.getInstance();

export class Parking extends Model<InferAttributes<Parking>, InferCreationAttributes<Parking>> {
  declare id: string;
  declare name: string;
  declare address: string;
  declare closedData: Date;
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
    closedData: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  },
  { sequelize, modelName: 'Parking', timestamps:true }
);
