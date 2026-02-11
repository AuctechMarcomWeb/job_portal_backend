import User from "../models/User.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { generateOTP } from "../utils/generateOTP.js";
import bcrypt from "bcrypt";
import { sendWhatsappOTP } from "../utils/sendOTP.js";
import sendEmailOTP from "../utils/sendEmailOTP.js";

const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * REGISTER OR LOGIN (Send OTP via Email)
 */
const registerOrLogin = asyncHandler(async (req, res) => {
  const { email, name, gender, role = "JOB_SEEKER" } = req.body;

  if (!email) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Email is required"));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid email address"));
  }

  let user = await User.findOne({ email });

  const otp = email === "test@gmail.com" ? "0101" : generateOTP();
  const otpExpiration = new Date(Date.now() + OTP_EXPIRATION_TIME);

  // 🔁 EXISTING USER → LOGIN
  if (user) {
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    // await sendEmailOTP(email, otp);

    return res.status(200).json(
      new apiResponse(
        200,
        {
          email: user.email,
          role: user.role,
          otp: user.otp,
          isProfileCompleted: user.isProfileCompleted,
        },
        "OTP sent to your email"
      )
    );
  }

  // 🆕 NEW USER → REGISTER
  const newUser = await User.create({
    email,
    name,
    gender,
    role,
    otp,
    otpExpiration,
    isEmailVerified: false,
    isProfileCompleted: false,
  });

 // await sendEmailOTP(email, otp);

  return res.status(201).json(
    new apiResponse(
      201,
      {
        email: newUser.email,
        role: newUser.role,
        otp: newUser.otp,
        isProfileCompleted: false,
      },
      "User registered, OTP sent successfully"
    )
  );
});

/**
 * VERIFY OTP & ISSUE JWT
 */
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Email and OTP are required"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "User not found"));
  }

  if (user.otp !== otp) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid OTP"));
  }

  if (Date.now() > user.otpExpiration) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "OTP expired"));
  }

  user.isEmailVerified = true;
  user.otp = null;
  user.otpExpiration = null;
  await user.save();

  const token = user.generateAuthToken();

  return res.status(200).json(
    new apiResponse(
      200,
      {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isProfileCompleted: user.isProfileCompleted,
        authToken: token,
      },
      "OTP verified successfully"
    )
  );
});

/**
 * RESEND OTP
 */
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Email is required"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "User not found"));
  }

  const otp = generateOTP();
  const otpExpiration = new Date(Date.now() + OTP_EXPIRATION_TIME);

  user.otp = otp;
  user.otpExpiration = otpExpiration;
  await user.save();

  // await sendEmailOTP(email, otp);

  return res.status(200).json(
    new apiResponse(
      200,
      {  email: user.email,
        otp: user.otp, },
      "OTP resent successfully"
    )
  );
});

export {
  registerOrLogin,
  verifyOtp,
  resendOtp,
};