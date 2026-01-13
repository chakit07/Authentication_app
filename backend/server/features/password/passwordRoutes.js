import express from "express";
import { forgotPassword, resetPassword, updatePassword } from "./passwordController.js";
import { isAuthenticated } from "../../middleware/auth.js";

const router = express.Router();

router.post("/forgot", forgotPassword);
router.put("/reset/:token", resetPassword);
router.put("/update", isAuthenticated, updatePassword);

export default router;
