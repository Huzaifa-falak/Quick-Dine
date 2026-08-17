import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Restaurant from "./models/Restaurant.js";
import Booking from "./models/Booking.js";
import Review from "./models/Review.js";

const restaurants = [
  { name: "L'Essence", slug: "l-essence", description: "An intimate, Parisian-inspired fine dining chamber wrapped in dark velvet and soft golden candle glow. L'Essence specializes in meticulous plating of haute gastronomy, creating a rich sensory dialogue between modern culinary innovation and classic romance.", cuisine: "French", priceRange: "$$$$", rating: 4.9, reviewCount: 88, location: "Manhattan, NY", address: "115 Greenwich St, New York, NY 10006", image: "/restaurant_5.png", chef: "Jean-Luc Picard", tags: ["Romantic", "Velvet Booths", "Candlelit", "Haute Cuisine"], availableSlots: ["18:00","19:00","20:00","21:00","22:00"], featured: true, exclusive: false, totalSeats: 45 },
  { name: "Terraza Cielo", slug: "terraza-cielo", description: "A sun-drenched rooftop oasis celebrating Italian and Mediterranean lifestyles. Featuring floor-to-ceiling foliage, white marble bistro tables, and panoramic skyline views, Terraza Cielo serves hand-crafted pastas and coastal seafood paired with bright botanical cocktails.", cuisine: "Italian", priceRange: "$$$", rating: 4.7, reviewCount: 205, location: "Manhattan, NY", address: "244 Fifth Ave Rooftop, New York, NY 10001", image: "/restaurant_3.jpg", chef: "Elena Rossi", tags: ["Rooftop", "Skyline Views", "Handmade Pasta", "Craft Cocktails"], availableSlots: ["12:00","13:00","17:00","18:00","19:00","20:00","21:00"], featured: true, exclusive: false, totalSeats: 30 },
  { name: "Kuro Omakase", slug: "kuro-omakase", description: "An atmospheric, moody sanctuary of premium Japanese gastronomy. Seated at a dark, polished basalt-stone counter, guests experience a deeply focused sushi omakase. Chef Kenji Sato translates the freshest seasonal ingredients directly from Tokyo's fish markets into elegant, edible poetry.", cuisine: "Japanese", priceRange: "$$$$", rating: 4.8, reviewCount: 92, location: "Manhattan, NY", address: "18 Orchard St, New York, NY 10002", image: "/restaurant_2.jpg", chef: "Kenji Sato", tags: ["Omakase", "Basalt Counter", "Japanese", "Zen Atmosphere"], availableSlots: ["18:00","20:30"], featured: true, exclusive: true, totalSeats: 25 },
  { name: "Flora Garden", slug: "flora-garden", description: "A bright, airy conservatory celebrating organic, plant-forward gastronomy. Nestled under glass ceilings with floor-to-ceiling botanicals, Flora Garden transforms fresh seasonal crops into delicate, high-end editorial culinary works of art.", cuisine: "Vegetarian", priceRange: "$$$", rating: 4.8, reviewCount: 110, location: "Manhattan, NY", address: "90 Grand St, New York, NY 10013", image: "/restaurant_6.png", chef: "Chloe Mercer", tags: ["Plant-Based", "Glasshouse", "Organic", "Bright & Airy"], availableSlots: ["11:30","13:00","14:30","17:30","19:00","20:30"], featured: false, exclusive: false, totalSeats: 40 },
  { name: "Ember Grille", slug: "ember-grille", description: "An upscale modern steakhouse with exposed brick walls, leather booths, and warm, industrial-chic pendant lighting. Offering Prime dry-aged cuts grilled over live hickory and cherrywood embers. Gourmet dining elevated into a sophisticated nocturnal experience.", cuisine: "Steakhouse", priceRange: "$$$$", rating: 4.6, reviewCount: 142, location: "Manhattan, NY", address: "320 Bowery, New York, NY 10012", image: "/restaurant_1.png", chef: "Marcus Vance", tags: ["Dry-Aged Beef", "Wood Fire", "Moody Lighting", "Wine Room"], availableSlots: ["17:00","18:00","19:00","20:00","21:00","22:00"], featured: false, exclusive: false, totalSeats: 35 },
  { name: "L'Artiste", slug: "l-artiste", description: "An avant-garde journey through modern French gastronomy. L'Artiste blends classic French culinary foundations with contemporary visual artistry, resulting in a sensory dining experience that is both theatrical and deeply satisfying. Set in a gorgeous high-ceilinged room with minimal charcoal and gold design language.", cuisine: "French", priceRange: "$$$$", rating: 4.9, reviewCount: 124, location: "Manhattan, NY", address: "420 Mercer St, New York, NY 10003", image: "/restaurant_4.png", chef: "Jean-Pierre Dubois", tags: ["Michelin Star", "Fine Dining", "Tasting Menu", "Romantic"], availableSlots: ["17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30"], featured: true, exclusive: true, totalSeats: 20 },
  { name: "The Garden Room", slug: "the-garden-room", description: "A new botanical dining room with a modern seasonal menu and intimate evening atmosphere.", cuisine: "French", priceRange: "$$$", rating: 0, reviewCount: 0, location: "Manhattan, NY", address: "55 Hudson St, New York, NY 10013", image: "/restaurant_7.png", chef: "Marc Dubois", tags: ["New", "Seasonal"], availableSlots: ["18:00","19:00","20:00"], featured: false, exclusive: false, totalSeats: 30, status: "pending" }
];

