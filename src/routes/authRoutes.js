import express from 'express';
import { createItem, deleteItem, getItens, login, signup } from '../controllers/signupController.js'; 
import { validateItem, validateLogin, validateSignup } from '../middlewares/validateSignup.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';


const router = express.Router();

router.post('/signup', validateSignup, signup); 

router.post('/login', validateLogin, login);

router.post('/item', authenticateToken, validateItem, createItem);

router.get('/itens', authenticateToken, getItens);

router.delete('/item/delete/:id', authenticateToken, deleteItem);

export default router;
