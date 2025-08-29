import express from "express";
import { getProductDetailsController, getProductsController } from "../controller/productController.js";

var router = express.Router();

// GET PRODUCTS
router.route("/getProducts").get(getProductsController); 

// GET PRODUCT DETAILS
router.route("/getProductDetails").get(getProductDetailsController);  


export default router;
