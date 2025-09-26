import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected for seeding"))
  .catch((err) => {
    console.error("DB Connection Failed:", err);
    process.exit(1);
  });

const seedUsers = async () => {
  try {
    await User.deleteMany();

    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        phone: "1234567890",
        role: "admin",
        password: await bcrypt.hash("admin123", 10),
      },
      {
        name: "Regular User",
        email: "user@example.com",
        phone: "0987654321",
        role: "user",
        password: await bcrypt.hash("user123", 10),
      },
    ];

    await User.insertMany(users);

    console.log("Users seeded successfully");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedUsers();
