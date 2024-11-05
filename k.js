const io = require('socket.io')(8000, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
  
    socket.on('trackDevice', (deviceId) => {
      console.log('Device registered:', deviceId);
      // Send registration status back to the client
      socket.emit('registrationStatus', 'Registered');
    });
  
    // Simulate assigning a user after 3 seconds
    setTimeout(() => {
      socket.emit('userAssigned', { userId: 'U123', device: 'T1' });
    }, 3000);
  });
  