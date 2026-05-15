import express from "express";

import { protect } from "../middleware/auth.middleware";
import {
  getUserById,
  getUsers,
  blockUser,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/", protect, getUsers);
router.get("/:id", protect, getUserById);
router.patch("/:id/block", protect, blockUser);

export default router;