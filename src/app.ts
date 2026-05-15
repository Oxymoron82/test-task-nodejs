import express, { Request, Response } from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;