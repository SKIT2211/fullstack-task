import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { UnauthorizedError } from "../middlewares/error.middleware.js";

export async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError("User not found.");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }
  const payload = { sub: user.id, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
  return token;
}
