import Restaurant from "../models/Restaurant.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import { uniqueSlug } from "../utils/slug.js";

const publicQuery = { status: "approved" };

function normalizeRestaurantPayload(body) {
  return {
    name: body.name,
    description: body.description,
    cuisine: body.cuisine,
    priceRange: body.priceRange,
    location: body.location,
    address: body.address,
    chef: body.chef || "",
    tags: Array.isArray(body.tags) ? body.tags : String(body.tags || "").split(",").map((v) => v.trim()).filter(Boolean),
    availableSlots: Array.isArray(body.availableSlots)
      ? body.availableSlots
      : String(body.availableSlots || "").split(",").map((v) => v.trim()).filter(Boolean),
    totalSeats: Number(body.totalSeats || 20),
  };
}

function restaurantResponse(r) {
  const x = r.toObject ? r.toObject() : r;
  return x;
}

export async function listRestaurants(req, res) {
  const { search, location, cuisine, priceRange, sort } = req.query;
  const query = { ...publicQuery };
  if (search) query.$or = [{ name: { $regex: search, $options: "i" } }, { cuisine: { $regex: search, $options: "i" } }, { tags: { $regex: search, $options: "i" } }];
  if (location) query.location = { $regex: location, $options: "i" };
  if (cuisine) query.cuisine = { $in: String(cuisine).split(",").map((v) => new RegExp(`^${v.trim()}$`, "i")) };
  if (priceRange) query.priceRange = { $in: String(priceRange).split(",") };
  let q = Restaurant.find(query).populate("owner", "name email");
  if (sort === "price_low") q = q.sort({ priceRange: 1, createdAt: -1 });
  else if (sort === "price_high") q = q.sort({ priceRange: -1, createdAt: -1 });
  else q = q.sort({ createdAt: -1 });
  const restaurants = await q;
  res.json({ restaurants: restaurants.map(restaurantResponse) });
}

export async function featuredRestaurants(req, res) {
  const restaurants = await Restaurant.find({ ...publicQuery, featured: true }).sort({ rating: -1, createdAt: -1 }).limit(6);
  res.json({ restaurants });
}

export async function getRestaurantBySlug(req, res) {
  const restaurant = await Restaurant.findOne({ slug: req.params.slug, ...publicQuery }).populate("owner", "name email");
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
  res.json({ restaurant: restaurantResponse(restaurant) });
}

export async function getAvailability(req, res) {
  const restaurant = await Restaurant.findOne({ _id: req.params.id, ...publicQuery });
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
  const date = new Date(req.query.date);
  if (Number.isNaN(date.getTime())) return res.status(400).json({ message: "A valid date is required" });
  const start = new Date(date); start.setHours(0, 0, 0, 0);
  const end = new Date(date); end.setHours(23, 59, 59, 999);
  const bookings = await Booking.find({ restaurant: restaurant._id, date: { $gte: start, $lte: end }, status: "confirmed" }).select("time guests");
  const map = new Map();
  for (const b of bookings) map.set(b.time, (map.get(b.time) || 0) + b.guests);
  const requestedGuests = Math.max(Number(req.query.guests) || 1, 1);
  const isToday = start.toDateString() === new Date().toDateString();
  const now = new Date();
  const result = restaurant.availableSlots.map((time) => {
    const booked = map.get(time) || 0;
    const availableSeats = Math.max(restaurant.totalSeats - booked, 0);
    const [hours, minutes] = time.split(":").map(Number);
    const slotAlreadyPassed = isToday && (hours < now.getHours() || (hours === now.getHours() && minutes <= now.getMinutes()));
    return { time, availableSeats, isAvailable: !slotAlreadyPassed && availableSeats >= requestedGuests };
  });
  res.json({ availability: result });
}

export async function ownerRestaurant(req, res) {
  const restaurant = await Restaurant.findOne({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ restaurant: restaurant ? restaurantResponse(restaurant) : null });
}

export async function createRestaurant(req, res) {
  const existing = await Restaurant.findOne({ owner: req.user._id });
  if (existing) return res.status(409).json({ message: "You already have a restaurant profile" });
  const payload = normalizeRestaurantPayload(req.body);
  if (!payload.name || !payload.description || !payload.cuisine || !payload.location || !payload.address) return res.status(400).json({ message: "Please complete all required restaurant fields" });
  const restaurant = await Restaurant.create({ ...payload, owner: req.user._id, slug: await uniqueSlug(payload.name), image: req.file ? `/uploads/${req.file.filename}` : "/restaurant_5.png", status: "pending" });
  res.status(201).json({ restaurant: restaurantResponse(restaurant) });
}

export async function updateOwnerRestaurant(req, res) {
  const restaurant = await Restaurant.findOne({ _id: req.params.id, owner: req.user._id });
  if (!restaurant) return res.status(404).json({ message: "Restaurant profile not found" });
  const payload = normalizeRestaurantPayload(req.body);
  if (payload.name && payload.name !== restaurant.name) {
    restaurant.slug = await uniqueSlug(payload.name, restaurant._id);
    restaurant.name = payload.name;
  }
  for (const key of ["description", "cuisine", "priceRange", "location", "address", "chef", "tags", "availableSlots", "totalSeats"]) {
    if (payload[key] !== undefined) restaurant[key] = payload[key];
  }
  if (req.file) restaurant.image = `/uploads/${req.file.filename}`;
  restaurant.status = "pending";
  await restaurant.save();
  res.json({ restaurant: restaurantResponse(restaurant) });
}

export async function getReviews(req, res) {
  const reviews = await Review.find({ restaurant: req.params.id }).populate("user", "name").sort({ createdAt: -1 });
  res.json({ reviews: reviews.map((r) => ({ ...r.toObject(), userName: r.user?.name || "QuickDine Guest" })) });
}

export async function createReview(req, res) {
  const { rating, comment, visitedDate } = req.body;
  const restaurant = await Restaurant.findOne({ _id: req.params.id, status: "approved" });
  if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
  const review = await Review.create({ restaurant: restaurant._id, user: req.user._id, rating, comment, visitedDate: visitedDate || new Date() });
  const aggregate = await Review.aggregate([{ $match: { restaurant: restaurant._id } }, { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }]);
  restaurant.rating = Number((aggregate[0]?.avg || 0).toFixed(1));
  restaurant.reviewCount = aggregate[0]?.count || 0;
  await restaurant.save();
  await review.populate("user", "name");
  res.status(201).json({ review: { ...review.toObject(), userName: review.user?.name } });
}
