const express = require("express");
const cors = require("cors");

const seatRoutes = require("./routes/seat.routes");
const bookingRoutes = require("./routes/booking.routes");
const authRoutes = require("./routes/auth.routes");
const movieRoutes = require("./routes/movie.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/seats", seatRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", require("./routes/user.routes"));

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;