async function upsertUser(email, data) {
  let user = await User.findOne({ email });
  if (!user) user = await User.create(data);
  return user;
}

await connectDB();
const owner = await upsertUser(process.env.OWNER_EMAIL || "owner@example.com", { name: "Alex Mercer", email: process.env.OWNER_EMAIL || "owner@example.com", password: process.env.OWNER_PASSWORD || "Owner@123", phone: "+01234567788", role: "owner" });
await upsertUser(process.env.ADMIN_EMAIL || "admin@quickdine.com", { name: "QuickDine Admin", email: process.env.ADMIN_EMAIL || "admin@quickdine.com", password: process.env.ADMIN_PASSWORD || "Admin@123", role: "admin" });
const guest = await upsertUser("alex@example.com", { name: "Emily Watson", email: "alex@example.com", password: "User@123", phone: "+01234567788", role: "user" });

for (const data of restaurants) {
  await Restaurant.updateOne({ slug: data.slug }, { $set: { ...data, owner: owner._id, status: data.status || "approved" } }, { upsert: true });
}

const lEssence = await Restaurant.findOne({ slug: "l-essence" });
if (!(await Booking.exists({ bookingId: "GR-71B448A7" }))) {
  const date = new Date(); date.setDate(date.getDate() + 3); date.setHours(0,0,0,0);
  await Booking.create({ user: guest._id, restaurant: lEssence._id, date, time: "22:00", guests: 2, name: guest.name, email: guest.email, phone: guest.phone, status: "confirmed", bookingId: "GR-71B448A7" });
}

for (const item of [
  ["Emily Watson", 5, "Absolutely phenomenal experience! The ambiance was perfect, and the food was cooked to perfection. A must-visit!"],
  ["Marcus Vance", 4, "The signature dishes were incredible and the staff was extremely attentive. Will definitely come back for another dinner."],
  ["Sophia Loren", 5, "Every course of the tasting menu was a delightful surprise. The pairings were exquisite. High-end dining at its finest."]
]) {
  const reviewUser = await upsertUser(`${item[0].toLowerCase().replace(/ /g, ".")}@example.com`, { name: item[0], email: `${item[0].toLowerCase().replace(/ /g, ".")}@example.com`, password: "Guest@123", role: "user" });
  if (!(await Review.exists({ restaurant: lEssence._id, user: reviewUser._id }))) await Review.create({ restaurant: lEssence._id, user: reviewUser._id, rating: item[1], comment: item[2], visitedDate: new Date() });
}

console.log("QuickDine seed complete.");
console.log(`Admin: ${process.env.ADMIN_EMAIL || "admin@quickdine.com"} / ${process.env.ADMIN_PASSWORD || "Admin@123"}`);
console.log(`Owner: ${process.env.OWNER_EMAIL || "owner@example.com"} / ${process.env.OWNER_PASSWORD || "Owner@123"}`);
console.log("User: alex@example.com / User@123");
await mongoose.disconnect();
