import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { ErrorHandler } from "../../middleware/error.js";
import { Todo } from "../../modals/todoModel.js";

// Create new todo
export const createTodo = catchAsyncError(async (req, res, next) => {
    const { title, description, priority, dueDate } = req.body;

    const todo = await Todo.create({
        title,
        description,
        priority,
        dueDate,
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        todo
    });
});

// Get all todos for logged in user
export const getMyTodos = catchAsyncError(async (req, res, next) => {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        todos
    });
});

// Update todo
export const updateTodo = catchAsyncError(async (req, res, next) => {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
        return next(new ErrorHandler("Todo not found", 404));
    }

    // Check if user is owner
    if (todo.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("Not authorized", 401));
    }

    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        todo
    });
});

// Delete todo
export const deleteTodo = catchAsyncError(async (req, res, next) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        return next(new ErrorHandler("Todo not found", 404));
    }

    if (todo.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("Not authorized", 401));
    }

    await todo.deleteOne();

    res.status(200).json({
        success: true,
        message: "Todo deleted successfully"
    });
});
