// controllers/seat.controller.js
const redis = require("../config/redis");
const Booking = require("../models/Booking");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");

const lua = fs.readFileSync(
  path.join(__dirname, "../redis/seatLock.lua"),
  "utf8",
);

exports.reserveSeats = async (req, res) => {
  const { seatIds, movieId, price } = req.body;
  const userId = req.userData.userId;

  if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({ message: "No seats selected" });
  }

  const bookingId = uuid();
  const lockedSeats = [];

  try {
    // Get Socket.IO instance
    const io = req.app.get('io');

    for (const seatId of seatIds) {
      // Lock for 60 seconds (60000 ms)
      const locked = await redis.eval(lua, 1, `seat:${seatId}`, bookingId, 60000);
      if (!locked) {
        // Rollback already acquired locks
        for (const id of lockedSeats) {
          await redis.del(`seat:${id}`);
          
          // Emit unlock event
          io.to(`movie:${movieId}`).emit('seat-unlocked', {
            seatId: id,
            movieId
          });
        }
        return res.status(409).json({ message: `Seat ${seatId} already booked` });
      }
      lockedSeats.push(seatId);

      // Emit real-time seat lock event to all users in this movie room
      io.to(`movie:${movieId}`).emit('seat-locked', {
        seatId,
        bookingId,
        userId,
        movieId,
        status: 'SELECTED'
      });
    }

    // Store temporary booking in Redis for 60 seconds
    const tempBookingData = {
      bookingId,
      seatIds,
      userId,
      movieId,
      amount: price * seatIds.length,
      status: "PENDING",
      createdAt: Date.now(),
    };

    await redis.set(
      `tempBooking:${bookingId}`,
      JSON.stringify(tempBookingData),
      "EX",
      60
    );

    // Set auto-unlock timer (60 seconds)
    setTimeout(async () => {
      try {
        // Check if booking is still pending
        const bookingStatus = await redis.get(`tempBooking:${bookingId}`);
        if (bookingStatus) {
          // Booking not paid, unlock seats
          for (const seatId of seatIds) {
            await redis.del(`seat:${seatId}`);
            
            // Emit unlock event
            io.to(`movie:${movieId}`).emit('seat-unlocked', {
              seatId,
              movieId,
              reason: 'timeout'
            });
          }
          
          // Delete temp booking
          await redis.del(`tempBooking:${bookingId}`);
          
          console.log(`Auto-unlocked seats for booking: ${bookingId}`);
        }
      } catch (error) {
        console.error('Auto-unlock error:', error);
      }
    }, 60000);

    res.json({ bookingId });
  } catch (error) {
    const io = req.app.get('io');
    
    for (const id of lockedSeats) {
      await redis.del(`seat:${id}`);
      
      // Emit unlock event
      io.to(`movie:${movieId}`).emit('seat-unlocked', {
        seatId: id,
        movieId
      });
    }
    res.status(500).json({ message: "Reservation failed", error: error.message });
  }
};