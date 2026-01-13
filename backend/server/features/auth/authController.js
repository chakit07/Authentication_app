import { ErrorHandler } from "../../middleware/error.js";
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { User } from "../../modals/userModel.js";
import twilio from "twilio";
import { sendEmail } from "../../utils/sendEmail.js";
import { sendToken } from "../../utils/sendToken.js";


// Removed top-level twilioClient initialization to ensure process.env is loaded before use

// Register new user
export const registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, phoneNumber, verificationMethod } = req.body;

    if (!name || !email || !password || !phoneNumber || !verificationMethod) {
        return next(new ErrorHandler("Please provide all the fields", 400));
    }

    function validatePhoneNumber(phoneNumber) {
        const PhoneRegex = /^\+91\d{10}$/;
        return PhoneRegex.test(phoneNumber);
    }

    if (!validatePhoneNumber(phoneNumber)) {
        return next(new ErrorHandler("Invalid phone number", 400));
    }

    const existingUser = await User.findOne({
        $or: [
            { email, accountVerified: true },
            { phoneNumber, accountVerified: true }
        ]
    });

    if (existingUser) {
        return next(new ErrorHandler("Phone or Email is already registered", 400));
    }

    // Check for existing unverified user to reuse or block if too many attempts
    let user = await User.findOne({
        $or: [
            { email, accountVerified: false },
            { phoneNumber, accountVerified: false }
        ]
    });

    if (user) {
        // If unverified user exists, update their details and code
        user.name = name;
        user.email = email;
        user.password = password;
        user.phoneNumber = phoneNumber;
    } else {
        // Create new unverified user
        user = new User({
            name,
            email,
            password,
            phoneNumber,
        });
    }

    // Generate and save verification code
    const verificationCode = user.generateVerificationCode();
    await user.save();

    console.log(`User ${name} registered/updated. Code: ${verificationCode}`);

    await sendVerificationCode(verificationMethod, verificationCode, name, email, phoneNumber, res);
});

async function sendVerificationCode(verificationMethod, verificationCode, name, email, phoneNumber, res) {
    try {
        // Initialize Twilio client here to ensure environment variables are loaded
        const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        if (verificationMethod === "email") {
            const message = generateEmailTemplate(verificationCode);
            console.log(`Attempting to send email to ${email}`);
            await sendEmail(email, "Verification Code", message);
            return res.status(201).json({ success: true, message: `Verification code sent successfully ${name}` });
        } else if (verificationMethod === "sms") {
            console.log(`Attempting to send SMS to ${phoneNumber} using ${process.env.TWILIO_PHONE_NUMBER}`);
            await twilioClient.messages.create({
                body: `Your verification code is ${verificationCode}. Valid for 5 mins.`,
                to: phoneNumber,
                from: process.env.TWILIO_PHONE_NUMBER,
            });
            return res.status(201).json({ success: true, message: `OTP sent successfully` });
        } else if (verificationMethod === "phone") {
            console.log(`Attempting to make a call to ${phoneNumber} using ${process.env.TWILIO_PHONE_NUMBER}`);
            const vCode = verificationCode.toString().split("").join(" ");
            await twilioClient.calls.create({
                twiml: `<Response><Say>Your verification code is ${vCode}. I repeat ${vCode}. Valid for 5 mins.</Say></Response>`,
                to: phoneNumber,
                from: process.env.TWILIO_PHONE_NUMBER,
            });
            return res.status(201).json({ success: true, message: `Verification code sent successfully` });
        } else {
            return res.status(400).json({ success: false, message: "Invalid verification method" });
        }
    } catch (error) {
        console.error("Delivery Error Details:", {
            message: error.message,
            code: error.code,
            status: error.status
        });
        return res.status(500).json({ success: false, message: `Failed to send verification code: ${error.message}` });
    }
}

function generateEmailTemplate(verificationCode) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f6f8;
        font-family: Arial, Helvetica, sans-serif;
      }
      .container {
        max-width: 500px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      .header {
        background: #4f46e5;
        color: #ffffff;
        text-align: center;
        padding: 20px;
        font-size: 22px;
        font-weight: bold;
      }
      .content {
        padding: 30px;
        color: #333333;
        text-align: center;
      }
      .otp {
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #4f46e5;
        margin: 20px 0;
      }
      .note {
        font-size: 14px;
        color: #666666;
      }
      .footer {
        background: #f4f6f8;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #888888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Verify Your Email</div>

      <div class="content">
        <p>Hello 👋</p>
        <p>Your verification code is:</p>

        <div class="otp">${verificationCode}</div>

        <p class="note">
          This code is valid for <strong>5 minutes</strong>.<br />
          Do not share this code with anyone.
        </p>
      </div>

      <div class="footer">
        © 2026 Expense Tracker. All rights reserved.
      </div>
    </div>
  </body>
  </html>`;
}

// Verify OTP
export const verifyOTP = catchAsyncError(async (req, res, next) => {
    const { otp, email, phoneNumber } = req.body;

    console.log("OTP Verification Request:", { otp, email, phoneNumber });

    if (!otp || (!email && !phoneNumber)) {
        return next(new ErrorHandler("Please provide OTP and Email/Phone", 400));
    }

    // Convert OTP to number to match database type
    const otpNumber = Number(otp);

    console.log("OTP Converted to Number:", otpNumber);

    if (isNaN(otpNumber)) {
        return next(new ErrorHandler("Invalid OTP format", 400));
    }

    const searchCriteria = {
        $or: [
            { email, accountVerified: false },
            { phoneNumber, accountVerified: false }
        ],
        verificationCode: otpNumber,
        verificationCodeExpiry: { $gt: Date.now() }
    };

    console.log("Searching for user with criteria:", JSON.stringify(searchCriteria, null, 2));

    const user = await User.findOne(searchCriteria);

    console.log("User found:", user ? `Yes - ${user.email}` : "No");

    if (!user) {
        // Additional debugging - check if user exists without OTP match
        const userWithoutOTP = await User.findOne({
            $or: [
                { email, accountVerified: false },
                { phoneNumber, accountVerified: false }
            ]
        });

        if (userWithoutOTP) {
            console.log("User exists but OTP mismatch. Stored code:", userWithoutOTP.verificationCode, "Expiry:", userWithoutOTP.verificationCodeExpiry);
        }

        return next(new ErrorHandler("Invalid or expired OTP", 400));
    }

    user.accountVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    console.log("User verified successfully:", user.email);

    sendToken(user, 201, res, "Account verified successfully");
});

// Login User
export const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    if (!user.accountVerified) {
        return next(new ErrorHandler("Account not verified", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res, "Logged in successfully");
});

// Logout User
export const logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});
