import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes';
import connectDB from './db/db';
const app = express();
dotenv.config();

const PORT = process.env.BACKEND_PORT;
const FRONTEND_PORT = process.env.FRONTEND_PORT;
connectDB();

app.use(express.json());

app.use(cors( {
    origin: `http://localhost:${FRONTEND_PORT}`,
    credentials: true
}));

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
