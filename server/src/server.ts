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
connectDB();

app.use(express.json());
console.log(FRONTEND_PORT);
app.use(cors( {
    origin: `http://localhost:${FRONTEND_PORT}`,
    credentials: true
}));

app.use('/api', routes);

setInterval(() => {
    executeAreas();
}, 10000);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
