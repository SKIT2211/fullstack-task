import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getProfilePic,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
  queryUserSchema,
} from "../validations/user.validation.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/",
  upload.single("profilePic"),
  validate(createUserSchema),
  createUser
);

router.use(authMiddleware);

router.get("/", validate(queryUserSchema, "query"), getUsers);
router.get("/:id", getUserById);
router.put(
  "/:id",
  upload.single("profilePic"),
  validate(updateUserSchema),
  updateUser
);
router.delete("/:id", deleteUser);

router.get("/:id/profile-pic", getProfilePic);

export default router;
