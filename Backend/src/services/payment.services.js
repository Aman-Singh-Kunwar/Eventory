const redis = require("../config/redis");
const Booking = require("../models/Booking");
const { isIdempotent, markIdempotent } = require("../utils/idempotency");
const kafkaProducer = require("../kafka/producer");
const Movie = require("../models/Movie");

exports.pay = async (bookingId, io) => {
  const key = `payment:${bookingId}`;

  // 1. Idempotency Check
  if (await isIdempotent(key)) return "ALREADY_PAID";

  let booking = await Booking.findOne({ bookingId });
  let isTemp = false;

  if (!booking) {
    // Check Redis for temporary booking
    const tempBookingStr = await redis.get(`tempBooking:${bookingId}`);
    if (tempBookingStr) {
      booking = JSON.parse(tempBookingStr);
      isTemp = true;
    } else {
      return "PAYMENT_EXPIRED";
    }
  }

  if (booking.status === "CONFIRMED") return "ALREADY_PAID";
  if (booking.status === "FAILED") return "BOOKING_FAILED";

  // 1.5 Validate Locks
  if (booking.seatIds && booking.seatIds.length > 0) {
    for (const seatId of booking.seatIds) {
      const lockValue = await redis.get(`seat:${seatId}`);
      if (lockValue !== bookingId) {
        if (!isTemp) {
          await Booking.updateOne({ bookingId }, { status: "TIMEOUT" });
        }
        return "PAYMENT_EXPIRED";
      }
    }
  }

  try {
    console.log(`Processing payment for booking: ${bookingId}`);
    await new Promise((r) => setTimeout(r, 300));

    await markIdempotent(key, "true");
    
    if (isTemp) {
      await Booking.create({
        ...booking,
        status: "CONFIRMED"
      });
      await redis.del(`tempBooking:${bookingId}`);
    } else {
      await Booking.updateOne({ bookingId }, { status: "CONFIRMED" });
    }

    // NEW: Persist booked seats to Movie and clear Redis locks
    if (booking.movieId && booking.seatIds && booking.seatIds.length > 0) {
      await Movie.updateOne(
        { _id: booking.movieId },
        { $push: { bookedSeats: { $each: booking.seatIds } } }
      );

      for (const seatId of booking.seatIds) {
        await redis.del(`seat:${seatId}`);
      }
    }

    // Emit real-time payment success to all users
    if (io && booking.movieId) {
      booking.seatIds.forEach(seatId => {
        io.to(`movie:${booking.movieId}`).emit('seat-confirmed', {
          seatId,
          bookingId,
          movieId: booking.movieId,
          status: 'SOLD'
        });
      });
    }

    await kafkaProducer.publish("BOOKING_CREATED", {
      bookingId,
      seatIds: booking.seatIds,
    });

    return "SUCCESS";
  } catch (err) {
    console.error("Payment failed:", err);

    if (!isTemp) {
      await Booking.updateOne({ bookingId }, { status: "FAILED" });
    }
    
    if (booking.seatIds && io && booking.movieId) {
      for (const seatId of booking.seatIds) {
        await redis.del(`seat:${seatId}`);
        
        io.to(`movie:${booking.movieId}`).emit('seat-unlocked', {
          seatId,
          movieId: booking.movieId,
          reason: 'payment-failed'
        });
      }
    }

    return "PAYMENT_FAILED";
  }
};