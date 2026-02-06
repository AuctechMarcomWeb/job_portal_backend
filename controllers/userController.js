import User from "../models/User.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import Application from "../models/Application.modal.js";
import Job from "../models/Job.modal.js";

/**
 * CREATE USER (Admin / Dev Utility)
 */
export const createUser = asyncHandler(async (req, res) => {
  const { phone, name, role, email, gender } = req.body;

  if (!phone || !role) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Phone and role are required"));
  }

  if (!["JOB_SEEKER", "RECRUITER"].includes(role)) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid role"));
  }

  const existingUser = await User.findOne({
    $or: [{ phone }, { email }],
  });

  if (existingUser) {
    return res
      .status(409)
      .json(new apiResponse(409, null, "User already exists"));
  }

  const user = await User.create({
    phone,
    name,
    email,
    gender,
    role,
    linkedinUrl,
    portfolioUrl,
    position,
    experience,
    isPhoneVerified: true,
    isProfileCompleted: false,
  });

  return res.status(201).json(
    new apiResponse(201, user, "User created successfully")
  );
});

/**
 * GET MY PROFILE (JWT REQUIRED)
 */
export const getMyProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  return res.status(200).json(
    new apiResponse(200, user, "Profile fetched successfully")
  );
});

/**
 * ADD USER RESUME (CV)
 */
export const addUserCV = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { url } = req.body;

  if (!url) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Resume URL is required"));
  }

  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "User not found"));
  }

  user.userCV.push({ url });
  await user.save();

  return res.status(200).json(
    new apiResponse(
      200,
      user.userCV,
      "Resume uploaded successfully"
    )
  );
});

/**
 * DELETE USER RESUME (CV)
 */
export const deleteUserCV = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { cvId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "User not found"));
  }

  const cvIndex = user.userCV.findIndex(
    (cv) => cv._id.toString() === cvId
  );

  if (cvIndex === -1) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Resume not found"));
  }

  user.userCV.splice(cvIndex, 1);
  await user.save();

  return res.status(200).json(
    new apiResponse(
      200,
      user.userCV,
      "Resume deleted successfully"
    )
  );
});

/**
 * GET ALL USERS (Admin)
 */
export const getAllUsers_old = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });

  return res.status(200).json(
    new apiResponse(200, users, "Users fetched successfully")
  );
});

/**
 * GET ALL USERS (Admin with Filters)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const {
    role,
    name,
    gender,
    isProfileCompleted,
    isEmailVerified,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  /* ---------------- FILTERS ---------------- */

  if (role) {
    query.role = role; // JOB_SEEKER, RECRUITER, ADMIN
  }

  if (gender) {
    query.gender = gender; // Male, Female, Other
  }

  if (name) {
    query.name = { $regex: name, $options: "i" }; // case-insensitive
  }

  if (isProfileCompleted !== undefined) {
    query.isProfileCompleted = isProfileCompleted === "true";
  }

  if (isEmailVerified !== undefined) {
    query.isEmailVerified = isEmailVerified === "true";
  }

  /* ---------------- QUERY ---------------- */

  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .select("-password -otp -otpExpiration") // 🔐 hide sensitive fields
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await User.countDocuments(query);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        total,
        page: Number(page),
        limit: Number(limit),
        users,
      },
      "Users fetched successfully"
    )
  );
});

/**
 * GET USER BY ID
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "User not found"));
  }

  return res.status(200).json(
    new apiResponse(200, user, "User fetched successfully")
  );
});

/**
 * UPDATE USER (Self / Admin)
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const allowedFields = [
    "name",
    "email",
    "gender",
    "linkedinUrl",
    "portfolioUrl",
    "position",
    "experience",
    "profilePic",
    "isProfileCompleted",
  ];

  const updateData = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "User not found"));
  }

  return res.status(200).json(
    new apiResponse(200, user, "User updated successfully")
  );
});

/**
 * DELETE USER
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "User not found"));
  }

  return res.status(200).json(
    new apiResponse(200, null, "User deleted successfully")
  );
});



/**
 * SWITCH USER ROLE (JOB_SEEKER ↔ RECRUITER)
 */
export const switchUserRole = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { role } = req.body;

  if (!["JOB_SEEKER", "RECRUITER"].includes(role)) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid role"));
  }

  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "User not found"));
  }

  if (user.role === role) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "User already has this role"));
  }

  // 🔍 Check if user has applied to any job in past
  const applicationCount = await Application.countDocuments({
    applicant: user._id,
  });

  if (applicationCount > 0) {
    return res.status(403).json(
      new apiResponse(
        403,
        null,
        "Role cannot be changed because job applications already exist, Create New Account"
      )
    );
  }

  // 🔍 Check if recruiter has posted any job
  const jobCount = await Job.countDocuments({
    recruiter: user._id, // or recruiterId depending on your schema
  });

  if (jobCount > 0) {
    return res.status(403).json(
      new apiResponse(
        403,
        null,
        "Role cannot be changed because you have posted jobs as a recruiter."
      )
    );
  }

  

  // ✅ Safe to update role
  user.role = role;
  await user.save();

  return res.status(200).json(
    new apiResponse(
      200,
      {
        role: user.role,
      },
      "User role updated successfully"
    )
  );
});