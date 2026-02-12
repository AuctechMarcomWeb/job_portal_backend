import Application from "../models/Application.modal.js";
import Job from "../models/Job.modal.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { sendEmail } from "../utils/emailService.js";
import {
  applicationAppliedTemplate,
  newApplicationRecruiterTemplate,
} from "../utils/emailTemplates.js";
import User from "../models/User.modal.js";

/**
 * APPLY TO A JOB (Job Seeker)
 */
export const applyJob = asyncHandler(async (req, res) => {
  const { jobId, resume, coverLetter, linkedinUrl,portfolioUrl } = req.body;

  if (!jobId) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Job ID is required"));
  }

  //  Job exists & active?
  const job = await Job.findOne({ _id: jobId, status: "ACTIVE" });
  if (!job) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Job not found or closed"));
  }

  //  Recruiter cannot apply to own job
  if (job.recruiter.toString() === req.user._id.toString()) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "You cannot apply to your own job"));
  }

  //  Prevent duplicate apply (extra safety)
  const alreadyApplied = await Application.findOne({
    job: jobId,
    applicant: req.user._id,
  });

  if (alreadyApplied) {
    return res
      .status(409)
      .json(new apiResponse(409, null, "You have already applied to this job"));
  }

  // ✅ Create application
  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
    recruiter: job.recruiter,
    resume,
    coverLetter,
    linkedinUrl,
    portfolioUrl,
  });

  // 📊 Update job stats
  job.totalApplications += 1;
  await job.save();
  
  sendEmail({
    to: req.user.email,
    subject: "Application submitted",
    html: applicationAppliedTemplate({
      candidateName: req.user.name,
      jobTitle: job.title,
      companyName: job.companyName,
      location: `${job.city}, ${job.state || ""}`,
    }),
  });

  // Send Email to Recruiter
  const recruiter = await User.findById(job.recruiter);

  sendEmail({
    to: recruiter.email,
    subject: "New application received",
    html: newApplicationRecruiterTemplate({
      recruiterName: recruiter.name,
      jobTitle: job.title,
      companyName: job.companyName,
      applicantName: req.user.name,
      location: `${job.city}, ${job.state || ""}`,
    }),
  });

  return res.status(201).json(
    new apiResponse(
      201,
      application,
      "Job applied successfully"
    )
  );
});

/**
 * WITHDRAW JOB APPLICATION (Job Seeker)
 */
export const withdrawApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  const application = await Application.findById(applicationId);

  if (!application) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Application not found"));
  }

  // 🔐 Only applicant can withdraw
  if (application.applicant.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json(new apiResponse(403, null, "Not authorized to withdraw this application"));
  }

  // 🚫 Cannot withdraw if already hired
  if (application.status === "HIRED") {
    return res
      .status(400)
      .json(new apiResponse(400, null, "You cannot withdraw a hired application"));
  }

  // 🚫 Already withdrawn
  if (application.status === "WITHDRAWN") {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Application already withdrawn"));
  }

  application.status = "WITHDRAWN";
  await application.save();

  // 📊 Decrease job application count
  const job = await Job.findById(application.job);
  if (job && job.totalApplications > 0) {
    job.totalApplications -= 1;
    await job.save();
  }

  return res.status(200).json(
    new apiResponse(
      200,
      application,
      "Application withdrawn successfully"
    )
  );
});

/**
 * GET MY APPLIED JOBS (Job Seeker)
 * Excludes WITHDRAWN applications
 */
export const getMyAppliedJobs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const applications = await Application.find({
    applicant: req.user._id,
    status: { $ne: "WITHDRAWN" }, // EXCLUDE withdrawn
  })
    .populate({
      path: "job",
      select:
        "title companyName city area workMode jobType status createdAt",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Application.countDocuments({
    applicant: req.user._id,
    status: { $ne: "WITHDRAWN" }, //  SAME FILTER
  });

  return res.status(200).json(
    new apiResponse(
      200,
      {
        total,
        page: Number(page),
        limit: Number(limit),
        applications,
      },
      "My applied jobs fetched successfully"
    )
  );
});

/**
 * RECRUITER → VIEW APPLICANTS FOR A JOB
 * Auto-update APPLIED → VIEWED
 */
export const getApplicantsForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  // 🔍 Ensure job belongs to recruiter
  const job = await Job.findOne({
    _id: jobId,
    recruiter: req.user._id,
  });

  if (!job) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Job not found or not authorized"));
  }

  // 🔄 Auto-update APPLIED → VIEWED
  await Application.updateMany(
    {
      job: jobId,
      status: "APPLIED",
    },
    {
      $set: { status: "VIEWED" },
    }
  );

  // 📄 Fetch updated applications
  const applications = await Application.find({ job: jobId })
    .populate("applicant", "name phone email profilePic")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new apiResponse(
      200,
      applications,
      "Applicants fetched successfully"
    )
  );
});

/**
 * RECRUITER → UPDATE APPLICATION STATUS
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "SHORTLISTED",
    "REJECTED",
    "HIRED",
  ];

  if (!allowedStatuses.includes(status)) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid status update"));
  }

  const application = await Application.findById(applicationId).populate("job");

  if (!application) {
    return res
      .status(404)
      .json(new apiResponse(404, null, "Application not found"));
  }

  // 🔐 Ensure recruiter owns the job
  if (application.job.recruiter.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json(new apiResponse(403, null, "Not authorized"));
  }

  // 🚫 Cannot change after hired
  if (application.status === "HIRED") {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Application already hired"));
  }

  application.status = status;
  await application.save();

  // Send Email to Job Seeker on status change
  const applicant = await User.findById(application.applicant);

  // sendEmail({
  //   to: applicant.email,
  //   subject: "Application Status Updated",
  //   html: applicationStatusTemplate({
  //     name: applicant.name,
  //     jobTitle: application.job.title,
  //     status,
  //   }),
  // });

  return res.status(200).json(
    new apiResponse(
      200,
      application,
      "Application status updated successfully"
    )
  );
});