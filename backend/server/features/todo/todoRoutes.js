import express from "express";
import { createTodo, deleteTodo, getMyTodos, updateTodo } from "./todoController.js";
import { isAuthenticated } from "../../middleware/auth.js";

const router = express.Router();

router.route("/new").post(isAuthenticated, createTodo);
router.route("/me").get(isAuthenticated, getMyTodos);
router.route("/:id").put(isAuthenticated, updateTodo).delete(isAuthenticated, deleteTodo);

export default router;
