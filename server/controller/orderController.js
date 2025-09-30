import asyncHandler from "express-async-handler";
import sanitizedConfig from "../config.js";
import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from "../models/User.js";
import { Order } from "../models/Order.js";
import { Address } from "../models/Address.js";
import { Cart } from "../models/Cart.js";

const { RAZOR_KEY_ID,
    RAZOR_KEY_SECRET } = sanitizedConfig;

// Initialize Razorpay instance with your API keys
const razorpay = new Razorpay({
    key_id: RAZOR_KEY_ID, // Replace with your Razorpay Key ID
    key_secret: RAZOR_KEY_SECRET, // Replace with your Razorpay Key Secret
});

// @desc   Create order
// @route   POST /api/user/order/create-order
// @access  Private (Authenticated users only)
export const createOrderController = asyncHandler(async (req, res) => {
    const { amount, currency, address, items } = req.body; // Extract data from the request body

    console.log(items, "itemsitemsitemsitemsitemsitems");
    console.log(amount, "amountamountamountamountamountamount");



    // Ensure required fields are provided
    if (!amount || !currency || !address || !items || items.length === 0) {
        return res.status(400).json({ message: 'Amount, currency, address, and at least one item are required' });
    }

    // Validate address fields
    const { id, name, street, city, state, zip, number } = address;
    if (!street || !city || !state || !zip || !number) {
        return res.status(400).json({ message: 'Complete address is required' });
    }

    try {
        // Verify that the user exists
        const user = await User.findById(req.user?._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let userAddress;

        // If address ID is provided, find the existing address, else create a new one
        if (id) {
            // Find the address by ID and ensure it belongs to the current user
            userAddress = await Address.findOne({ _id: id, userId: user._id });
            if (!userAddress) {
                return res.status(404).json({ message: 'Address not found for the current user' });
            }
        } else {
            // Create a new address if no address ID is provided
            userAddress = new Address({
                userId: user._id,
                name,
                street,
                city,
                state,
                zip,
                number,
            });
            await userAddress.save();
        }

        // Create a Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100),   // Convert to paise (Razorpay accepts amounts in paise)
            currency: currency || 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1, // Auto capture payment
        });

        // Process items to include in the order
        const orderItems = items.map((item) => ({
            productId: item?.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item?.price, // Ensure the price is included
        }));

        // Create a new order in the database and save it
        const newOrder = new Order({
            userId: user._id,
            orderId: razorpayOrder.id,
            amount: amount,
            currency: currency || 'INR',
            address: userAddress._id, // Store the addressId in the Order model
            paymentStatus: 'pending',
            receipt: razorpayOrder.receipt,
            items: orderItems, // Add items to the order
        });

        await newOrder.save();

        // Respond with order details
        res.status(200).json({
            id: razorpayOrder.id,
            amount: razorpayOrder.amount / 100, // Convert back to original amount (in INR or currency)
            currency: razorpayOrder.currency,
            receipt: razorpayOrder.receipt,
            orderId: newOrder._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating payment order' });
    }
});


// @desc    Fetch the user's address
// @route   GET /api/user/address
// @access  Private (Authenticated users only)
export const fetchAddressController = asyncHandler(async (req, res) => {
    try {
        console.log(req.user?._id, "req.user?._id");

        // Ensure the user exists (authenticated check)
        const user = await User.findById(req.user?._id); // Assuming `req.user?._id` is available from authentication middleware
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch the user's address (you can fetch all addresses or just one)
        const addresses = await Address.find({ userId: req.user?._id });

        if (addresses.length === 0) {
            return res.status(404).json({ message: 'No address found for this user' });
        }

        // Send back the addresses
        res.status(200).json(addresses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching address' });
    }
});

//  Update Order Payment Status (PUT)
// @desc    Update Order Payment Status
// @route   PUT /api/user/oraderPaymentUpdate
// @access  Private (Authenticated users only)
export const updateOrderPayment = asyncHandler(async (req, res) => {
    const { orderId, status } = req.body;
console.log(orderId, "orderIdorderIdorderIdorderIdorderIdorderIdorderIdorderIdorderIdorderIdorderId");

    if (!orderId || !status) {
        return res.status(400).json({ message: "Order ID and status are required" });
    }

    const order = await Order.findOne({orderId: orderId});
    console.log(order, "orderorderorderorderorderorderorderorderorder");

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = status === "paid" ? "paid" : "pending"; // Update payment status
    order.isPaid = status === "paid" ? true : false; // Boolean flag

    await order.save();

    //  Remove Purchased Items from Cart
    if (status === "paid") {
        const cart = await Cart.findOne({ userId: order.userId });

        if (cart && cart.items.length > 0) {
            //  Ensure `cart.items` exist before filtering
            console.log(cart, "cartcartcartcartcartcartcartcart");

            cart.items = cart.items.filter(cartItem =>
                order.items.every(orderItem => !orderItem.productId.equals(cartItem.productId))
            );

            await cart.save();
        }
    }

    res.status(200).json({ message: "Order payment status updated successfully", order });
});

//  Mark Order as Delivered (PUT)
// @desc    Update Order Payment Status
// @route   PUT /api/user/deliveryUpdate
// @access  Private (Authenticated users only)
export const markOrderAsDelivered = asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({ message: "Order marked as delivered successfully", order });
});


// @desc    Get All Orders by User ID
// @route   GET /api/user/getAllOrderedList
// @access  Private (Authenticated users only)
export const getAllOrderedListController = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id; // Assuming req.user is populated via authentication middleware

        // Fetch orders for the logged-in user
        const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found" });
        }

        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// @desc    Get order tracking details Controller
// @route   GET /api/user/orderTrackingDetails
// @access  Private (Authenticated users only)
export const orderTrackingDetailsController = asyncHandler(async (req, res) => {
    try {
        const { id } = req.query;

        console.log(id, "Order ID received for tracking");

        // Populate items.productId instead of items.product
        const order = await Order.findById(id).populate("items.productId");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json(order);
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ message: "Server error" });
    }
});
