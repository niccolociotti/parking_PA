import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseConnection from '../database/databaseConnection';

const sequelize = DatabaseConnection.getInstance();

export class Reservation extends Model<InferAttributes<Reservation>, InferCreationAttributes<Reservation>> {
  declare id: string;
  declare status: string;
  declare userId: string;      
  declare parkingId: string;
  declare licenseplate: string   
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
    licenseplate: {
      type: DataTypes.STRING,
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
  },
  { sequelize, modelName: 'Reservation', timestamps: true }
);

export default Reservation;