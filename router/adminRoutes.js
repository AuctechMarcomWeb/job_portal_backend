import { Router } from "express";
import { createAdmin } from "../controllers/adminController.js";
import { adminLogin } from "../controllers/adminAuthController.js";
import { toggleUserActiveStatus } from "../controllers/adminController.js";
import verifyJWT from "../middlewares/verifyJWT.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import { getAdminDashboardStats } from "../controllers/adminController.js";




const router = Router();

//  Dev / Initial setup only
router.post("/create", createAdmin);

// Admin login
router.post("/login", adminLogin);
router.patch(
  "/users/:userId/status",
  verifyJWT,
  authorizeRoles("ADMIN"),
  toggleUserActiveStatus
);

router.get(
  "/dashboard",
  verifyJWT,
  authorizeRoles("ADMIN"),
  getAdminDashboardStats
);


export default router;