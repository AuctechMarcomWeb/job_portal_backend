import { Router } from "express";
import {
  getAllJobsForAdmin,
  updateJobStatusByAdmin,
  toggleJobFeature,
} from "../controllers/adminJobController.js";

import verifyJWT from "../middlewares/verifyJWT.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = Router();

// Admin job moderation
router.get(
  "/",
  verifyJWT,
  authorizeRoles("ADMIN"),
  getAllJobsForAdmin
);

router.patch(
  "/:id/status",
  verifyJWT,
  authorizeRoles("ADMIN"),
  updateJobStatusByAdmin
);

router.patch(
  "/:id/feature",
  verifyJWT,
  authorizeRoles("ADMIN"),
  toggleJobFeature
);

export default router;