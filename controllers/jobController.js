import Job from "../models/Job.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import Category from "../models/Category.modal.js";

/**
 * CREATE JOB (Recruiter Only)
 */
export const createJob_old = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    skills,
    jobType,
    experienceMin,
    experienceMax,
    salaryMin,
    salaryMax,
    location,
    companyName,
    companyLogo,
    expiresAt,
  } = req.body;

  // 🔍 Basic validation
  if (!title || !description || !jobType || !companyName) {
    return res
      .status(400)
      .json(
        new apiResponse(
          400,
          null,
          "Title, description, job type and company name are required"
        )
      );
  }

  const job = await Job.create({
    title,
    description,
    skills,
    jobType,
    experienceMin,
    experienceMax,
    salaryMin,
    salaryMax,
    location,
    companyName,
    companyLogo,
    expiresAt,
    recruiter: req.user._id, // 🔐 from JWT
  });

  return res.status(201).json(
    new apiResponse(
      201,
      job,
      "Job posted successfully"
    )
  );
});



export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    skills,
    jobType,
    workMode,
    experienceMin,
    experienceMax,
    salaryMin,
    salaryMax,
    city,
    area,
    pincode,
    address,
    recruitmentDuration,
    benefits,
    companyName,
    companyLogo,
    expiresAt,
  } = req.body;

  if (!title || !description || !category || !jobType || !workMode || !companyName) {
    return res
      .status(400)
      .json(
        new apiResponse(
          400,
          null,
          "Title, description, category, job type, work mode and company name are required"
        )
      );
  }

  // 🔍 Validate category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists || !categoryExists.isActive) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid job category"));
  }

  const job = await Job.create({
    title,
    description,
    category,
    skills,
    jobType,
    workMode,
    experienceMin,
    experienceMax,
    salaryMin,
    salaryMax,
    city,
    area,
    pincode,
    address,
    recruitmentDuration,
    benefits,
    companyName,
    companyLogo,
    expiresAt,
    recruiter: req.user._id,
  });

  return res
    .status(201)
    .json(new apiResponse(201, job, "Job posted successfully"));
});

/* ----------------------------------------
   GET JOB BY ID (Public)
---------------------------------------- */
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("recruiter", "name phone");

  if (!job) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Job not found"));
  }

  return res.status(200).json(
    new apiResponse(200, job, "Job fetched successfully")
  );
});

/* ----------------------------------------
   GET JOB LIST (Public)
---------------------------------------- */
export const getJobList_old = asyncHandler(async (req, res) => {
  const {
    keyword,
    location,
    jobType,
    page = 1,
    limit = 10,
  } = req.query;

  const query = { status: "ACTIVE" };

  if (keyword) {
    query.title = { $regex: keyword, $options: "i" };
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  if (jobType) {
    query.jobType = jobType;
  }

  const jobs = await Job.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
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
      "Job list fetched successfully"
    )
  );
});

/* ----------------------------------------
   GET JOB LIST (Public with Filters)
---------------------------------------- */
export const getJobList = asyncHandler(async (req, res) => {
  const {
    keyword,
    title,
    company,
    category,
    city,
    state,
    pincode,
    jobType,
    workMode, // REMOTE / ON_SITE / HYBRID
    page = 1,
    limit = 10,
  } = req.query;

  const query = {
    status: "ACTIVE",
  };

  /* ---------------- TEXT SEARCH ---------------- */

  //  Keyword search (title + description + skills)
  if (keyword) {
    query.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { skills: { $regex: keyword, $options: "i" } },
    ];
  }

  //  Job title filter
  if (title) {
    query.title = { $regex: title, $options: "i" };
  }

  //  Company name filter
  if (company) {
    query.companyName = { $regex: company, $options: "i" };
  }

  /* ---------------- CATEGORY ---------------- */

  if (category) {
    query.category = category; // ObjectId
  }

  /* ---------------- LOCATION ---------------- */

  if (city) {
    query.city = { $regex: city, $options: "i" };
  }

  if (state) {
    query.state = { $regex: state, $options: "i" };
  }

  if (pincode) {
    query.pincode = pincode;
  }

  /* ---------------- JOB TYPE & MODE ---------------- */

  if (jobType) {
    query.jobType = jobType;
  }

  if (workMode) {
    query.workMode = workMode; // REMOTE / ON_SITE / HYBRID
  }

  /* ---------------- QUERY EXECUTION ---------------- */

  const skip = (page - 1) * limit;

  const jobs = await Job.find(query)
    .populate("category", "name slug")
    .populate("recruiter", "name")
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
      "Job list fetched successfully"
    )
  );
});

/* ----------------------------------------
   UPDATE JOB (Recruiter & Owner Only)
---------------------------------------- */
export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Job not found"));
  }

  // 🔐 Only owner recruiter can update
  // if (job.recruiter.toString() !== req.user._id.toString()) {
  //   return res
  //     .status(403)
  //     .json(new apiResponse(403, null, "Not authorized to update this job"));
  // }

  Object.assign(job, req.body);
  await job.save();

  return res.status(200).json(
    new apiResponse(200, job, "Job updated successfully")
  );
});

/* ----------------------------------------
   DELETE JOB (Recruiter & Owner Only)
---------------------------------------- */
export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Job not found"));
  }

  // 🔐 Only owner recruiter can delete
  // if (job.recruiter.toString() !== req.user._id.toString()) {
  //   return res
  //     .status(403)
  //     .json(new apiResponse(403, null, "Not authorized to delete this job"));
  // }

  await job.deleteOne();

  return res.status(200).json(
    new apiResponse(200, null, "Job deleted successfully")
  );
});