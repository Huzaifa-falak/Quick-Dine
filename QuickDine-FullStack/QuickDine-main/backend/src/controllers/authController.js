import User from "../models/User.js";
import { signToken } from "../utils/token.js";

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export async function register(req, res) {
  const { name, email, password, phone = "", role = "user" } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
  if (!["user", "owner"].includes(role)) return res.status(400).json({ message: "Invalid registration role" });
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: "An account with this email already exists" });
  const user = await User.create({ name, email, password, phone, role });
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password || ""))) return res.status(401).json({ message: "Invalid email or password" });
  res.json({ token: signToken(user), user: publicUser(user) });
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
