import jwt from "jsonwebtoken";
import User from "../models/User.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  let token;

  // ✅ Token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json(new apiResponse(401, null, "Not authorized, token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json(new apiResponse(401, null, "User not found"));
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new apiResponse(401, null, "Invalid or expired token"));
  }
});

export default verifyJWT;