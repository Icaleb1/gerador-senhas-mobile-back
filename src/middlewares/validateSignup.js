const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateSignup = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'As senhas não coincidem' });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido' });
  }

  next();
};

export const validateItem = (req, res, next) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  next();
};

