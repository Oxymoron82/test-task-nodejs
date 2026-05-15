import { Response } from "express";

import User from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = req.user;
    const { id } = req.params;

    if (!currentUser) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (currentUser.role !== "admin" && currentUser._id.toString() !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = req.user;

    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const blockUser = async (req: AuthRequest, res: Response) => {
  try {
    const currentUser = req.user;
    const { id } = req.params;

    if (!currentUser) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (currentUser.role !== "admin" && currentUser._id.toString() !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};