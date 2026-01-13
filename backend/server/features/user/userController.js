import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { User } from "../../modals/userModel.js";
import { ErrorHandler } from "../../middleware/error.js";

// Get User Details
export const getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

// Update User Profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
    const { name, email, phoneNumber } = req.body;

    const newUserStats = {
        name,
        email,
        phoneNumber
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserStats, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});
