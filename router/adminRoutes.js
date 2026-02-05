import { Router } from "express";
import { createAdmin } from "../controllers/adminController.js";
import { adminLogin } from "../controllers/adminAuthController.js";

const router = Router();

//  Dev / Initial setup only
router.post("/create", createAdmin);

// Admin login
router.post("/login", adminLogin);

export default router;