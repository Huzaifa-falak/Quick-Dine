import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    date: { type: Date, required: true, index: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1, max: 50 },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    occasion: { type: String, default: "" },
    specialRequests: { type: String, default: "" },
    status: { type: String, enum: ["confirmed", "completed", "cancelled"], default: "confirmed", index: true },
    bookingId: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
