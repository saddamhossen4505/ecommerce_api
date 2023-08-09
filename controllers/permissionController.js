import asyncHandler from "express-async-handler";
import Permission from "../models/PermissionModels.js";
import { createSlug } from "../helpers/createSlug.js";

/**
 * @desc GetAllPermission
 * @method GET
 * @route /api/v1/permission
 * @access Public
 */
export const getAllPermission = asyncHandler(async (req, res) => {
  const permissions = await Permission.find();

  if (permissions.length === 0) {
    return res.status(404).json({ message: "" });
  }

  res.status(200).json(permissions);
});

/**
 * @desc GetSinglePermission
 * @method GET
 * @route /api/v1/permission/:id
 * @access Public
 */
export const getSinglePermission = asyncHandler(async (req, res) => {
  // Get id.
  const { id } = req.params;
  const permission = await Permission.findById(id);

  if (!permission) {
    return res.status(404).json({ message: "Permission not found." });
  }

  res.status(200).json(permission);
});

/**
 * @desc Create Permission.
 * @method POST
 * @route /api/v1/permission
 * @access Public
 */
export const createPermission = asyncHandler(async (req, res) => {
  // Get Data.
  const { name } = req.body;

  // Validation.
  if (!name) {
    return res.status(400).json({ message: "Permission name is required." });
  }

  // If RoleAlreadyExits.
  const isPermission = await Permission.findOne({ name });
  if (isPermission)
    return res.status(400).json({ message: "Permission already exits." });

  const permission = await Permission.create({
    name,
    slug: createSlug(name),
  });
  res
    .status(200)
    .json({ permission, message: "Permission created successful." });
});

/**
 * @desc DeletePermission
 * @method DELETE
 * @route /api/v1/permission/:id
 * @access Public
 */
export const deletePermission = asyncHandler(async (req, res) => {
  // Get id.
  const { id } = req.params;
  const permission = await Permission.findByIdAndDelete(id);

  if (!permission) {
    return res.status(404).json({ message: "Permission not found." });
  }

  res
    .status(200)
    .json({ message: "Permission deleted successfull.", permission });
});

/**
 * @desc UpdatePermission
 * @method PUT/PATCH
 * @route /api/v1/permission/:id
 * @access Public
 */
export const updatePermission = asyncHandler(async (req, res) => {
  // Get Data.
  const { name } = req.body;

  // Get id.
  const { id } = req.params;

  // updateUser.
  const permission = await Permission.findByIdAndUpdate(
    id,
    {
      name,
      slug: createSlug(name),
    },
    { new: true }
  );
  res
    .status(200)
    .json({ permission, message: "Permission update successful." });
});

/**
 * @desc UpdatePermissionStatus
 * @method PUT/PATCH
 * @route /api/v1/permission/status:id
 * @access Public
 */
export const updatePermissionStatus = asyncHandler(async (req, res) => {
  // Get id.
  const { id } = req.params;
  // Get Data.
  const { status } = req.body;

  // updateUser.
  const permissionStatus = await Permission.findByIdAndUpdate(
    id,
    {
      status: !status,
    },
    { new: true }
  );
  res
    .status(200)
    .json({ message: "Status update successful.", permissionStatus });
});
