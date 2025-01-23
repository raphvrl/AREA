import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
