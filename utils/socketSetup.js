// socket.js
const socketIo = require('socket.io');

let io;

const initializeSocket = server => {
  const io = socketIo(server, {
    cors: {
      origin: "*", // Allow all origins (bypass CORS)
      methods: ["GET", "POST"], // Allow specific methods
      allowedHeaders: ["Content-Type"], // Allow specific headers
      credentials: true // Enable credentials (cookies, sessions)
    }
  });

  io.on('connection', socket => {
    console.log('A user connected');

    // Example of emitting a message to all connected clients on connection
    io.emit('T1', 'UserData');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

// Function to emit messages to a specific channel
const emitMessage = (channel, message) => {
//   console.log(`Emitting message to channel ${channel}:`, message);
  if (io) {
    io.emit(channel, message);
  }
};

module.exports = {initializeSocket, emitMessage};