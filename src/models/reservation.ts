import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseConnection from '../database/databaseConnection';
export type ReservationCreationAttributes = InferCreationAttributes<Reservation>;


const sequelize = DatabaseConnection.getInstance();

export class Reservation extends Model<InferAttributes<Reservation>, InferCreationAttributes<Reservation>> {
  declare id: string;
  declare status?: string;
  declare userId: string;      
  declare parkingId: string;
  declare licensePlate: string
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