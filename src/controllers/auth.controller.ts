import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import User from "../models/user.model";
import generateToken from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, birthDate, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      birthDate,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "User is blocked",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      token: generateToken(user._id.toString()),
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};