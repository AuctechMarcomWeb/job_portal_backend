import User from "../models/User.modal.js";
import bcrypt from "bcrypt";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

/**
 * CREATE ADMIN (Dev / Initial Setup)
 */
export const createAdmin = asyncHandler(async (req, res) => {
  const { phone, email, password, name } = req.body;

  if (!phone || !password) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Phone and password are required"));
  }

  const existingAdmin = await User.findOne({
    $or: [{ phone }, { email }],
    role: "ADMIN",
  });

  if (existingAdmin) {
    return res
      .status(409)
      .json(new apiResponse(409, null, "Admin already exists"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    phone,
    email,
    password: hashedPassword,
    name,
    role: "ADMIN",
    isPhoneVerified: true,
    isProfileCompleted: true,
  });

  return res.status(201).json(
    new apiResponse(
      201,
      {
        _id: admin._id,
        phone: admin.phone,
        email: admin.email,
        role: admin.role,
      },
      "Admin created successfully"
    )
  );
});