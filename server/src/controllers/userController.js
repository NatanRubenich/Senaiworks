const User = require('../models/User');
const { CPF_LENGTH, CNPJ_LENGTH, SWIFT_MIN_LENGTH, SWIFT_MAX_LENGTH } = require('../config/constants');

// PUT /api/users/identity
exports.updateIdentity = async (req, res) => {
  try {
    const { legalName, fullAddress, accountType, tradeName, cnpj, legalRepresentative, position } = req.body;

    if (!legalName || !fullAddress || !accountType) {
      return res.status(400).json({ error: 'Nome Legal, Endereço e Tipo de Conta são obrigatórios.' });
    }

    if (accountType === 'Pessoa Jurídica') {
      if (!tradeName || !cnpj || !legalRepresentative || !position) {
        return res.status(400).json({ error: 'Todos os campos de Pessoa Jurídica são obrigatórios.' });
      }
      if (cnpj.replace(/\D/g, '').length !== CNPJ_LENGTH) {
        return res.status(400).json({ error: `CNPJ fictício deve ter ${CNPJ_LENGTH} dígitos.` });
      }
    }

    const user = await User.findById(req.user._id);
    user.identity = { legalName, fullAddress, accountType, tradeName, cnpj, legalRepresentative, position };
    user.identityCompleted = true;
    await user.save();

    res.json({ message: 'Dados de identidade salvos com sucesso.', identity: user.identity });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/users/tax
exports.updateTax = async (req, res) => {
  try {
    const { country, tin } = req.body;

    if (!tin) {
      return res.status(400).json({ error: 'TIN (CPF ou CNPJ) é obrigatório.' });
    }

    const digits = tin.replace(/\D/g, '');
    if (digits.length !== CPF_LENGTH && digits.length !== CNPJ_LENGTH) {
      return res.status(400).json({ error: 'Erro: Formato de CPF/CNPJ inválido.' });
    }

    const user = await User.findById(req.user._id);
    user.taxInfo = { country: country || 'Brasil', tin };
    user.taxCompleted = true;
    await user.save();

    res.json({ message: 'Informações fiscais salvas com sucesso.', taxInfo: user.taxInfo });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// PUT /api/users/bank
exports.updateBank = async (req, res) => {
  try {
    const { bankName, swiftCode, accountNumber } = req.body;

    if (!bankName || !swiftCode || !accountNumber) {
      return res.status(400).json({ error: 'Todos os campos bancários são obrigatórios.' });
    }

    if (swiftCode.length < SWIFT_MIN_LENGTH || swiftCode.length > SWIFT_MAX_LENGTH) {
      return res.status(400).json({ error: `Código SWIFT/IBAN deve ter entre ${SWIFT_MIN_LENGTH} e ${SWIFT_MAX_LENGTH} caracteres.` });
    }

    const user = await User.findById(req.user._id);
    user.bankInfo = { bankName, swiftCode, accountNumber };
    user.bankCompleted = true;
    await user.save();

    res.json({ message: 'Informações bancárias salvas com sucesso.', bankInfo: user.bankInfo });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// POST /api/users/pay-fee
exports.payFee = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.feePaid) {
      return res.status(400).json({ error: 'Taxa já foi paga.' });
    }
    user.feePaid = true;
    await user.save();
    res.json({ message: 'Taxa de publicação paga com sucesso!', feePaid: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
