import * as userService from "../services/user.service.js";

export async function createUser(req, res, next) {
  try {
    const data = req.body;
    if (req.file) {
      data.profilePicPath = `/uploads/${req.file.filename}`;
    }
    const user = await userService.createUser(data);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const { page, limit, ...filters } = req.query;
    const result = await userService.getUsers({ page, limit, filters });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    if (req.file) {
      data.profilePicPath = `/uploads/${req.file.filename}`;
    }
    const updated = await userService.updateUser(id, data);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getProfilePic(req, res, next) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user.profilePicPath) {
      return res.status(404).json({ message: "No profile picture" });
    }
    res.sendFile(user.profilePicPath, { root: "." });
  } catch (err) {
    next(err);
  }
}
