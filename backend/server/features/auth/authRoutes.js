import express from "express";
import { registerUser, verifyOTP, loginUser, logoutUser } from "./authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

export default router;
