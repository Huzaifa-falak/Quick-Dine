import { Router } from "express";
import { authorize, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createRestaurant, createReview, featuredRestaurants, getAvailability, getRestaurantBySlug, getReviews, listRestaurants, ownerRestaurant, updateOwnerRestaurant } from "../controllers/restaurantController.js";

const router = Router();
router.get("/featured", asyncHandler(featuredRestaurants));
router.get("/", asyncHandler(listRestaurants));
router.get("/owner/profile", protect, authorize("owner"), asyncHandler(ownerRestaurant));
router.post("/", protect, authorize("owner"), upload.single("image"), asyncHandler(createRestaurant));
router.put("/:id", protect, authorize("owner"), upload.single("image"), asyncHandler(updateOwnerRestaurant));
router.get("/:id/availability", asyncHandler(getAvailability));
router.get("/:id/reviews", asyncHandler(getReviews));
router.post("/:id/reviews", protect, authorize("user", "owner"), asyncHandler(createReview));
router.get("/:slug", asyncHandler(getRestaurantBySlug));
export default router;
