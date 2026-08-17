import { Router } from "express";
import { authorize, protect } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cancelBooking, createBooking, myBookings, ownerBookings, updateBookingStatus } from "../controllers/bookingController.js";

const router = Router();
router.use(protect);
router.get("/my", asyncHandler(myBookings));
router.get("/owner", authorize("owner"), asyncHandler(ownerBookings));
router.post("/", authorize("user", "owner"), asyncHandler(createBooking));
router.patch("/:id/cancel", authorize("user", "owner"), asyncHandler(cancelBooking));
router.patch("/:id/status", authorize("owner", "admin"), asyncHandler(updateBookingStatus));
export default router;
