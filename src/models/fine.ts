import { DataTypes, Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import DatabaseConnection from '../database/databaseConnection';
export type FineCreationAttributes = InferCreationAttributes<Fine>;

const sequelize = DatabaseConnection.getInstance();

export class Fine extends Model<InferAttributes<Fine>, InferCreationAttributes<Fine>> {
  declare id: string;
  declare price: number;
  declare licensePlate: string;
  declare parkingId: string;
  declare violationTime: Date; 
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
    violationTime: {
      type: DataTypes.DATE,
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
