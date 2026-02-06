import Job from "../models/Job.modal.js";
import Application from "../models/Application.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

/**
 * RECRUITER → DASHBOARD STATS
 */
export const getRecruiterDashboardStats = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  const [
    totalJobs,
    activeJobs,
    closedJobs,
    featuredJobs,

    totalApplications,
    appliedCount,
    viewedCount,
    shortlistedCount,
    rejectedCount,
    hiredCount,
  ] = await Promise.all([
    Job.countDocuments({ recruiter: recruiterId }),
    Job.countDocuments({ recruiter: recruiterId, status: "ACTIVE" }),
    Job.countDocuments({ recruiter: recruiterId, status: "CLOSED" }),
    Job.countDocuments({ recruiter: recruiterId, isFeatured: true }),

    Application.countDocuments({ recruiter: recruiterId }),
    Application.countDocuments({ recruiter: recruiterId, status: "APPLIED" }),
    Application.countDocuments({ recruiter: recruiterId, status: "VIEWED" }),
    Application.countDocuments({ recruiter: recruiterId, status: "SHORTLISTED" }),
    Application.countDocuments({ recruiter: recruiterId, status: "REJECTED" }),
    Application.countDocuments({ recruiter: recruiterId, status: "HIRED" }),
  ]);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        jobs: {
          total: totalJobs,
          active: activeJobs,
          closed: closedJobs,
          featured: featuredJobs,
        },
        applications: {
          total: totalApplications,
          applied: appliedCount,
          viewed: viewedCount,
          shortlisted: shortlistedCount,
          rejected: rejectedCount,
          hired: hiredCount,
        },
      },
      "Recruiter dashboard stats fetched successfully"
    )
  );
});

/**
 * RECRUITER → JOB WISE APPLICATION STATS
 */
export const getRecruiterJobAnalytics = asyncHandler(async (req, res) => {
  const recruiterId = req.user._id;

  const jobAnalytics = await Job.aggregate([
    {
      $match: {
        recruiter: recruiterId,
      },
    },
    {
      $lookup: {
        from: "applications",
        localField: "_id",
        foreignField: "job",
        as: "applications",
      },
    },
    {
      $project: {
        title: 1,
        status: 1,
        totalApplications: { $size: "$applications" },
        hiredCount: {
          $size: {
            $filter: {
              input: "$applications",
              as: "app",
              cond: { $eq: ["$$app.status", "HIRED"] },
            },
          },
        },
        createdAt: 1,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
  ]);

  return res.status(200).json(
    new apiResponse(
      200,
      jobAnalytics,
      "Recruiter job analytics fetched successfully"
    )
  );
});