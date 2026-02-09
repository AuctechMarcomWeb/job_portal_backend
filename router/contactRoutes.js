import express from "express";
import {
  createContact,
  getContactList,
  deleteContact,
} from "../controllers/contactController.js";

import verifyJWT from "../middlewares/verifyJWT.js";
// optionally add isAdmin middleware

const router = express.Router();

// Public
router.post("/", createContact);

// Admin
router.get("/", verifyJWT, getContactList);
router.delete("/:id", verifyJWT, deleteContact);

export default router;