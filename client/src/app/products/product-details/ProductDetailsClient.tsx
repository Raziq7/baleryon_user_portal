import { Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { addToCartThunk } from "../../../store/thunks/cartThunks";
import type { CartData } from "../../../store/types/cart";
import type { AppDispatch } from "../../../store/store";
// import { addToCartThunk } from "@/store/thunks/cartThunks";
import {
  selectProduct,
  selectProductLoading,
  selectProductError,
} from "../../../store/slices/productSlice";
import { fetchProductByIdThunk } from "../../../store/thunks/productThunks";

export default function ProductDetailsClient() {
  const productID = useParams<{ id: string }>().id;
  const dispatch = useDispatch<AppDispatch>();

  // const items = useSelector((state: RootState) => state.cart);

  // State management
  const [currentImage, setCurrentImage] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  // const [productDetails, setProductDetails] = useState<ProductDetail>();

  const productDetails = useSelector(selectProduct);
  const error = useSelector(selectProductError);
  const loading = useSelector(selectProductLoading);

  function calculateDiscount(
    originalPrice: number,
    discountedPrice: number
  ): string {
    if (
      originalPrice <= 0 ||
      discountedPrice < 0 ||
      discountedPrice > originalPrice
    ) {
      return "0";
    }

    const discountPercentage =
      ((originalPrice - discountedPrice) / originalPrice) * 100;
    return discountPercentage.toFixed(2);
  }

  // Event handlers
  const handleQuantityChange = (increment: boolean) => {
    if (increment) {
      setQuantity((prev) => prev + 1);
    } else if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleImageChange = (src: string, index: number) => {
    setCurrentImage(src);
    setActiveIndex(index);
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color.");
      return;
    }

    const productPayload: CartData = {
      productId: productID!, // assert non-null
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    };
    try {
      await dispatch(addToCartThunk(productPayload)).unwrap();
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err as string); 
    }
  };

  useEffect(() => {
    if (productID) dispatch(fetchProductByIdThunk(productID));
    // force to top
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [productID, dispatch]);

  return (
    <div className="min-h-screen">
      {/* {error && (
        <div
        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span className="font-medium">Somethink wrong!</span> {error && error}
        </div>
      )} */}

      <div className="max-w-none mx-auto px-4 lg:px-10 py-4 md:py-8">
        <main className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Product Gallery Section */}
          <section className="w-full">
            <div className="w-full">
              <img
                src={currentImage || productDetails?.image[0]}
                alt="Product"
                width={350}
                height={350}
                loading="eager" // Force eager loading
                className="w-full max-w-[350px] mx-auto object-cover rounded-lg"
              />

              <div className="flex gap-2 md:gap-4 p-2 md:p-4 overflow-x-auto">
                {productDetails?.image.map((thumb, idx) => (
                  <div
                    key={idx}
                    className={`min-w-[60px] w-[60px] h-[60px] md:w-20 md:h-20 overflow-hidden rounded-lg cursor-pointer bg-gray-300 ${
                      idx === activeIndex ? "ring-2 ring-black" : ""
                    }`}
                    onClick={() => handleImageChange(thumb, idx)}
                  >
                    <img
                      src={thumb}
                      alt="Product"
                      width={350}
                      height={350}
                      loading="eager"
                      className="w-full max-w-[350px] mx-auto object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Product Details Section */}
          <section className="px-0 md:px-4">
            {/* Product Info */}
            <div>
              <h1 className="text-xl md:text-2xl leading-7 md:leading-8 font-semibold mb-2">
                {productDetails?.productName || "Product Name"}
              </h1>
              <div
                className="text-gray-600 text-sm md:text-base mb-4"
                dangerouslySetInnerHTML={{
                  __html:
                    productDetails?.description || "<p>Product Description</p>",
                }}
              ></div>

              {/* <div className="flex items-center mb-4">
                <div className="text-gray-600 text-sm md:text-base flex gap-2 md:gap-3 items-center">
                  <CommentRatings rating={4} />
                  <span>({"4.1k"}) customer review</span>
                </div>
              </div> */}
              <div className="mb-4 md:mb-6">
                <div className="text-gray-600 text-sm mb-1">Total Price</div>
                <div className="flex items-center">
                  <div className="text-xl md:text-2xl leading-8 font-bold">
                    ₹ {productDetails?.price || "product price"}
                  </div>
                  <div className="text-gray-500 text-sm ml-2">
                    (
                    {calculateDiscount(
                      productDetails?.price || 0,
                      productDetails?.discount || 0
                    )}
                    ) % off
                  </div>
                </div>
              </div>
            </div>

            {/* Product Options */}
            <div>
              {/* Sizes */}
              <div className="mb-4 md:mb-6">
                <div className="text-gray-600 text-sm mb-2">
                  Available Size:
                </div>
                <div className="flex flex-wrap gap-2 md:gap-x-4">
                  {productDetails?.sizes.map((size) => (
                    <div
                      key={size._id}
                      className={`w-8 h-8 md:w-10 md:h-10 border flex items-center justify-center cursor-pointer rounded-lg border-solid active:scale-95 transition-transform ${
                        selectedSize === size.size
                          ? "bg-black text-white"
                          : "hover:border-black"
                      }`}
                      onClick={() => setSelectedSize(size.size)}
                    >
                      {size.size}
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-4 md:mb-6">
                <div className="text-gray-600 text-sm mb-2">Color</div>
                <div className="flex flex-wrap gap-4 md:gap-x-6">
                  {productDetails?.color?.split(",").map((item) => (
                    <div
                      key={item}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                      onClick={() => setSelectedColor(item)}
                    >
                      <div
                        className={`w-6 h-6 md:w-8 md:h-8 border rounded-full border-solid active:scale-95 transition-transform ${
                          selectedColor === item
                            ? "ring-2 ring-offset-2 ring-black"
                            : ""
                        }`}
                        style={{ backgroundColor: item }}
                      />
                      <span
                        className={`text-xs md:text-sm block ${
                          selectedColor === item
                            ? "text-black"
                            : "text-gray-500"
                        }`}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-4 md:mb-6">
                <div className="text-gray-600 text-sm mb-2">Quantity</div>
                <div className="bg-[#EFEFEF] p-1.5 rounded-lg flex items-center gap-x-2 w-fit">
                  <button
                    className="w-7 h-7 md:w-8 md:h-8 border flex items-center justify-center rounded-lg cursor-pointer bg-[#D9D9D9] active:scale-95 transition-transform"
                    onClick={() => handleQuantityChange(false)}
                  >
                    <Minus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <div className="w-5 md:w-6 text-center">{quantity}</div>
                  <button
                    className="w-7 h-7 md:w-8 md:h-8 border flex items-center justify-center rounded-lg cursor-pointer bg-[#D9D9D9] active:scale-95 transition-transform"
                    onClick={() => handleQuantityChange(true)}
                  >
                    <Plus className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Features */}
            <div className="gap-y-1 md:gap-y-2 mb-4 md:mb-6">
              {/* {features.map((feature, idx) => ( */}
              <div className="flex items-center mb-1">
                <i className="ti ti-check mr-2 text-green-500" />
                <div
                  className="text-gray-600 text-sm md:text-base"
                  dangerouslySetInnerHTML={{
                    __html: productDetails?.productDetails || "",
                  }}
                ></div>
              </div>
              {/* ))} */}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-x-3 md:gap-x-4 sticky bottom-0 md:relative bg-white py-4 md:py-0">
              {/* <button
                className="flex-1 bg-black text-white py-2.5 md:py-3 px-3 text-sm md:text-base rounded-lg hover:bg-gray-800 cursor-pointer active:scale-95 transition-transform"
                onClick={() => console.log("Buy product clicked")}
              >
                BUY PRODUCT
              </button> */}
              <button
                className="flex-1 bg-black text-white border py-2.5 md:py-3 px-3 text-sm md:text-base rounded-lg hover:bg-gray-50 cursor-pointer active:scale-95 transition-transform"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
