import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

// GET /api/user/category?flat=true
export const listPublicCategories = asyncHandler(async (req, res) => {
  const { flat } = req.query;

  const docs = await Category.find({ isActive: true }).sort({
    "meta.sort": 1,
    name: 1,
  });

  if (flat === "true") {
    return res.json({ categories: docs });
  }

  // build simple tree
  const byId = new Map();
  docs.forEach((d) =>
    byId.set(String(d._id), { ...d.toObject(), children: [] })
  );
  const roots = [];
  byId.forEach((n) => {
    if (n.parent) {
      const p = byId.get(String(n.parent));
      if (p) p.children.push(n);
    } else {
      roots.push(n);
    }
  });
  const sortFn = (a, b) =>
    (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0) || a.name.localeCompare(b.name);
  const sortRec = (arr) => arr.sort(sortFn).forEach((n) => sortRec(n.children));
  sortRec(roots);

  res.json({ tree: roots });
});
