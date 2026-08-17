import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import Booking from "../models/Booking.js";

export async function adminRestaurants(req, res) {
  const restaurants = await Restaurant.find().populate("owner", "name email").sort({ createdAt: -1 });
  res.json({ restaurants });
}

export async function updateRestaurantStatus(req, res) {
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid restaurant status" });
  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("owner", "name email");
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
  res.json({ restaurant });
}

export async function stats(req, res) {
  const [totalUsers, totalOwners, totalRestaurants, totalBookings, latestBookings] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "owner" }),
    Restaurant.countDocuments(),
    Booking.countDocuments(),
    Booking.find().populate("user", "name email").populate("restaurant", "name").sort({ createdAt: -1 }).limit(10),
  ]);
  res.json({ stats: { users: { totalUsers, totalOwners, total: totalUsers + totalOwners }, restaurants: { total: totalRestaurants }, bookings: { total: totalBookings }, latestBookings } });
}
