import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    //  Identity
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },

    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
     // 👇 MULTIPLE RESUMES
     userCV: [
      {
        url: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    //  Authentication
    password: {
      type: String, // bcrypt hash
    },

    otp: String,
    otpExpiration: Date,

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    //  Basic Profile
    name: String,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dob: Date,

    profilePic: String,

    //  Job Portal Roles
    role: {
      type: String,
      enum: ["JOB_SEEKER", "RECRUITER", "ADMIN"],
      default: "JOB_SEEKER",
      required: true,
    },

    linkedinUrl: {
          type: String,
        }, 

     portfolioUrl: {
          type: String,
        }, 

     position: {
          type: String,
        }, 

     experience: {
          type: String,
          },
        
    //  Profile Status
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },

    isActive: {
  type: Boolean,
  default: true,
  },

    //  System
    fcmToken: String,
  },
  { timestamps: true }
);

//  JWT Generator
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

export default mongoose.model("User", UserSchema);