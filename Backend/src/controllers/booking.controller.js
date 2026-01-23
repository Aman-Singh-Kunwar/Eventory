const redis = require("../config/redis");
const paymentService = require("../services/payment.services");
const Booking = require("../models/Booking");
const Movie = require("../models/Movie");

exports.pay = async (req, res) => {
  const io = req.app.get('io');
  const result = await paymentService.pay(req.params.bookingId, io);
  res.json({ status: result });
};

exports.getBooking = async (req, res) => {
  try {
    let booking = await Booking.findOne({ bookingId: req.params.bookingId });
    if (!booking) {
      const tempBookingStr = await redis.get(`tempBooking:${req.params.bookingId}`);
      if (tempBookingStr) {
        booking = JSON.parse(tempBookingStr);
      }
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      userId: req.userData.userId,
      status: { $ne: 'PENDING' }
    })
      .populate('movieId', 'title posterUrl duration releaseDate')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error: error.message });
  }
};

exports.getCompanyBookings = async (req, res) => {
  try {
    const movies = await Movie.find({ company: req.userData.userId }).select('_id');
    const movieIds = movies.map(m => m._id);

    const bookings = await Booking.find({ movieId: { $in: movieIds } })
      .populate('userId', 'name email')
      .populate('movieId', 'title')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company bookings", error: error.message });
  }
};

exports.getMyRewards = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const bookings = await Booking.find({ 
      userId, 
      status: 'CONFIRMED' 
    }).populate('movieId', 'title');

    const rewards = bookings
      .filter(booking => booking.seatIds.length > 3)
      .map(booking => ({
        id: `reward-${booking.bookingId}`,
        title: "Large Popcorn & Soda Combo",
        description: `Earned from booking ${booking.seatIds.length} tickets for ${booking.movieId?.title || 'a movie'}`,
        code: `REW-${booking.bookingId.slice(0, 8).toUpperCase()}`,
        earnedAt: booking.createdAt,
        status: "AVAILABLE"
      }));

    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rewards", error: error.message });
  }
};