import express from "express";
import { getUserDetails, updateProfile } from "./userController.js";
import { isAuthenticated } from "../../middleware/auth.js";

const router = express.Router();

router.route("/me").get(isAuthenticated, getUserDetails);
router.route("/me/update").put(isAuthenticated, updateProfile);

export default router;
