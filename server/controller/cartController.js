import asyncHandler from "express-async-handler";
import { Cart } from "../models/Cart.js";
import User from "../models/User.js";

// @desc    Get the user's cart with product details
// @route   GET /api/cart
// @access  Private (Authenticated users only)
export const getCartController = asyncHandler(async (req, res) => {
  try {
    // Retrieve the user from the database using the user ID from the JWT token
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the cart associated with the user and populate product details for each item
    const cart = await Cart.findOne({ userId: user._id })
      .populate('items.productId');  // Populate productId with product details
      
console.log(cart, "cartcartcartcartcartcartcart");

    if (cart) {
      return res.status(200).json(cart);  // Return the populated cart
    }

    // If the cart does not exist, return an empty array
    res.status(200).json([]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching cart", error });
  }
});


// @desc    Add an item to the cart
// @route   POST /api/cart
// @access  Private (Authenticated users only)
export const addToCartController = asyncHandler(async (req, res) => {
  const { productId, size, color } = req.body;

  console.log(req.body, "req.body");
  console.log(req.user?._id, "req.user?._id");


  try {

    const user = await User.findById(req.user?._id);  // assuming user is authenticated

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let cart = await Cart.findOne({ userId: user._id });

    // If the user doesn't have a cart, create a new one
    if (!cart) {
      cart = new Cart({ userId: user._id, items: [] });
    }

    // Find the existing item in the cart with the same productId, size, and color
    const existingItemIndex = cart.items.findIndex(item =>
      item.productId.toString() === productId &&
      item.size === size &&
      item.color === color
    );


    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += 1;
    } else {
      // Otherwise, add the new product with quantity = 1
      cart.items.push({ productId, size, color, quantity: 1 });
    }
    // Save the cart with the updated items
    await cart.save();

    const findCart = await Cart.findOne({ userId: user._id })
    .populate('items.productId'); 

    res.status(200).json(findCart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while adding to cart", error });
  }
});


// @desc    Update the quantity of a product in the cart
// @route   PUT /api/cart/:cartId
// @access  Private (Authenticated users only)

export const updateCartController = asyncHandler(async (req, res) => {

  const { userId } = req.params ;
  const { productId, quantity,cartId } = req.body;

  console.log(req.body, "req.body");
  console.log(userId, "req.query");
  
  try {
    // Find the cart
    const cart = await Cart.findOne({userId:userId});


    if (!cart) return res.status(404).json('Cart not found');
  
    // Find the product in the cart
    const cartItem = cart.items.find(item => item._id.toString() === cartId);
    if (!cartItem) return res.status(404).json('Item not found in cart');
   
    // Update the quantity
    cartItem.quantity = quantity;
  
    // Save the updated cart
    await cart.save();
    
    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    console.log(updatedCart, "updatedCart");

  
    return res.status(200).json(updatedCart);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// @desc    Remove an item from the cart
// @route   DELETE /api/cart/:cartId
// @access  Private (Authenticated users only)
export const removeFromCartController = asyncHandler(async (req, res) => {
  const { cartId } = req.query;
  
  const user = await User.findById(req.user?._id);  // assuming user is authenticated

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Find the user's cart
  const cart = await Cart.findOne({ userId: user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  // Remove the product from the cart
  cart.items = cart.items.filter(item => item._id.toString() !== cartId);

  await cart.save();
  res.status(200).json(cart);
});


// @desc    Clear the user's cart
// @route   DELETE /api/cart
// @access  Private (Authenticated users only)
export const clearCartController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);  // assuming user is authenticated


  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Clear the cart by deleting the cart data from the database
  await Cart.findOneAndDelete({ userId: user._id });

  res.status(200).json({ message: "Cart cleared successfully" });
});
