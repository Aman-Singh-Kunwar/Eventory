const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const User = require("../models/User");
const connectMongo = require("../config/mongo");

const seedMovies = async () => {
  try {
    await connectMongo();
    console.log("MongoDB connected");

    // Find or create a company user
    let company = await User.findOne({ role: "company" });
    
    if (!company) {
      console.log("Creating test company user...");
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash("password123", 12);
      
      company = new User({
        name: "Test Cinema",
        email: "cinema@test.com",
        password: hashedPassword,
        role: "company",
        companyName: "Test Cinema Pvt Ltd"
      });
      
      await company.save();
      console.log("Company user created:", company._id);
    }

    // Check if movies already exist
    const existingMoviesCount = await Movie.countDocuments();
    if (existingMoviesCount > 0) {
      console.log(`${existingMoviesCount} movies already exist in database. Skipping movie seed.`);
      process.exit(0);
    }

    console.log("Adding sample movies...");

    // Sample movies data
    const moviesData = [
      {
        title: "The Quantum Leap",
        description: "A thrilling sci-fi adventure through dimensions and time.",
        genre: ["Sci-Fi", "Action"],
        duration: 148,
        posterUrl: "https://via.placeholder.com/300x450?text=Quantum+Leap",
        backgroundUrl: "https://via.placeholder.com/1920x1080?text=Quantum+Leap",
        trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        language: "English",
        price: 250,
        releaseDate: new Date("2026-02-15"),
        company: company._id
      },
      {
        title: "Midnight Echo",
        description: "A mysterious thriller set in the dark corners of a city.",
        genre: ["Thriller", "Mystery"],
        duration: 132,
        posterUrl: "https://via.placeholder.com/300x450?text=Midnight+Echo",
        backgroundUrl: "https://via.placeholder.com/1920x1080?text=Midnight+Echo",
        trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        language: "English",
        price: 220,
        releaseDate: new Date("2026-02-20"),
        company: company._id
      },
      {
        title: "Love in Paris",
        description: "A romantic journey through the city of love.",
        genre: ["Romance", "Drama"],
        duration: 118,
        posterUrl: "https://via.placeholder.com/300x450?text=Love+in+Paris",
        backgroundUrl: "https://via.placeholder.com/1920x1080?text=Love+in+Paris",
        trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        language: "French",
        price: 200,
        releaseDate: new Date("2026-02-10"),
        company: company._id
      },
      {
        title: "Dragon Warriors",
        description: "An epic fantasy battle with dragons and magic.",
        genre: ["Fantasy", "Action", "Adventure"],
        duration: 162,
        posterUrl: "https://via.placeholder.com/300x450?text=Dragon+Warriors",
        backgroundUrl: "https://via.placeholder.com/1920x1080?text=Dragon+Warriors",
        trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        language: "English",
        price: 300,
        releaseDate: new Date("2026-02-25"),
        company: company._id
      },
      {
        title: "Code Red",
        description: "A high-octane action thriller with espionage and intrigue.",
        genre: ["Action", "Thriller"],
        duration: 125,
        posterUrl: "https://via.placeholder.com/300x450?text=Code+Red",
        backgroundUrl: "https://via.placeholder.com/1920x1080?text=Code+Red",
        trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        language: "English",
        price: 280,
        releaseDate: new Date("2026-02-05"),
        company: company._id
      }
    ];

    const createdMovies = await Movie.insertMany(moviesData);
    console.log(`${createdMovies.length} movies added successfully!`);
    
    console.log("\nMovies added:");
    createdMovies.forEach((movie, index) => {
      console.log(`${index + 1}. ${movie.title} (${movie.price} INR)`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding movies:", error.message);
    process.exit(1);
  }
};

seedMovies();
