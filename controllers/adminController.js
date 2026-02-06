import User from "../models/User.modal.js";
import bcrypt from "bcrypt";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import Job from "../models/Job.modal.js";
import Application from "../models/Application.modal.js";

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

/**
 * BLOCK / UNBLOCK USER (Admin)
 */
export const toggleUserActiveStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res
      .status(400)
      .json(new apiResponse(400, null, "isActive must be true or false"));
  }

  const user = await User.findById(userId);

  if (!user) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "User not found"));
  }

  // Prevent admin blocking himself
  if (req.user._id.toString() === user._id.toString()) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "You cannot block yourself"));
  }

  user.isActive = isActive;
  await user.save();

  return res.status(200).json(
    new apiResponse(
      200,
      {
        userId: user._id,
        isActive: user.isActive,
      },
      `User ${isActive ? "unblocked" : "blocked"} successfully`
    )
  );
});

/**
 * ADMIN DASHBOARD STATS
 */
export const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    jobSeekers,
    recruiters,
    blockedUsers,

    totalJobs,
    activeJobs,
    closedJobs,

    totalApplications,
    appliedCount,
    shortlistedCount,
    hiredCount,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "JOB_SEEKER" }),
    User.countDocuments({ role: "RECRUITER" }),
    User.countDocuments({ isActive: false }),

    Job.countDocuments(),
    Job.countDocuments({ status: "ACTIVE" }),
    Job.countDocuments({ status: "CLOSED" }),

    Application.countDocuments(),
    Application.countDocuments({ status: "APPLIED" }),
    Application.countDocuments({ status: "SHORTLISTED" }),
    Application.countDocuments({ status: "HIRED" }),
  ]);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        users: {
          total: totalUsers,
          jobSeekers,
          recruiters,
          blocked: blockedUsers,
        },
        jobs: {
          total: totalJobs,
          active: activeJobs,
          closed: closedJobs,
        },
        applications: {
          total: totalApplications,
          applied: appliedCount,
          shortlisted: shortlistedCount,
          hired: hiredCount,
        },
      },
      "Admin dashboard stats fetched successfully"
    )
  );
});