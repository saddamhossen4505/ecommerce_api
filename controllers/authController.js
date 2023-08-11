import asyncHandler from "express-async-handler";
import User from "../models/UserModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { mailSend } from "../utils/mailSend.js";

/**
 * @desc User-Login system
 * @method POST
 * @route /api/v1/auth/login
 * @access Public
 */
export const userLogin = asyncHandler(async (req, res) => {
  // Get id.
  const { email, password } = req.body;

  // Validation.
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const loginUser = await User.findOne({ email }).populate("role");

  if (!loginUser) {
    return res.status(404).json({ message: "User Not Found." });
  }

  // Check accountVerify.
  if (!loginUser.isVerify) {
    return res.status(404).json({ message: "Please verify your account." });
  }

  // Check password.
  const passCheck = await bcrypt.compare(password, loginUser.password);

  // passCheck Validation.
  if (!passCheck) {
    return res.status(400).json({ message: "Wrong password." });
  }

  // Create accessToken.
  const accessToken = jwt.sign(
    { email: loginUser.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    }
  );

  // // Create refreshToken.
  // const refreshToken = jwt.sign(
  //   { email: loginUser.email },
  //   process.env.REFRESH_TOKEN_SECRET,
  //   {
  //     expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
  //   }
  // );

  // AccessToken save in cookie mamory.
  res.cookie("accessToken", accessToken, {
    httpOnly: false,
    secure: process.env.APP_ENV == "Development" ? false : true,
    sameSite: "strict",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(200).json({
    token: accessToken,
    message: "User login successful",
    user: loginUser,
  });
});

/**
 * @desc User-Logout system
 * @method POST
 * @route /api/v1/auth/logout
 * @access Public
 */
export const userLogout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.status(200).json({ message: "Logout successful." });
});

/**
 * @desc User-Register system
 * @method POST
 * @route /api/v1/auth/register
 * @access Public
 */
export const userRegister = asyncHandler(async (req, res) => {
  // Get Data.
  const { name, email, password } = req.body;

  // Validation.
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // If EmailAlreadyExits.
  const isEmail = await User.findOne({ email });
  if (isEmail) return res.status(400).json({ message: "Email already exits." });

  // Create token for account activation link.
  const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
  });

  // Create account activation link.
  const link = `${process.env.APP_URL}:${process.env.PORT}/api/v1/auth/verify/${token}`;

  // Send Account activation link to user.
  mailSend(email, { name, link });

  // Create hashPassword.
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashPassword,
  });
  res.status(200).json({ user, message: "User created successful." });
});

/**
 * @desc Get LoggedInUserData
 * @method GET
 * @route /api/v1/auth/me
 * @access Public
 */
export const loggedInUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.me).populate("role");
});

/**
 * @desc Get VerifyLink
 * @method GET
 * @route /api/v1/auth/verify/:token
 * @access Public
 */
export const verifyLink = (req, res) => {
  // Get token from params.
  const { token } = req.params;

  // Now verify token.
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    asyncHandler(async (error, decode) => {
      if (error) {
        return res.status(400).json({ message: "Invalid activation link" });
      }

      const UnVerifyUser = await User.findOne({ email: decode.email });

      // Validation.
      if (UnVerifyUser.isVerify) {
        return res.status(400).json({ message: "Account already verifyed." });
      }

      // Now verify this UnVerifyUser.
      const verifyUser = await User.findByIdAndUpdate(UnVerifyUser.id, {
        isVerify: true,
      });

      return res
        .status(200)
        .json({ message: "Account is activated. Now LogIn" });
    })
  );
};

/**
 * @desc UpdateUserData
 * @method PUT/PATCH
 * @route /api/v1/auth/update/data/:id
 * @access Public
 */
export const updateUserData = asyncHandler(async (req, res) => {
  // Get Data.
  const { name, email, mobile, gender } = req.body;

  // Get id.
  const { id } = req.params;

  // updateUser.
  const user = await User.findByIdAndUpdate(
    id,
    {
      name,
      email,
      mobile,
      gender,
    },
    { new: true }
  );
  res.status(200).json({ message: "User data updated successfull.", user });
});

/**
 * @desc UpdateUserPassword
 * @method PUT/PATCH
 * @route /api/v1/auth/update/password/:id
 * @access Public
 */
export const updateUserPassword = asyncHandler(async (req, res) => {
  // Get id.
  const { id } = req.params;
  // Get Data.
  const { old_password, new_password, confirm_password } = req.body;

  // Validation.
  if (!old_password || !new_password || !confirm_password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check old_password.
  const loginUserData = await User.findById(id);
  const old_PassCheck = await bcrypt.compare(
    old_password,
    loginUserData.password
  );

  if (!old_PassCheck) {
    return res.status(400).json({ message: "Old password not match" });
  }

  // Match Password.
  if (new_password !== confirm_password) {
    return res.status(400).json({ message: "Password not match" });
  }

  // Create hashPassword.
  const hashPassword = await bcrypt.hash(confirm_password, 10);

  // updateUser.
  const user = await User.findByIdAndUpdate(
    id,
    {
      password: hashPassword,
    },
    { new: true }
  );
  res
    .status(200)
    .clearCookie("accessToken")
    .json({ user, message: "Password successfuly changed." });
});
