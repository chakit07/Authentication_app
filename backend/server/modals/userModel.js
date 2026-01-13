import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose from "mongoose";

// User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        minLength: [8, "Password must be at least 8 characters long"],
        required: true,
        trim: true,
        select: false,
        validate: {
            validator: function(value) {
                // Check for at least one special character
                const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
                return specialCharRegex.test(value);
            },
            message: "Password must contain at least one special character"
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        public_id: String,
        url: String
    },
    accountVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: Number,
    verificationCodeExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Hash password before saving
userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Generate verification code
userSchema.methods.generateVerificationCode = function () {
    function generateRandomSixDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(5, "0");
        return Number(firstDigit + remainingDigits);
    }
    const verificationCode = generateRandomSixDigitNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    return verificationCode;
}

// Generate reset password token
userSchema.methods.generateResetPasswordToken = function () {
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpiry = Date.now() + 3600000; // 1 hour
    return resetPasswordToken;
}

export const User = mongoose.model("User", userSchema);