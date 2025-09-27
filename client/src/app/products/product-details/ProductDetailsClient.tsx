// src/pages/product/ProductDetailsClient.tsx
import { Minus, Plus } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { addToCartThunk } from "../../../store/thunks/cartThunks";
import type { CartData } from "../../../store/types/cart";
import type { AppDispatch } from "../../../store/store";
import {
  selectProduct,
  selectProductLoading,
  selectProductError,
} from "../../../store/slices/productSlice";
import { fetchProductByIdThunk } from "../../../store/thunks/productThunks";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import LoginForm from "../../../components/items/loginForm";
import SignupModal from "../../../components/SignupModal";

/** Image with shimmer skeleton + async decode */
const ImageWithSkeleton: React.FC<{
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // if true, fetchPriority="high"
}> = ({ src, alt, className, width, height, priority }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.src = src;
    if (img.decode) {
      img
        .decode()
        .then(() => {
          if (!cancelled) setLoaded(true);
        })
        .catch(() => {
          if (!cancelled) setLoaded(true);
        });
    } else {
      img.onload = () => !cancelled && setLoaded(true);
      img.onerror = () => !cancelled && setLoaded(true);
    }
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div className={`relative ${className || ""}`}>
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse rounded-lg bg-[linear-gradient(110deg,#f3f4f6,45%,#e5e7eb,55%,#f3f4f6)] bg-[length:200%_100%]"
          aria-hidden
        />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as any } : {})}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default function ProductDetailsClient() {
  const productID = useParams<{ id: string }>().id;
  const dispatch = useDispatch<AppDispatch>();

  // Gallery/UI state
  const [currentImage, setCurrentImage] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const productDetails = useSelector(selectProduct);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);

  // quick check; we still re-check right before API call
  const isLoggedIn = useMemo(() => !!localStorage.getItem("auth_token"), []);

  function calculateDiscount(originalPrice: number, discountedPrice: number): string {
    if (originalPrice <= 0 || discountedPrice < 0 || discountedPrice > originalPrice) {
      return "0";
    }
    const discountPercentage = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return discountPercentage.toFixed(2);
  }

  const handleQuantityChange = (increment: boolean) => {
    if (increment) setQuantity((prev) => prev + 1);
    else if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleImageChange = (src: string, index: number) => {
    setCurrentImage(src);
    setActiveIndex(index);
  };

  const openLogin = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };
  const openSignup = () => {
    setAuthMode("signup");
    setShowAuthModal(true);
  };

  const handleAddToCart = async () => {
    // If not logged in, open login popup
    if (!localStorage.getItem("auth_token")) {
      openLogin();
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color.");
      return;
    }

    const productPayload: CartData = {
      productId: productID!,
      size: selectedSize,
      color: selectedColor,
      quantity,
    };

    try {
      await dispatch(addToCartThunk(productPayload)).unwrap();
      toast.success("Added to cart");
    } catch (err) {
      const message = String(err || "");
      if (/not logged in|auth|token/i.test(message)) {
        openLogin();
        return;
      }
      toast.error(message || "Something went wrong");
    }
  };

  // Fetch product and go to top
  useEffect(() => {
    if (productID) {
      dispatch(fetchProductByIdThunk(productID));
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [productID, dispatch]);

  // Prepare gallery images, preload others
  useEffect(() => {
    if (productDetails?.image?.length) {
      setCurrentImage(productDetails.image[0]);
      setActiveIndex(0);
      productDetails.image.slice(1).forEach((src: string) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [productDetails]);

  return (
    <div className="min-h-screen">
      <div className="max-w-none mx-auto px-4 lg:px-10 py-4 md:py-8">
        <main className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Product Gallery */}
          <section className="w-full">
            <div className="w-full">
              <ImageWithSkeleton
                src={currentImage || productDetails?.image?.[0] || "/placeholder.png"}
                alt={productDetails?.productName || "Product"}
                width={700}
                height={700}
                priority
                className="w-full max-w-[420px] md:max-w-[520px] mx-auto aspect-square"
              />

              <div className="flex gap-2 md:gap-4 p-2 md:p-4 overflow-x-auto">
                {(productDetails?.image || []).map((thumb: string, idx: number) => (
                  <button
                    type="button"
                    key={`${thumb}-${idx}`}
                    className={`min-w-[60px] w-[60px] h-[60px] md:w-20 md:h-20 overflow-hidden rounded-lg cursor-pointer border ${
                      idx === activeIndex
                        ? "ring-2 ring-black border-transparent"
                        : "border-gray-200 hover:border-black"
                    }`}
                    onClick={() => handleImageChange(thumb, idx)}
                  >
                    <ImageWithSkeleton
                      src={thumb}
                      alt={`${productDetails?.productName || "Product"} thumbnail ${idx + 1}`}
                      width={160}
                      height={160}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Product Details */}
          <section className="px-0 md:px-4">
            <div>
              <h1 className="text-xl md:text-2xl leading-7 md:leading-8 font-semibold mb-2">
                {productDetails?.productName || "Product Name"}
              </h1>

              {loading ? (
                <div className="h-20 rounded-md animate-pulse bg-gray-100" />
              ) : (
                <div
                  className="text-gray-600 text-sm md:text-base mb-4"
                  dangerouslySetInnerHTML={{
                    __html: productDetails?.description || "<p>Product Description</p>",
                  }}
                />
              )}

              <div className="mb-4 md:mb-6">
                <div className="text-gray-600 text-sm mb-1">Total Price</div>
                <div className="flex items-center">
                  <div className="text-xl md:text-2xl leading-8 font-bold">
                    ₹ {productDetails?.price ?? "—"}
                  </div>
                  <div className="text-gray-500 text-sm ml-2">
                    (
                    {calculateDiscount(
                      Number(productDetails?.price ?? 0),
                      Number(productDetails?.discount ?? 0)
                    )}
                    ) % off
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div>
              {/* Sizes */}
              <div className="mb-4 md:mb-6">
                <div className="text-gray-600 text-sm mb-2">Available Size:</div>
                <div className="flex flex-wrap gap-2 md:gap-x-4">
                  {(productDetails?.sizes || []).map((size) => (
                    <button
                      type="button"
                      key={size._id}
                      className={`w-8 h-8 md:w-10 md:h-10 border flex items-center justify-center rounded-lg active:scale-95 transition-transform ${
                        selectedSize === size.size
                          ? "bg-black text-white border-black"
                          : "hover:border-black"
                      }`}
                      onClick={() => setSelectedSize(size.size)}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-4 md:mb-6">
                <div className="text-gray-600 text-sm mb-2">Color</div>
                <div className="flex flex-wrap gap-4 md:gap-x-6">
                  {(productDetails?.color?.split(",") || []).map((item) => (
                    <button
                      type="button"
                      key={item}
                      className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
                      onClick={() => setSelectedColor(item)}
                    >
                      <span
                        className={`w-6 h-6 md:w-8 md:h-8 border rounded-full ${
                          selectedColor === item ? "ring-2 ring-offset-2 ring-black" : ""
                        }`}
                        style={{ backgroundColor: item }}
                      />
                      <span
                        className={`text-xs md:text-sm ${
                          selectedColor === item ? "text-black" : "text-gray-500"
                        }`}
                      >
                        {item}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4 md:mb-6">
                <div className="text-gray-600 text-sm mb-2">Quantity</div>
                <div className="bg-[#EFEFEF] p-1.5 rounded-lg flex items-center gap-x-2 w-fit">
                  <button
                    className="w-7 h-7 md:w-8 md:h-8 border flex items-center justify-center rounded-lg bg-[#D9D9D9] active:scale-95"
                    onClick={() => handleQuantityChange(false)}
                  >
                    <Minus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <div className="w-5 md:w-6 text-center">{quantity}</div>
                  <button
                    className="w-7 h-7 md:w-8 md:h-8 border flex items-center justify-center rounded-lg bg-[#D9D9D9] active:scale-95"
                    onClick={() => handleQuantityChange(true)}
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="gap-y-1 md:gap-y-2 mb-4 md:mb-6">
              {loading ? (
                <div className="h-10 rounded-md animate-pulse bg-gray-100" />
              ) : (
                <div className="flex items-start">
                  <i className="ti ti-check mr-2 mt-1 text-green-500" />
                  <div
                    className="text-gray-600 text-sm md:text-base"
                    dangerouslySetInnerHTML={{
                      __html: productDetails?.productDetails || "",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-x-3 md:gap-x-4 sticky bottom-0 md:relative bg-white py-4 md:py-0">
              <button
                className="flex-1 bg-black text-white border py-2.5 md:py-3 px-3 text-sm md:text-base rounded-lg hover:bg-gray-50 active:scale-95"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>
            </div>
          </section>
        </main>

        {/* Optional error display (kept commented) */}
        {/* {error && (
          <div className="p-4 my-4 text-sm text-red-800 rounded-lg bg-red-50">
            <span className="font-medium">Something went wrong:</span> {error}
          </div>
        )} */}
      </div>

      {/* Auth Modal — toggles between Login and Signup */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {authMode === "login" ? "Login" : "Sign Up"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {authMode === "login" ? (
              <LoginForm
                signupClick={() => setAuthMode("signup")}
                onSuccess={() => setShowAuthModal(false)}
              />
            ) : (
              <SignupModal
                onClose={() => setShowAuthModal(false)}
                onBackToLogin={() => setAuthMode("login")}
              />
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
