const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tournament_manager';
    
    // Attempt standard connection
    try {
      await mongoose.connect(connUri, { serverSelectionTimeoutMS: 2000 });
      console.log(`MongoDB Connected successfully to: ${mongoose.connection.host}`);
      return;
    } catch (primaryErr) {
      console.log('Local MongoDB not detected on port 27017. Starting embedded Mongo Memory Server fallback...');
    }

    // Fallback to in-memory MongoDB server for seamless zero-setup execution
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`Connected to Embedded MongoDB Memory Server at: ${memoryUri}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
