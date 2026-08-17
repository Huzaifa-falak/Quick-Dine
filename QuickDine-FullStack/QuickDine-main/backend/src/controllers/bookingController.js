import Booking from "../models/Booking.js";
import Restaurant from "../models/Restaurant.js";
import { generateBookingId } from "../utils/bookingId.js";

function dayBounds(input) {
  const d = new Date(input); if (Number.isNaN(d.getTime())) return null;
  const start = new Date(d); start.setHours(0, 0, 0, 0);
  const end = new Date(d); end.setHours(23, 59, 59, 999);
  return { start, end };
}

export async function createBooking(req, res) {
  const { slug, date, time, guests, name, email, phone, occasion = "", specialRequests = "" } = req.body;
  const restaurant = await Restaurant.findOne({ slug, status: "approved" });
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
  if (!restaurant.availableSlots.includes(time)) return res.status(400).json({ message: "Selected time is not available" });
  const bounds = dayBounds(date); if (!bounds) return res.status(400).json({ message: "Invalid booking date" });
  if (bounds.start < new Date(new Date().setHours(0, 0, 0, 0))) return res.status(400).json({ message: "Booking date cannot be in the past" });
  const guestCount = Number(guests);
  if (!guestCount || guestCount < 1 || guestCount > restaurant.totalSeats) return res.status(400).json({ message: "Invalid party size" });
  const existing = await Booking.find({ restaurant: restaurant._id, date: { $gte: bounds.start, $lte: bounds.end }, time, status: "confirmed" });
  const reserved = existing.reduce((sum, b) => sum + b.guests, 0);
  if (reserved + guestCount > restaurant.totalSeats) return res.status(409).json({ message: "Not enough seats remain for this time slot" });
  let bookingId;
  do { bookingId = generateBookingId(); } while (await Booking.exists({ bookingId }));
  const booking = await Booking.create({ user: req.user._id, restaurant: restaurant._id, date: bounds.start, time, guests: guestCount, name, email, phone, occasion, specialRequests, bookingId, status: "confirmed" });
  await booking.populate("restaurant", "name slug location address image cuisine");
  res.status(201).json({ booking });
}

export async function myBookings(req, res) {
  const bookings = await Booking.find({ user: req.user._id }).populate("restaurant", "name slug location address image cuisine").sort({ date: -1, createdAt: -1 });
  res.json({ bookings });
}

export async function cancelBooking(req, res) {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status !== "confirmed") return res.status(400).json({ message: "Only confirmed bookings can be cancelled" });
  booking.status = "cancelled"; await booking.save();
  res.json({ booking });
}

export async function ownerBookings(req, res) {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) return res.json({ bookings: [] });
  const bookings = await Booking.find({ restaurant: restaurant._id }).populate("user", "name email phone").populate("restaurant", "name slug location address image cuisine totalSeats").sort({ date: 1, time: 1 });
  res.json({ bookings });
}

export async function updateBookingStatus(req, res) {
  const { status } = req.body;
  if (!["completed", "cancelled", "confirmed"].includes(status)) return res.status(400).json({ message: "Invalid booking status" });
  const booking = await Booking.findById(req.params.id).populate("restaurant");
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (req.user.role === "owner" && booking.restaurant.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: "You do not manage this booking" });
  booking.status = status; await booking.save();
  await booking.populate("user", "name email phone");
  res.json({ booking });
}
