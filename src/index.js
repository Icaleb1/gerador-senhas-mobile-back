import express from 'express';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', authRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
