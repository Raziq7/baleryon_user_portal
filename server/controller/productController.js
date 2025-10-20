import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import sanitizedConfig from "../config.js";

// @desc    Get paginated list of products (with filters & sort)
// @route   GET /api/user/product/getProducts
// @access  Public
export const getProductsController = asyncHandler(async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { category, color, minPrice, maxPrice, sort } = req.query;

    const filter = { isActive: true };
    const andParts = [];

    // ---- Category filter (safe for mixed schema) ----
    if (category) {
      const catList = String(category)
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      if (catList.length) {
        andParts.push({
          $or: [
            { "category.slug": { $in: catList } },
            { "subcategory.slug": { $in: catList } },
            { "subSubcategory.slug": { $in: catList } },

            // legacy string fields guarded by type
            {
              $expr: {
                $and: [
                  { $eq: [{ $type: "$category" }, "string"] },
                  { $in: ["$category", catList] },
                ],
              },
            },
            {
              $expr: {
                $and: [
                  { $eq: [{ $type: "$subcategory" }, "string"] },
                  { $in: ["$subcategory", catList] },
                ],
              },
            },
            {
              $expr: {
                $and: [
                  { $eq: [{ $type: "$subSubcategory" }, "string"] },
                  { $in: ["$subSubcategory", catList] },
                ],
              },
            },
          ],
        });
      }
    }

    // ---- Color filter (legacy CSV or array "colors") ----
    if (color) {
      const colorList = String(color)
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter(Boolean);
      if (colorList.length) {
        andParts.push({
          $or: [
            { color: { $regex: colorList.join("|"), $options: "i" } },
            { colors: { $in: colorList } },
          ],
        });
      }
    }

    // ---- Price filter ----
    const priceQuery = {};
    if (minPrice) priceQuery.$gte = Number(minPrice);
    if (maxPrice) priceQuery.$lte = Number(maxPrice);
    if (Object.keys(priceQuery).length) andParts.push({ price: priceQuery });

    if (andParts.length) filter.$and = andParts;

    // ---- Sorting ----
    const sortSpec =
      String(sort) === "price_asc"
        ? { price: 1 }
        : String(sort) === "price_desc"
        ? { price: -1 }
        : { createdAt: -1 };

    const [products, totalProducts] = await Promise.all([
      Product.find(filter).sort(sortSpec).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      products,
      pageNo: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    console.error("Error in product filter:", error);
    res.status(500).json({ message: "Server Error" });
  }
});



// @desc    Get product details by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductDetailsController = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.query.id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
