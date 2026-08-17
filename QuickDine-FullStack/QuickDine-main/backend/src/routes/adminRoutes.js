import { Router } from "express";
import { authorize, protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { adminRestaurants, stats, updateRestaurantStatus } from "../controllers/adminController.js";

const router = Router();
router.use(protect, authorize("admin"));
router.get("/restaurants", asyncHandler(adminRestaurants));
router.patch("/restaurants/:id/status", asyncHandler(updateRestaurantStatus));
router.get("/stats", asyncHandler(stats));
export default router;
