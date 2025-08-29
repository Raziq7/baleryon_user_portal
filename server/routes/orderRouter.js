import express from "express";
import { createOrderController, fetchAddressController, getAllOrderedListController, markOrderAsDelivered, orderTrackingDetailsController, updateOrderPayment } from "../controller/orderController.js";
import { verifyToken } from "../middlewares/tokenVerification.js";

var router = express.Router();

// create order
router.route("/create-order").post(verifyToken, createOrderController);


router.get('/address', verifyToken, fetchAddressController); // Use protect middleware for authentication


router.put("/orderPaymentUpdate", verifyToken, updateOrderPayment);

router.put("/markOrderDelivered", verifyToken, markOrderAsDelivered);

router.get("/getAllOrderedList",verifyToken, getAllOrderedListController)

router.get("/orderTrackingDetails",verifyToken, orderTrackingDetailsController)


// router.route("/razorpay-webhook").post(verifyToken,razorpayWebhookController);


export default router;