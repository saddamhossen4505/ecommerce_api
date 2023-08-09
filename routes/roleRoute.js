import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createRole,
  deleteRole,
  getAllRole,
  getSingleRole,
  updateRole,
  updateRoleStatus,
} from "../controllers/roleController.js";

// Init Router.
const router = express.Router();

// Use authMiddleware.
router.use(authMiddleware);

// Routes.
router.route("/").get(getAllRole).post(createRole);
router
  .route("/:id")
  .get(getSingleRole)
  .delete(deleteRole)
  .put(updateRole)
  .patch(updateRole);

router.route("/status/:id").put(updateRoleStatus);

// Export router.
export default router;
