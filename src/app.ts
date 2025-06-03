import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
//import UserRoutes from "./routes/UserRoutes";
import authRoutes from "./routes/authRoutes";
import errorHandler from './helpers/errorHandler';
import { syncModels } from './database/sync';
import { User } from './models/User';
import { start } from 'repl';

dotenv.config();

// Crea l'istanza dell'app Express
const app = express();

// Middleware per il parsing dei body JSON
app.use(express.json());

//app.use("/api", UserRoutes);


app.use('/auth', authRoutes);


// Rotta di test per verificare che il server stia funzionando
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Imposta la porta da una variabile di ambiente (o default a 3000)
const PORT = process.env.PORT || 3000;

app.use(errorHandler);

/*
async function startServer() {
  try {
    await syncModels();

    // Creo un utente di test (solo se vuoi, attenzione a duplicati)
    const newUser = await User.create({
      name: 'Mario Rossi',
      role: 'admin',
      email: 'mario.rossi@example.com'
    });
    console.log('Utente creato:', newUser.toJSON());

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to sync database or start server:', error);
    process.exit(1);
  }
}

startServer();

*/

// Avvia il server

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


export default app;
