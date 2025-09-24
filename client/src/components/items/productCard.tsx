import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ProductDetail } from "../../store/types/product";
import { useDispatch, useSelector } from "react-redux";
import { Heart, Trash } from "lucide-react";
import type { RootState } from "../../store/store";
import {
  toggleWishlistItem,
  initializeWishlist,
} from "../../store/slices/wishlistSlice";
import { addToWishlist } from "../../api/wishlistApi";

interface ProductCardProps {
  prodctname: string;
  prodctID: string;
  price: number;
  image: string;
  productDetail: ProductDetail;
}

const formatINR = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
    : "0";

export const ProductCard: React.FC<ProductCardProps> = ({
  prodctname,
  prodctID,
  price,
  image,
  productDetail,
}) => {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);

  const goToDetails = () => navigate(`/products/product-details/${prodctID}`);

  return (
    <div className="group w-full">
      {/* Media */}
      <div className="relative w-full rounded-xl overflow-hidden bg-gray-50">
        {/* Keep a consistent tall ratio like the screenshot */}
        <div className="w-full aspect-[3/4]">
          <img
            src={
              !imgErr && image ? image : "/cardProductImage.png" /* fallback */
            }
            alt={prodctname}
            loading="lazy"
            onError={() => setImgErr(true)}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Top-right wishlist (visual only; wire up when ready) */}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute top-2 right-2 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition hover:bg-white"
        >
          <Heart className="h-5 w-5" />
        </button>

        {/* Desktop/hover “View” bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block">
          <button
            onClick={goToDetails}
            className="pointer-events-auto w-full py-3 text-white bg-black/90 hover:bg-black"
          >
            View
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-2 flex items-start justify-between gap-2">
        <p className="text-[13px] sm:text-[14px] leading-tight line-clamp-2">
          {prodctname}
        </p>
        <p className="text-[13px] sm:text-[14px] font-medium whitespace-nowrap">
          ₹ {formatINR(price)}
        </p>
      </div>

      {/* Mobile CTA (since no hover) */}
      <button
        onClick={goToDetails}
        className="sm:hidden mt-2 w-full py-2 text-sm rounded-md border border-gray-900 text-gray-900 active:scale-[0.99]"
      >
        View
      </button>
    </div>
  );
};

// ------------- ProductCard2 Component -------------------

interface ProductCard2Props {
  prodctname: string;
  prodctID: string;
  index: number;
  price: number;
  image?: string;
  productDetail: ProductDetail;
}

// const formatINR = (n?: number) =>
//   typeof n === "number"
//     ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
//     : "0";

