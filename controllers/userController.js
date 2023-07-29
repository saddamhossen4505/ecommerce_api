import asyncHandler from "express-async-handler";
import User from "../models/UserModels.js";
import bcrypt from "bcrypt";

/**
 * @desc GetAllUser
 * @method GET
 * @route /api/v1/user
 * @access Public
 */
export const getAllUser = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (users.length === 0) {
    return res.status(404).json({ message: "User Not Found." });
  }

  res.status(200).json(users);
});

/**
 * @desc GetSingleUser
 * @method GET
 * @route /api/v1/user/:id
 * @access Public
 */
export const getSingleUser = asyncHandler(async (req, res) => {
  // Get id.
  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User Not Found." });
  }

  res.status(200).json(user);
});

/**
 * @desc Create user.
 * @method GET
 * @route /api/v1/user
 * @access Public
 */
export const createUser = asyncHandler(async (req, res) => {
  // Get Data.
  const { name, email, password } = req.body;

  // Validation.
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // If EmailAlreadyExits.
  const isEmail = await User.findOne({ email });
  if (isEmail) return res.status(400).json({ message: "Email already exits." });

  // Create hashPassword.
  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashPassword,
  });
  res.status(200).json(user);
});

/**
 * @desc DeleteUser
 * @method DELETE
 * @route /api/v1/user/:id
 * @access Public
 */
export const deleteUser = asyncHandler(async (req, res) => {
  // Get id.
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({ message: "User Not Found." });
  }

  res.status(200).json({ message: "User deleted successfull.", user });
});

/**
 * @desc UpdateUser
 * @method PUT/PATCH
 * @route /api/v1/user/:id
 * @access Public
 */
export const updateUser = asyncHandler(async (req, res) => {
  // Get Data.
  const { name, email, mobile, gender, password } = req.body;

  // Get id.
  const { id } = req.params;

  // Create hashPassword.
  const hashPassword = await bcrypt.hash(password, 10);

  // updateUser.
  const user = await User.findByIdAndUpdate(
    id,
    {
      name,
      email,
      mobile,
      gender,
      password: hashPassword,
    },
    { new: true }
  );
  res.status(200).json(user);
});
