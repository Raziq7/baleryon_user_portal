import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import sanitizedConfig from "../config.js";

// @desc    Get paginated list of products
// @route   GET /api/products
// @access  Public
export const getProductsController = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { category, color, minPrice, maxPrice } = req.query;

    const filter = {};

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by color (supports comma-separated values)
    if (color) {
      const colorArray = color.split(",").map((c) => c.trim().toUpperCase());
      filter.color = { $regex: colorArray.join("|"), $options: "i" };
    }

    // Filter by price
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Fetch products with applied filters
    const products = await Product.find(filter).skip(skip).limit(limit);

    // If no products found after applying filters, return a message
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the given filters" });
    }

    // Get total products count based on the filter
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      products,
      page,
      totalPages,
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
