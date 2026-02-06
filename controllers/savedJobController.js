import SavedJob from "../models/SavedJob.modal.js";
import Job from "../models/Job.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

/**
 * SAVE JOB
 */
export const saveJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  if (!jobId) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Job ID is required"));
  }

  const job = await Job.findById(jobId);
  if (!job || job.status !== "ACTIVE") {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Job not found or inactive"));
  }

  const saved = await SavedJob.create({
    job: jobId,
    user: req.user._id,
  });

  return res.status(201).json(
    new apiResponse(201, saved, "Job saved successfully")
  );
});

/**
 * UNSAVE JOB
 */
export const unsaveJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const deleted = await SavedJob.findOneAndDelete({
    job: jobId,
    user: req.user._id,
  });

  if (!deleted) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Saved job not found"));
  }

  return res.status(200).json(
    new apiResponse(200, null, "Job removed from saved list")
  );
});

/**
 * GET MY SAVED JOBS
 */
export const getMySavedJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const savedJobs = await SavedJob.find({ user: req.user._id })
    .populate({
      path: "job",
      select:
        "title companyName city area workMode jobType status createdAt",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await SavedJob.countDocuments({
    user: req.user._id,
  });

  return res.status(200).json(
    new apiResponse(
      200,
      {
        total,
        page: Number(page),
        limit: Number(limit),
        savedJobs,
      },
      "Saved jobs fetched successfully"
    )
  );
});

/**
 * CHECK JOB SAVED OR NOT
 */
export const checkSavedJob = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { jobId } = req.params;

  const savedJob = await SavedJob.findOne({
    job: jobId,
    user: userId,
  });

  return res.status(200).json(
    new apiResponse(
      200,
      { isSaved: !!savedJob },
      "Saved job status fetched"
    )
  );
});
