import express from "express";
import {
  createContact,
  getContactList,
} from "../controllers/contactController.js";

import verifyJWT from "../middlewares/verifyJWT.js";
// optionally add isAdmin middleware

const router = express.Router();

// Public
router.post("/", createContact);

// Admin
router.get("/", verifyJWT, getContactList);

export default router;