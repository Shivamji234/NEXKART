const mongoose = require('mongoose');

let mongodInstance = null;

const DEFAULT_ATLAS_URI = 'mongodb+srv://shivamji3444_db_user:nexkart_newb_kaja@nexkart.thi8ozt.mongodb.net/NEXKART?retryWrites=true&w=majority&appName=NEXKART';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || DEFAULT_ATLAS_URI;

  // In production, enforce connecting to MongoDB Atlas
  if (process.env.NODE_ENV === 'production') {
    const targetUri = (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) ? DEFAULT_ATLAS_URI : uri;
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 15000,
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
