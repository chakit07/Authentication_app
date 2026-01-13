import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/dbconnect.js";
import { errorMiddleware } from "./middleware/error.js";
import authRoutes from "./features/auth/authRoutes.js";
import userFeaturesRoutes from "./features/user/userRoutes.js";
import passwordRoutes from "./features/password/passwordRoutes.js";
import todoRoutes from "./features/todo/todoRoutes.js";

export const app = express();

// Middleware
app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Feature Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userFeaturesRoutes);
app.use("/api/v1/password", passwordRoutes);
app.use("/api/v1/todo", todoRoutes);

// Connect to MongoDB
connectDB();


// Error handler middleware
app.use(errorMiddleware);