import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createPermission,
  deletePermission,
  getAllPermission,
  getSinglePermission,
  updatePermission,
  updatePermissionStatus,
} from "../controllers/permissionController.js";

// Init Router.
const router = express.Router();

// Use authMiddleware.
router.use(authMiddleware);

// Routes.
router.route("/").get(getAllPermission).post(createPermission);
router
  .route("/:id")
  .get(getSinglePermission)
  .delete(deletePermission)
  .put(updatePermission)
  .patch(updatePermission);
router.route("/status/:id").put(updatePermissionStatus);

// Export router.
export default router;
