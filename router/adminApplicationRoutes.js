import { Router } from "express";
import {
  getAllApplicationsForAdmin,
  getApplicationStatsForAdmin,
} from "../controllers/adminApplicationController.js";

import verifyJWT from "../middlewares/verifyJWT.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = Router();

// Admin → application monitoring
router.get(
  "/",
  verifyJWT,
  authorizeRoles("ADMIN"),
  getAllApplicationsForAdmin
);

// Admin → application stats
router.get(
  "/stats",
  verifyJWT,
  authorizeRoles("ADMIN"),
  getApplicationStatsForAdmin
);

export default router;