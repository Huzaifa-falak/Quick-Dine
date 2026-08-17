import slugify from "slugify";
import Restaurant from "../models/Restaurant.js";

export async function uniqueSlug(name, currentId = null) {
  const base = slugify(name, { lower: true, strict: true, trim: true }) || `restaurant-${Date.now()}`;
  let slug = base;
  let i = 1;
  while (await Restaurant.exists({ slug, ...(currentId ? { _id: { $ne: currentId } } : {}) })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}
