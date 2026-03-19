const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ALLOWED_EMAIL_DOMAINS, PASSWORD_REGEX, SECURITY_QUESTIONS } = require('../config/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return ALLOWED_EMAIL_DOMAINS.some(domain => v.endsWith(domain));
      },
      message: 'E-mail deve pertencer aos domínios @edu.sc.senai.br ou @estudante.sesisenai.org.br',
    },
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [8, 'Senha deve ter no mínimo 8 caracteres'],
  },
  role: {
    type: String,
    enum: ['developer', 'admin'],
    default: 'developer',
  },

  // Security question (RF-A01.5)
  securityQuestion: {
    type: String,
    enum: SECURITY_QUESTIONS,
    required: [true, 'Pergunta de segurança é obrigatória'],
  },
  securityAnswer: {
    type: String,
    required: [true, 'Resposta de segurança é obrigatória'],
  },

  // Developer Identity (RF-A02)
  identity: {
    legalName: { type: String, default: '' },
    fullAddress: { type: String, default: '' },
    accountType: { type: String, enum: ['Pessoa Física', 'Pessoa Jurídica'], default: 'Pessoa Física' },
    // PJ fields (RF-A02.4)
    tradeName: { type: String, default: '' },
    cnpj: { type: String, default: '' },
    legalRepresentative: { type: String, default: '' },
    position: { type: String, default: '' },
  },

  // Tax Info (RF-A03)
  taxInfo: {
    country: { type: String, default: 'Brasil' },
    tin: { type: String, default: '' },
  },

  // Banking Info (RF-A04)
  bankInfo: {
    bankName: { type: String, default: '' },
    swiftCode: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
  },

  // Publication Fee (RF-A05)
  feePaid: { type: Boolean, default: false },

  // Identity/Tax/Bank completion flags
  identityCompleted: { type: Boolean, default: false },
  taxCompleted: { type: Boolean, default: false },
  bankCompleted: { type: Boolean, default: false },

  // Login lockout (RF-A01.9 / RNF02.2)
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
}, {
  timestamps: true,
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

module.exports = mongoose.model('User', userSchema);
