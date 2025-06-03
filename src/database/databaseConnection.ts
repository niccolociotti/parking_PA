import { Sequelize, Dialect} from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

class DatabaseConnection {
    private static instance: Sequelize;

    private constructor() {}

    public static getInstance(): Sequelize {
        if (!DatabaseConnection.instance) {

            const dialect = (process.env.DB_DIALECT || 'postgres') as Dialect;
            DatabaseConnection.instance = new Sequelize({
                dialect,
                host: process.env.DB_HOST || 'db',
                port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_NAME || 'parkingdb',
                logging: false, 
            });
        }
        return DatabaseConnection.instance;
    }
}

export default DatabaseConnection;
