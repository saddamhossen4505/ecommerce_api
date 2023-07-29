import express from "express";
import {
  userLogin,
  userLogout,
  userRegister,
  loggedInUser,
  verifyLink,
  updateUserData,
  updateUserPassword,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// Init router.
const router = express.Router();

// Routes.
router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);
router.route("/register").post(userRegister);
router.route("/me").get(authMiddleware, loggedInUser);
router.route("/verify/:token").get(verifyLink);
router.route("/update/data/:id").put(updateUserData);
router.route("/update/data/:id").patch(updateUserData);
router.route("/update/password/:id").put(updateUserPassword);
router.route("/update/password/:id").patch(updateUserPassword);

// Export router.
export default router;
