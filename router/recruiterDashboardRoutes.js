import { Router } from "express";
import {
  getRecruiterDashboardStats,
  getRecruiterJobAnalytics,
} from "../controllers/recruiterDashboardController.js";

import verifyJWT from "../middlewares/verifyJWT.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = Router();

// Recruiter dashboard stats
router.get(
  "/stats",
  verifyJWT,
  authorizeRoles("RECRUITER"),
  getRecruiterDashboardStats
);

// Recruiter job analytics
router.get(
  "/jobs",
  verifyJWT,
  authorizeRoles("RECRUITER"),
  getRecruiterJobAnalytics
);

export default router;