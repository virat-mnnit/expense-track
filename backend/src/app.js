import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import expensesRoutes from './routes/expenses.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://expense-track.vercel.app'
  ],
}));

app.use(express.json());

app.use('/expenses', expensesRoutes);
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running');
});


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorHandler);

export default app;
