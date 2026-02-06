import Job from "../models/Job.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

/**
 * ADMIN → GET ALL JOBS (Moderation)
 */
export const getAllJobsForAdmin = asyncHandler(async (req, res) => {
  const {
    status,
    category,
    recruiterId,
    city,
    workMode,
    company,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (status) query.status = status;
  if (category) query.category = category;
  if (recruiterId) query.recruiter = recruiterId;
  if (workMode) query.workMode = workMode;
  if (city) query.city = { $regex: city, $options: "i" };
  if (company) query.companyName = { $regex: company, $options: "i" };

  const skip = (page - 1) * limit;

  const jobs = await Job.find(query)
    .populate("category", "name")
    .populate("recruiter", "name phone email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Job.countDocuments(query);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        total,
        page: Number(page),
        limit: Number(limit),
        jobs,
      },
      "Jobs fetched for admin moderation"
    )
  );
});

/**
 * ADMIN → UPDATE JOB STATUS
 */
export const updateJobStatusByAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["ACTIVE", "CLOSED"].includes(status)) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid job status"));
  }

  const job = await Job.findById(id);

  if (!job) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Job not found"));
  }

  job.status = status;
  await job.save();

  return res.status(200).json(
    new apiResponse(
      200,
      {
        jobId: job._id,
        status: job.status,
      },
      "Job status updated successfully"
    )
  );
});

/**
 * ADMIN → FEATURE / UNFEATURE JOB
 */
export const toggleJobFeature = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isFeatured } = req.body;

  if (typeof isFeatured !== "boolean") {
    return res
      .status(400)
      .json(new apiResponse(400, null, "isFeatured must be boolean"));
  }

  const job = await Job.findById(id);

  if (!job) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Job not found"));
  }

  job.isFeatured = isFeatured;
  await job.save();

  return res.status(200).json(
    new apiResponse(
      200,
      {
        jobId: job._id,
        isFeatured: job.isFeatured,
      },
      `Job ${isFeatured ? "featured" : "unfeatured"} successfully`
    )
  );
});