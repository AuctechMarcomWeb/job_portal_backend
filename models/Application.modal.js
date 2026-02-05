import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: String, // URL (Cloudinary / S3 later)
    },

    coverLetter: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["APPLIED", "VIEWED", "SHORTLISTED", "REJECTED", "HIRED","WITHDRAWN"],
      default: "APPLIED",
    },
  },
  { timestamps: true }
);

// 🚫 Prevent duplicate applications (IMPORTANT)
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model("Application", ApplicationSchema);