export const ProductCard2: React.FC<ProductCard2Props> = ({
  prodctname,
  prodctID,
  price,
  image,
  productDetail,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((s: RootState) => s.wishlist.items);

  const [imgErr, setImgErr] = useState(false);
  const isInWishlist = wishlistItems.some((item) => item._id === prodctID);

  useEffect(() => {
    dispatch(initializeWishlist());
  }, [dispatch]);

  const handleWishlistToggle = () => {
    dispatch(toggleWishlistItem(productDetail));
    addToWishlist(productDetail._id, productDetail.sizes, productDetail.color);
  };

  const goToDetails = () => navigate(`/products/product-details/${prodctID}`);

  return (
    <div className="group w-full">
      {/* Media */}
      <div className="relative w-full rounded-xl overflow-hidden bg-gray-50">
        {/* Fixed tall ratio so cards align */}
        <div className="w-full aspect-[3/4]">
          <img
            src={!imgErr && image ? image : "/cardProductImage.png"}
            alt={prodctname}
            loading="lazy"
            onError={() => setImgErr(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>

        {/* Wishlist heart */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label="Toggle Wishlist"
          className="absolute top-2 right-2 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm hover:bg-white"
        >
          {isInWishlist ? (
            <Heart className="h-5 w-5" color="red" fill="red" />
          ) : (
            <Heart className="h-5 w-5" />
          )}
        </button>

        {/* Desktop hover View bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block">
          <button
            onClick={goToDetails}
            className="pointer-events-auto w-full py-3 text-white bg-black/90 hover:bg-black"
          >
            View
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-2 flex items-start justify-between gap-2">
        <p
          onClick={goToDetails}
          className="text-[13px] sm:text-[14px] leading-tight line-clamp-2 cursor-pointer"
        >
          {prodctname}
        </p>
        <p className="text-[13px] sm:text-[14px] font-medium whitespace-nowrap">
          ₹ {formatINR(price)}
        </p>
      </div>

      {/* Mobile CTA (no hover) */}
      <button
        onClick={goToDetails}
        className="sm:hidden mt-2 w-full py-2 text-sm rounded-md border border-gray-900 text-gray-900 active:scale-[0.99]"
      >
        View
      </button>
    </div>
  );
};

// ------------- ProductListCard Component -------------------
interface ProductListCardProps {
  productDetail: ProductDetail;
}

// const formatINR = (n?: number) =>
//   typeof n === "number"
//     ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
//     : "0";

export const ProductListCard: React.FC<ProductListCardProps> = ({
  productDetail,
}) => {
  const navigate = useNavigate();
  const [imgErr, setImgErr] = useState(false);

  const goToDetails = () =>
    navigate(`/products/product-details/${productDetail._id}`);

  return (
    <div className="group w-full">
      {/* Media */}
      <div className="relative w-full rounded-xl overflow-hidden bg-gray-50">
        <div className="w-full aspect-[3/4]">
          <img
            src={
              !imgErr && productDetail.image?.[0]
                ? productDetail.image[0]
                : "/cardProductImage.png"
            }
            alt={productDetail.productName}
            loading="lazy"
            onError={() => setImgErr(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>

        {/* (Optional) wishlist icon — hook up to your slice if needed */}
        <button
          type="button"
          aria-label="Wishlist"
          className="absolute top-2 right-2 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm hover:bg-white"
        >
          <Heart className="h-5 w-5" />
        </button>

        {/* Desktop hover "View" strip */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block">
          <button
            onClick={goToDetails}
            className="pointer-events-auto w-full py-3 text-white bg-black/90 hover:bg-black"
          >
            View
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-2 flex items-start justify-between gap-2">
        <p
          onClick={goToDetails}
          className="text-[13px] sm:text-[14px] leading-tight line-clamp-2 cursor-pointer"
        >
          {productDetail.productName}
        </p>
        <p className="text-[13px] sm:text-[14px] font-medium whitespace-nowrap">
          ₹ {formatINR(productDetail.price)}
        </p>
      </div>

      {/* Mobile CTA */}
      <button
        onClick={goToDetails}
        className="sm:hidden mt-2 w-full py-2 text-sm rounded-md border border-gray-900 text-gray-900 active:scale-[0.99]"
      >
        View
      </button>
    </div>
  );
};

// ------------- WishListCard Component -------------------

interface WishListCardProps {
  productDetail: ProductDetail;
  removeProduct: () => void;
}

export const WishListCard: React.FC<WishListCardProps> = ({
  productDetail,
  removeProduct,
}) => {
  const navigate = useNavigate();

  return (
    <div className="shadow-lg rounded group">
      <div className="relative">
        <button
          className="absolute top-3 right-3"
          onClick={removeProduct}
          aria-label="Remove from wishlist"
        >
          <Trash />
        </button>
        <img
          src={productDetail.image[0]}
          alt={productDetail.productName}
          className="w-full h-auto"
        />
        <div className="absolute bottom-0 w-full opacity-0 group-hover:opacity-100 transition">
          <button
            className="w-full py-4 bg-black text-white"
            onClick={() =>
              navigate(`/products/product-details/${productDetail._id}`)
            }
          >
            View
          </button>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="flex justify-between">
          <p>{productDetail.productName}</p>
          <p>₹ {productDetail.price}</p>
        </div>
      </div>
    </div>
  );
};
