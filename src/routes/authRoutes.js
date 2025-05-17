import express from 'express';
import { login, signup } from '../controllers/signupController.js'; 
import { validateLogin, validateSignup } from '../middlewares/validateSignup.js';


const router = express.Router();

router.post('/signup', validateSignup, signup); 

router.post('/login', validateLogin, login);

export default router;
