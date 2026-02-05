import { Router } from "express";
import {
  createJob,
  getJobById,
  getJobList,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

import verifyJWT from "../middlewares/verifyJWT.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = Router();

/* -------- PUBLIC ROUTES -------- */

// Job list
router.get("/", getJobList);

// Job details
router.get("/:id", getJobById);

/* -------- RECRUITER ROUTES -------- */

// Create job
router.post(
  "/",
  verifyJWT,
  authorizeRoles("RECRUITER"),
  createJob
);

// Update job
router.put(
  "/:id",
  // authorizeRoles("RECRUITER"),
  updateJob
);

// Delete job
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("RECRUITER"),
  deleteJob
);

export default router;