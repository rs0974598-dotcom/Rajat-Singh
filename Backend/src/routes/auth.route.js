import express from "express";
import passport from "passport";

import {
  registerValidation,
  loginValidation,
} from "../validation/auth.validator.js";

import {
  registerUser,
  loginUser,
  googlecallback,
  getMe,
} from "../controller/auth.controller.js";

import { validateRequest } from "../middleware/user.middleware.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();


// ================= REGISTER =================

router.post(
  "/register",
  registerValidation,
  validateRequest,
  registerUser
);


// ================= LOGIN =================

router.post(
  "/login",
  loginValidation,
  validateRequest,
  loginUser
);


// ================= GOOGLE AUTH =================

// Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


// Google Callback
router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false,
  }),

  googlecallback
);

router.get("/me",authenticateUser,getMe)

export default router;