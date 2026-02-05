import User from "../models/User.modal.js";
import bcrypt from "bcrypt";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

/**
 * ADMIN LOGIN
 */
export const adminLogin = asyncHandler(async (req, res) => {
  const { phone, email, password } = req.body;

  if ((!phone && !email) || !password) {
    return res
      .status(400)
      .json(
        new apiResponse(
          400,
          null,
          "Phone or email and password are required"
        )
      );
  }

  const admin = await User.findOne({
    $or: [{ phone }, { email }],
    role: "ADMIN",
  });

  if (!admin) {
    return res
      .status(401)
      .json(new apiResponse(401, null, "Admin not found"));
  }

  const isPasswordMatch = await bcrypt.compare(password, admin.password);
  if (!isPasswordMatch) {
    return res
      .status(401)
      .json(new apiResponse(401, null, "Invalid credentials"));
  }

  const token = admin.generateAuthToken();

  return res.status(200).json(
    new apiResponse(
      200,
      {
        _id: admin._id,
        phone: admin.phone,
        email: admin.email,
        role: admin.role,
        authToken: token,
      },
      "Admin logged in successfully"
    )
  );
});