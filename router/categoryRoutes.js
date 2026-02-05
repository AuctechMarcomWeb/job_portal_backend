import { Router } from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";

import verifyJWT from "../middlewares/verifyJWT.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = Router();

// Public
router.get("/", getCategories);

// Admin only
router.post("/", 
  // verifyJWT, 
 // authorizeRoles("ADMIN"), 
  createCategory);
router.put("/:id", 
  verifyJWT, 
  authorizeRoles("ADMIN"), 
  updateCategory);

export default router;