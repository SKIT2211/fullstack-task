import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import {
  BadRequestError,
  NotFoundError,
} from "../middlewares/error.middleware.js";

export async function createUser(data) {
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new BadRequestError("Email already used");
  }
  const user = new User(data);

  await user.save();

  const obj = user.toObject();
  delete obj.password;
  return obj;
}

export async function getUsers({ page = 1, limit = 10, filters = {} }) {
  page = parseInt(page);
  limit = parseInt(limit);
  const query = {};
  if (filters.name) {
    query.name = { $regex: filters.name.trim(), $options: "i" };
  }
  if (filters.email) {
    query.email = { $regex: filters.email.trim(), $options: "i" };
  }
  if (filters.role) {
    query.role = filters.role;
  }
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .select("-password");
  return {
    meta: { page, limit, total },
    data: users,
  };
}

export async function getUserById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError("Invalid user id");
  }
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

export async function updateUser(id, data) {
  if (data.email) {
    const exist = await User.findOne({ email: data.email, _id: { $ne: id } });
    if (exist) {
      throw new BadRequestError("Email already in use");
    }
  }
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  Object.assign(user, data);
  await user.save();
  const obj = user.toObject();
  delete obj.password;
  return obj;
}

export async function deleteUser(id) {
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  await user.deleteOne();
}
