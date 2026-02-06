import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";

// Routes
import authRoutes from "./router/authRoutes.js";
import uploadRoutes from "./router/uploadRoutes.js";
import userRoutes from "./router/userRoutes.js";
import adminRoutes from "./router/adminRoutes.js";
import jobRoutes from "./router/jobRoutes.js";
import categoryRoutes from "./router/categoryRoutes.js";
import applicationRoutes from "./router/applicationRoutes.js";
import savedJobRoutes from "./router/savedJobRoutes.js";
import adminJobRoutes from "./router/adminJobRoutes.js";
import adminApplicationRoutes from "./router/adminApplicationRoutes.js";









dotenv.config();

const app = express();

/* ------------------ MIDDLEWARES ------------------ */

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

/* ------------------ ROUTES ------------------ */

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);

app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/admin/applications", adminApplicationRoutes);



/* ------------------ SERVER START ------------------ */

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB(); // ✅ DB first
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();