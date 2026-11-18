let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join room for a destination for real-time crowd updates
    socket.on('subscribe:destination', (destinationId) => {
      socket.join(`dest_${destinationId}`);
      console.log(`[Socket.io] ${socket.id} subscribed to dest_${destinationId}`);
    });

    socket.on('unsubscribe:destination', (destinationId) => {
      socket.leave(`dest_${destinationId}`);
    });

    // Join user notification room
    socket.on('subscribe:user', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`[Socket.io] ${socket.id} subscribed to user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const broadcastCrowdUpdate = (destinationId, crowdData) => {
  if (ioInstance) {
    ioInstance.to(`dest_${destinationId}`).emit('crowd:update', {
      destinationId,
      ...crowdData,
      timestamp: new Date().toISOString()
    });
    // Also broadcast globally so dashboard & homepage meters update
    ioInstance.emit('crowd:global_update', {
      destinationId,
      ...crowdData,
      timestamp: new Date().toISOString()
    });
  }
};

export const sendUserNotification = (userId, notification) => {
  if (ioInstance) {
    ioInstance.to(`user_${userId}`).emit('notification:new', notification);
    ioInstance.emit('notification:feed', notification); // For admin live feed
  }
};

export const getIO = () => ioInstance;
