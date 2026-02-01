const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const User = require("../models/User");
const connectMongo = require("../config/mongo");

const cleanupTestData = async () => {
  try {
    await connectMongo();
    console.log("MongoDB connected");

    // Delete test users
    const deletedUsers = await User.deleteMany({ 
      email: { $in: ["user@test.com", "company@test.com", "cinema@test.com"] } 
    });
    console.log(`✓ Deleted ${deletedUsers.deletedCount} test users`);

    // Delete sample movies (The Quantum Leap, Midnight Echo, Love in Paris, Dragon Warriors, Code Red)
    const deletedMovies = await Movie.deleteMany({
      title: { $in: ["The Quantum Leap", "Midnight Echo", "Love in Paris", "Dragon Warriors", "Code Red"] }
    });
    console.log(`✓ Deleted ${deletedMovies.deletedCount} sample movies`);

    // Show remaining data
    const remainingUsers = await User.countDocuments();
    const remainingMovies = await Movie.countDocuments();
    
    console.log(`\nDatabase Status:`);
    console.log(`- Users remaining: ${remainingUsers}`);
    console.log(`- Movies remaining: ${remainingMovies}`);

    // List remaining users
    const users = await User.find({}, { name: 1, email: 1, role: 1 });
    if (users.length > 0) {
      console.log(`\nRemaining Users:`);
      users.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) [${user.role}]`);
      });
    }

    // List remaining movies
    const movies = await Movie.find({}, { title: 1, price: 1 });
    if (movies.length > 0) {
      console.log(`\nRemaining Movies:`);
      movies.forEach(movie => {
        console.log(`  - ${movie.title} (₹${movie.price})`);
      });
    }

    console.log("\n✓ Cleanup complete! Your old data has been restored.");

    process.exit(0);
  } catch (error) {
    console.error("Error during cleanup:", error.message);
    process.exit(1);
  }
};

cleanupTestData();
