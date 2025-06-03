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
      unique: true,
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

