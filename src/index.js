import express from 'express';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:8081', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
}));

app.use(express.json());
app.use('/api', authRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});