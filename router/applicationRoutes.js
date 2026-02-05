import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import {
  applyJob,
  withdrawApplication,
  getMyAppliedJobs,
  getApplicantsForJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";



const router = Router();

// Job Seeker → Apply Job
router.post(
  "/apply",
  verifyJWT,
  authorizeRoles("JOB_SEEKER"),
  applyJob
);

// Job Seeker → Withdraw Job
router.patch(
  "/withdraw/:applicationId",
  verifyJWT,
  authorizeRoles("JOB_SEEKER"),
  withdrawApplication
);

// Job Seeker → My Applied Jobs
router.get(
  "/my",
  verifyJWT,
  authorizeRoles("JOB_SEEKER"),
  getMyAppliedJobs
);

router.get(
  "/job/:jobId",
  verifyJWT,
  authorizeRoles("RECRUITER"),
  getApplicantsForJob
);

router.patch(
  "/:applicationId/status",
  verifyJWT,
  authorizeRoles("RECRUITER"),
  updateApplicationStatus
);

export default router;