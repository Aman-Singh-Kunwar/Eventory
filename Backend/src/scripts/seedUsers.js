const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");
const connectMongo = require("../config/mongo");
const bcrypt = require("bcryptjs");

const seedUsers = async () => {
  try {
    await connectMongo();
    console.log("MongoDB connected");

    // Create regular user if it doesn't exist
    const regularUserExists = await User.findOne({ email: "user@test.com" });
    if (!regularUserExists) {
      const hashedPassword1 = await bcrypt.hash("password123", 12);
      const regularUser = new User({
        name: "Test User",
        email: "user@test.com",
        password: hashedPassword1,
        role: "user"
      });
      await regularUser.save();
      console.log("✓ Regular user created - user@test.com / password123");
    } else {
      console.log("✓ Regular user already exists - user@test.com");
    }

    // Create company user if it doesn't exist
    const companyUserExists = await User.findOne({ email: "company@test.com" });
    if (!companyUserExists) {
      const hashedPassword2 = await bcrypt.hash("password123", 12);
      const companyUser = new User({
        name: "Cinema Admin",
        email: "company@test.com",
        password: hashedPassword2,
        role: "company",
        companyName: "Premium Cinema Chains"
      });
      await companyUser.save();
      console.log("✓ Company user created - company@test.com / password123");
    } else {
      console.log("✓ Company user already exists - company@test.com");
    }

    console.log("\nYou can now login with these credentials:");
    console.log("Regular User: user@test.com / password123");
    console.log("Company User: company@test.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error.message);
    process.exit(1);
  }
};

seedUsers();
