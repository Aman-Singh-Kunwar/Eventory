const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  genre: {
    type: [String],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  posterUrl: {
    type: String,
    required: true
  },
  backgroundUrl: {
    type: String // Optional: for hero section
  },
  rating: {
    type: Number,
    default: 0
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Movie', movieSchema);
