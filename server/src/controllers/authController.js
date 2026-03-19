const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  ALLOWED_EMAIL_DOMAINS,
  PASSWORD_REGEX,
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_DURATION_MS,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  SECURITY_QUESTIONS,
} = require('../config/constants');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '4h' }
  );
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password, securityQuestion, securityAnswer } = req.body;

    if (!email || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const domainValid = ALLOWED_EMAIL_DOMAINS.some(d => email.toLowerCase().endsWith(d));
    if (!domainValid) {
      return res.status(400).json({ error: 'E-mail deve pertencer aos domínios @edu.sc.senai.br ou @estudante.sesisenai.org.br.' });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        error: 'Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.',
      });
    }

    if (!SECURITY_QUESTIONS.includes(securityQuestion)) {
      return res.status(400).json({ error: 'Pergunta de segurança inválida.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'E-mail já cadastrado.' });
    }

    const user = new User({
      email: email.toLowerCase(),
      password,
      securityQuestion,
      securityAnswer: securityAnswer.toLowerCase().trim(),
      role: 'developer',
    });

    await user.save();

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        feePaid: user.feePaid,
        identityCompleted: user.identityCompleted,
        taxCompleted: user.taxCompleted,
        bankCompleted: user.bankCompleted,
      },
    });
  } catch (error) {
    console.error('[Register Error]', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Check lockout
    if (user.isLocked()) {
      const remaining = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        error: `Conta bloqueada temporariamente. Tente novamente em ${remaining} minutos.`,
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
        user.loginAttempts = 0;
      }
      await user.save();
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Reset attempts on success
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        feePaid: user.feePaid,
        identityCompleted: user.identityCompleted,
        taxCompleted: user.taxCompleted,
        bankCompleted: user.bankCompleted,
      },
    });
  } catch (error) {
    console.error('[Login Error]', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -securityAnswer');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'E-mail não encontrado.' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Conta de administrador não pode ser alterada.' });
    }

    res.json({ securityQuestion: user.securityQuestion });

    if (securityAnswer && newPassword) {
      if (user.securityAnswer !== securityAnswer.toLowerCase().trim()) {
        return res.status(400).json({ error: 'Resposta de segurança incorreta.' });
      }
      if (!PASSWORD_REGEX.test(newPassword)) {
        return res.status(400).json({
          error: 'Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.',
        });
      }
      user.password = newPassword;
      await user.save();
      return res.json({ message: 'Senha redefinida com sucesso.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// POST /api/auth/verify-security
exports.verifySecurity = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'E-mail não encontrado.' });
    }

    if (user.securityAnswer !== securityAnswer.toLowerCase().trim()) {
      return res.status(400).json({ error: 'Resposta de segurança incorreta.' });
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({
        error: 'Senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.',
      });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// GET /api/auth/security-question
exports.getSecurityQuestion = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: 'E-mail não encontrado.' });
    }
    res.json({ securityQuestion: user.securityQuestion });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
