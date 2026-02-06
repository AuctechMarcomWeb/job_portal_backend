import { Router } from "express";
import {
  saveJob,
  unsaveJob,
  getMySavedJobs,
  checkSavedJob,
} from "../controllers/savedJobController.js";

import verifyJWT from "../middlewares/verifyJWT.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = Router();

router.get("/check/:jobId", verifyJWT, checkSavedJob);

// Save a job
router.post(
  "/",
  verifyJWT,
  authorizeRoles("JOB_SEEKER"),
  saveJob
);

// Unsave a job
router.delete(
  "/:jobId",
  verifyJWT,
  authorizeRoles("JOB_SEEKER"),
  unsaveJob
);

// My saved jobs
router.get(
  "/my",
  verifyJWT,
  authorizeRoles("JOB_SEEKER"),
  getMySavedJobs
);

export default router;