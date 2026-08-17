import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, maxlength: 3000 },
    cuisine: { type: String, required: true, trim: true, index: true },
    priceRange: { type: String, enum: ["$", "$$", "$$$", "$$$$"], default: "$$" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    location: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    chef: { type: String, trim: true, default: "" },
    tags: [{ type: String, trim: true }],
    availableSlots: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    exclusive: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    totalSeats: { type: Number, required: true, min: 1, max: 10000 },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
