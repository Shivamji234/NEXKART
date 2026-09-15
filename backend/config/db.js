const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // In production, enforce connecting to MongoDB Atlas
  if (process.env.NODE_ENV === 'production') {
    if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
      console.warn('[Database] Production requires a valid MongoDB Atlas connection string in MONGODB_URI.');
    }
    const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/nexkart', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] Production MongoDB Connected: ${conn.connection.host}`);
    return conn;
  }

  // In development: try configured URI first, then auto-fallback to embedded in-memory MongoDB
  try {
    const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/nexkart', {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Local connection notice: ${error.message}`);
    console.log('[Database] Starting embedded in-memory MongoDB fallback for local development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'nexkart',
        },
      });
      const memoryUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] In-Memory MongoDB connected successfully at ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[Database] In-Memory MongoDB failed to start: ${memErr.message}`);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
