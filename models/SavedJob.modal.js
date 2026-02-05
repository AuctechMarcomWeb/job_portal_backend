import mongoose from "mongoose";

const SavedJobSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 🚫 Prevent duplicate saves
SavedJobSchema.index({ job: 1, user: 1 }, { unique: true });

export default mongoose.model("SavedJob", SavedJobSchema);