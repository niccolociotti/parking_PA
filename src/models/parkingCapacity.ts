import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseConnection from '../database/databaseConnection';
import { Vehicles } from '../utils/Vehicles';

const sequelize = DatabaseConnection.getInstance();

export class ParkingCapacity extends Model<InferAttributes<ParkingCapacity>, InferCreationAttributes<ParkingCapacity>> {
  declare id: string;
  declare parkingId: string;
  declare vehicleType: Vehicles;    
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
    vehicleType: {
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