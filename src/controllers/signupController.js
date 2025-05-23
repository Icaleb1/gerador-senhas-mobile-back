import { prisma } from '../prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { cryptoUtils } from '../utils/cryptoUtils.js';
const { encrypt, decrypt } = cryptoUtils;

dotenv.config();

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
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

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }

    console.error('Erro no cadastro:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
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

export const createItem = async (req, res) => {
  const { name, password } = req.body;
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const existingItem = await prisma.item.findFirst({ 
      where: { name, userId: req.user.userId } 
    });

    if (existingItem) {
      return res.status(409).json({ error: 'Item já existe' });
    }

    const encryptedPassword = encrypt(password); 

    const item = await prisma.item.create({
      data: {
        userId: req.user.userId,
        name,
        password: encryptedPassword, 
      },
    });

    return res.status(201).json({ 
      message: 'Item criado com sucesso', 
      itemId: item.id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getItens = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const itens = await prisma.item.findMany({
      where: { userId: req.user.userId },
      select: { id: true, name: true, password: true },
    });

     const itensComSenhaDescriptografada = itens.map(item => {
      return {
        ...item,
        password: decrypt(item.password), 
      };
    });

    return res.status(200).json({
      message: 'Itens listados com sucesso',
      itens: itensComSenhaDescriptografada,
    });
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.user?.userId) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    const existingItem = await prisma.item.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    if (existingItem.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Acesso negado. Este item não pertence a você.' });
    }

    await prisma.item.delete({
      where: { id },
    });

    return res.status(200).json({ message: 'Item deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar item:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
