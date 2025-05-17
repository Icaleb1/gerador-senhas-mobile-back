import { prisma } from '../prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: 'E-mail já cadastrado' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return res.status(201).json({ message: 'Usuário criado com sucesso', userId: user.id });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: 'E-mail ou senha inválido' });
  }

  const token = jwt.sign(
    { 
      userId: existingUser.id,
      email: existingUser.email
    },
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } 
  );

  return res.status(200).json({ 
    message: 'Usuário logado com sucesso!',
    userId: existingUser.id,
    token
  });
}