const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Try connecting to the configured MongoDB URI first
    const uri = process.env.MONGODB_URI;
    if (uri && !uri.includes('localhost') && !uri.includes('127.0.0.1')) {
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Connected: ${conn.connection.host}`);
      return;
    }

    // Try localhost MongoDB
    try {
      const conn = await mongoose.connect(uri || 'mongodb://localhost:27017/senaiworks', {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[MongoDB] Connected: ${conn.connection.host}`);
      return;
    } catch {
      console.log('[MongoDB] Local MongoDB not available, starting in-memory server...');
    }

    // Fallback: use mongodb-memory-server for development
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = new MongoMemoryServer();
    await mongod.start();
    const memUri = mongod.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`[MongoDB] In-Memory Server running: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
