const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const gameRoutes = require('./routes/gameRoutes');
const socketHandler = require('./websocket/socketHandler');
const path = require('path');

dotenv.config();
const app = express();
const server = http.createServer(app);

// WebSocket setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

//Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', gameRoutes);

// WebSocket handler (multiplier, crash, cashout)
socketHandler(io);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
