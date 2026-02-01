const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const app = require("./app");
const connectMongo = require("./config/mongo");
require("./kafka/consumers/payment.consumers");
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io accessible to other files
app.set('io', io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // In-memory store for locks: key = "movieId:seatId", value = { userId, socketId, timestamp }
  // We can also use a simple object or Map.
  // Let's use a global Map for this example or attach it to app.
  if (!global.seatLocks) {
    global.seatLocks = new Map();
  }

  // Join movie-specific room and send initial status
  socket.on('join-movie', (movieId) => {
    socket.join(`movie:${movieId}`);
    console.log(`Socket ${socket.id} joined room: movie:${movieId}`);

    // Send current locks to the joining user
    const currentLocks = [];
    for (const [key, lock] of global.seatLocks.entries()) {
      const [mId, sId] = key.split(':');
      if (mId === movieId) {
        currentLocks.push({
          seatId: sId,
          status: 'locked-temporary',
          userId: lock.userId
        });
      }
    }
    socket.emit('initial-seats-status', currentLocks);
  });

  // Leave movie room
  socket.on('leave-movie', (movieId) => {
    socket.leave(`movie:${movieId}`);
    console.log(`Socket ${socket.id} left room: movie:${movieId}`);
  });

  // Handle seat selection
  socket.on('seat-select', ({ movieId, seatId, userId }) => {
    const key = `${movieId}:${seatId}`;
    
    // Check if already locked
    if (global.seatLocks.has(key)) {
      return; // Already locked
    }

    // Lock it
    global.seatLocks.set(key, { userId, socketId: socket.id, timestamp: Date.now() });

    // Broadcast
    socket.to(`movie:${movieId}`).emit('seat-update', {
      seatId,
      status: 'locked-temporary',
      userId,
      movieId // Added movieId so frontend check passes
    });
    console.log(`Seat ${seatId} locked by ${userId} in movie ${movieId}`);
  });

  // Handle seat deselection
  socket.on('seat-deselect', ({ movieId, seatId, userId }) => {
    const key = `${movieId}:${seatId}`;
    
    // Check ownership
    const lock = global.seatLocks.get(key);
    if (!lock) return;

    // Optional: Only allow the owner to unlock
    // if (lock.userId !== userId) return;

    global.seatLocks.delete(key);

    // Broadcast
    socket.to(`movie:${movieId}`).emit('seat-update', {
      seatId,
      status: 'available',
      userId,
      movieId // Added movieId here too
    });
    console.log(`Seat ${seatId} unlocked by ${userId} in movie ${movieId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Auto-unlock seats held by this socket
    for (const [key, lock] of global.seatLocks.entries()) {
      if (lock.socketId === socket.id) {
        global.seatLocks.delete(key);
        const [movieId, seatId] = key.split(':');
        
        // Broadcast unlock to the specific movie room
        socket.to(`movie:${movieId}`).emit('seat-update', {
            seatId,
            status: 'available',
            userId: lock.userId
        });
        console.log(`Auto-unlocked seat ${seatId} for movie ${movieId} (User disconnect)`);
      }
    }
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectMongo();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.IO server ready`);
    });
  } catch (err) {
    console.error("Startup failed", err);
    process.exit(1);
  }
})();