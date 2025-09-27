// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store/store";
import { initFromStorage } from "./store/slices/authSlice"; // <-- add this action

import Home from "./app/products/OurCollection";
import "./index.css";
import Header from "./components/layout/header";
import ShopPage from "./app/products/ShopPage";
import About from "./app/about-us/page";
import Footer from "./components/layout/footer";
import ContactUsPage from "./app/contact-us/page";
import ProductDetailsClient from "./app/products/product-details/ProductDetailsClient";
import WishlistPage from "./app/mywishlist/page";
import CheckoutPage from "./app/checkout/page";
import Privacy from "./app/privacy-policy/page";
import TermsCondition from "./app/terms-condition/page";
import CancelRefund from "./app/cancel-refund/page";
import ShippingPolicy from "./app/shipping-policy/page";
import UserOrdersPage from "./app/orderList/UserOrdersPage";
import Profile from "./app/profile/Profile";
import EditProfilePage from "./app/profile/edit/EditProfilePage";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // hydrate Redux auth from localStorage on first render
    dispatch(initFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ShopPage />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route
          path="/products/product-details/:id"
          element={<ProductDetailsClient />}
        />
        <Route path="/mywishlist" element={<WishlistPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/terms-condition" element={<TermsCondition />} />
        <Route path="/cancel-refund" element={<CancelRefund />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/orderList" element={<UserOrdersPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
