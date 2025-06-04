import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import reservationRoutes from "./routes/reservationRoutes";
import authRoutes from "./routes/authRoutes";
import fineRoutes from "./routes/fineRoutes";
import parkingRoutes from "./routes/ParkingRoutes";
import { errorMiddleware } from './middleware/errorMiddleware';

dotenv.config();

// Crea l'istanza dell'app Express
const app = express();

// Middleware per il parsing dei body JSON
app.use(express.json());

app.use('', authRoutes);
app.use("/api", reservationRoutes);
app.use("/check", fineRoutes);
app.use('/park',parkingRoutes)

app.use(errorMiddleware);

// Imposta la porta da una variabile di ambiente (o default a 3000)
const PORT = process.env.PORT || 3000;


// Avvia il server

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


export default app;
