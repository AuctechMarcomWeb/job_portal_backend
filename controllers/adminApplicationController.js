import Application from "../models/Application.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

/**
 * ADMIN → GET ALL APPLICATIONS (Monitoring)
 */
export const getAllApplicationsForAdmin = asyncHandler(async (req, res) => {
  const {
    status,
    jobId,
    recruiterId,
    applicantId,
    dateFrom,
    dateTo,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (status) query.status = status;
  if (jobId) query.job = jobId;
  if (recruiterId) query.recruiter = recruiterId;
  if (applicantId) query.applicant = applicantId;

  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }

  const skip = (page - 1) * limit;

  const applications = await Application.find(query)
    .populate("job", "title companyName")
    .populate("recruiter", "name email phone")
    .populate("applicant", "name email phone")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Application.countDocuments(query);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        total,
        page: Number(page),
        limit: Number(limit),
        applications,
      },
      "Applications fetched for admin monitoring"
    )
  );
});

/**
 * ADMIN → APPLICATION FUNNEL STATS
 */
export const getApplicationStatsForAdmin = asyncHandler(async (req, res) => {
  const stats = await Application.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const formattedStats = {
    APPLIED: 0,
    VIEWED: 0,
    SHORTLISTED: 0,
    REJECTED: 0,
    HIRED: 0,
    WITHDRAWN: 0,
  };

  stats.forEach((item) => {
    formattedStats[item._id] = item.count;
  });

  return res.status(200).json(
    new apiResponse(
      200,
      formattedStats,
      "Application stats fetched successfully"
    )
  );
});