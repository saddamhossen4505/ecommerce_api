import asyncHandler from "express-async-handler";
import Role from "../models/RoleModels.js";
import bcrypt from "bcrypt";
import { createSlug } from "../helpers/createSlug.js";

/**
 * @desc GetAllRole
 * @method GET
 * @route /api/v1/role
 * @access Public
 */
export const getAllRole = asyncHandler(async (req, res) => {
  const roles = await Role.find();

  if (roles.length === 0) {
    return res.status(404).json({ message: "No roles found." });
  }

  res.status(200).json(roles);
});

/**
 * @desc GetSingleRole
 * @method GET
 * @route /api/v1/role/:id
 * @access Public
 */
export const getSingleRole = asyncHandler(async (req, res) => {
  // Get id.
  const { id } = req.params;
  const role = await Role.findById(id);

  if (!role) {
    return res.status(404).json({ message: "Role not found." });
  }

  res.status(200).json(role);
});

/**
 * @desc Create Role.
 * @method POST
 * @route /api/v1/role
 * @access Public
 */
export const createRole = asyncHandler(async (req, res) => {
  // Get Data.
  const { name } = req.body;

  // Validation.
  if (!name) {
    return res.status(400).json({ message: "Role name is required." });
  }

  // If RoleAlreadyExits.
  const isRole = await Role.findOne({ name });
  if (isRole) return res.status(400).json({ message: "Role already exits." });

  const role = await Role.create({
    name,
    slug: createSlug(name),
  });
  res.status(200).json(role);
});

/**
 * @desc DeleteRole
 * @method DELETE
 * @route /api/v1/role/:id
 * @access Public
 */
export const deleteRole = asyncHandler(async (req, res) => {
  // Get id.
  const { id } = req.params;
  const role = await Role.findByIdAndDelete(id);

  if (!role) {
    return res.status(404).json({ message: "Role not found." });
  }

  res.status(200).json({ message: "Role deleted successfull.", role });
});

/**
 * @desc UpdateRole
 * @method PUT/PATCH
 * @route /api/v1/put/:id
 * @access Public
 */
export const updateRole = asyncHandler(async (req, res) => {
  // Get Data.
  const { name } = req.body;

  // Get id.
  const { id } = req.params;

  // updateUser.
  const role = await Role.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
    },
    { new: true }
  );
  res.status(200).json(role);
});
