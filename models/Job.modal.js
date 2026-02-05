import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    /* ---------------- BASIC JOB INFO ---------------- */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    /* ---------------- CATEGORY ---------------- */

category: {
  // type: mongoose.Schema.Types.ObjectId,
  // ref: "Category",
  // required: true,
  type: String,
  required: true,
  trim: true,
},

    /* ---------------- JOB DETAILS ---------------- */
    

    jobType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"],
      required: true,
    },

    workMode: {
      // 👈 NEW (On-site / Remote / Hybrid)
      type: String,
      enum: ["ON_SITE", "REMOTE", "HYBRID"],
      required: true,
    },

    experienceMin: {
      type: Number,
      default: 0,
    },

    experienceMax: {
      type: Number,
    },

    salaryMin: {
      type: Number,
    },

    salaryMax: {
      type: Number,
    },

    currency: {
      type: String,
      default: "INR",
    },

    /* ---------------- JOB LOCATION ---------------- */

    city: {
      type: String,
      trim: true,
    },

    area: {
      type: String,
      trim: true,
    },

    pincode: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    /* ---------------- RECRUITMENT INFO ---------------- */

    recruitmentDuration: {
      // e.g. "15 days", "1 month"
      type: String,
      trim: true,
    },

    benefits: [
      {
        type: String,
        trim: true,
      },
    ],

    /* ---------------- COMPANY / RECRUITER ---------------- */

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: String,
    },

    yourRole: {
      type: String,
      enum: ["COMPANY_HR", "COMPANY_MANAGER", "AGENCY_RECRUITER"],
      required: true,
    },

    /* ---------------- JOB STATUS ---------------- */

    status: {
      type: String,
      enum: ["ACTIVE","PENDING", "CLOSED"],
      default: "ACTIVE",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
    },

    /* ---------------- STATS ---------------- */

    totalApplications: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", JobSchema);