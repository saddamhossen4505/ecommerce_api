import asyncHandler from "express-async-handler";
import User from "../models/UserModels.js";
import jwt from "jsonwebtoken";

// Create authMiddleware.
const authMiddleware = (req, res, next) => {
  // Check Cookies.
  const accessToken = req.cookies.accessToken;

  // Validation.
  if (!accessToken) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  // Now verifyToken.
  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    asyncHandler(async (error, decode) => {
      if (error) {
        return res.status(400).json({ message: "Forbiden token" });
      }

      const me = await User.findOne({ email: decode.email }).select(
        "-password"
      );

      req.me = me;
      next();
    })
  );
};

// Export authMiddleware.
export default authMiddleware;
