import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI not defined in environment");
  }
  await mongoose.connect(uri);
  console.log("Connected to MongoDB");
}
