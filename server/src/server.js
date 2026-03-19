require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const { ADMIN_EMAIL, ADMIN_PASSWORD, SECURITY_QUESTIONS } = require('./config/constants');
const User = require('./models/User');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Seed admin account (RF-A01.7)
const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (!existing) {
      const admin = new User({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: 'admin',
        securityQuestion: SECURITY_QUESTIONS[0],
        securityAnswer: 'admin',
        identityCompleted: true,
        taxCompleted: true,
        bankCompleted: true,
        feePaid: true,
      });
      await admin.save();
      console.log('[Seed] Admin account created.');
    }
  } catch (error) {
    console.error('[Seed Error]', error.message);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`[Server] Running on port ${PORT}`);
  await seedAdmin();
});
