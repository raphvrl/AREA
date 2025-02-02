import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes';
import connectDB from './db/db';
import { executeAreas } from './tasks/asyncTasks';

const app = express();
dotenv.config();

const PORT = process.env.BACKEND_PORT;
const FRONTEND_PORT = process.env.FRONTEND_PORT;

// Ne pas se connecter à MongoDB en mode test
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(express.json());
console.log(FRONTEND_PORT);

app.use(
  cors({
    origin: `http://localhost:${FRONTEND_PORT}`,
    credentials: true,
  })
);

app.use('/api', routes);

setInterval(() => {
  executeAreas();
}, 10000);

// Démarrer le serveur uniquement si ce fichier est exécuté directement
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Exporter l'application Express pour les tests
export default app;
