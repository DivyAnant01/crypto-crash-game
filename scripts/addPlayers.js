const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Player = require('../models/Player');

dotenv.config();

const players = [
  {
    username: 'john_doe',
    wallet: { BTC: 0.005, ETH: 0.1 }
  },
  {
    username: 'alice123',
    wallet: { BTC: 0.003, ETH: 0.05 }
  },
  {
    username: 'crypto_king',
    wallet: { BTC: 0.01, ETH: 0.2 }
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  }
};

const insertPlayers = async () => {
  await connectDB();
  try {
    await Player.deleteMany(); // Clean previous data
    await Player.insertMany(players);
    console.log('Players added successfully!');
  } catch (err) {
    console.error('Error inserting players:', err);
  } finally {
    mongoose.connection.close();
  }
};

insertPlayers();
