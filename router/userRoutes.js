import { Router } from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import {
  createUser,
  getMyProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addUserCV,
  deleteUserCV,
  switchUserRole,
} from "../controllers/userController.js";


const router = Router();

// Admin / Dev
router.post("/", createUser);
router.get("/", verifyJWT, getAllUsers);

// Logged-in User
router.get("/me", verifyJWT, getMyProfile);
router.post("/cv", verifyJWT, addUserCV);
router.delete("/cv/:cvId", verifyJWT, deleteUserCV);

// CRUD by ID
router.get("/:id", verifyJWT, getUserById);
router.put("/:id", verifyJWT, updateUser);
router.delete("/:id", verifyJWT, deleteUser);

// Switch Role
router.patch("/switch-role", verifyJWT, switchUserRole);

export default router;