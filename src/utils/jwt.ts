import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Percorsi delle chiavi
//const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH || path.join(__dirname, '../../jwtRS256.key');

//const PUBLIC_KEY_PATH = process.env.PUBLIC_KEY_PATH || path.join(__dirname, '../../jwtRS256.key.pub');

const PRIVATE_KEY_PATH = path.join(__dirname, '../../jwtRS256.key');
const PUBLIC_KEY_PATH =  path.join(__dirname, '../../jwtRS256.key.pub');

// Caricamento chiavi
export const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
export const publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');