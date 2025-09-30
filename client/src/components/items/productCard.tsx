// src/components/items/ProductCard.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Trash } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import type { ProductDetail } from "../../store/types/product";
import type { AppDispatch } from "../../store/store";

import {
  fetchWishlistThunk,
  initializeWishlistFromLocal,
  selectWishlistIdSet,
  selectWishlistInitialized,
  addToWishlistThunk,
  removeFromWishlistThunk,
} from "../../store/slices/wishlistSlice";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import LoginForm from "../../components/items/loginForm";

/* ---------- helpers ---------- */
const formatINR = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
    : "0";

/** Auth modal + pending action */
function useAuthModalWithPendingAction() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const isLoggedIn = useMemo(() => !!localStorage.getItem("auth_token"), []);
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);

  const openLogin = (action?: () => void) => {
    if (action) setPendingAction(() => action);
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleLoginSuccess = () => {
    setShowAuthModal(false);
    setTimeout(() => {
      if (pendingAction) {
        const act = pendingAction;
        setPendingAction(null);
        act();
      }
    }, 50);
  };

  return {
    isLoggedIn,
    showAuthModal,
    authMode,
    setAuthMode,
    setShowAuthModal,
    openLogin,
    handleLoginSuccess,
  };
}

/** Heart that reliably fills when active */
const WishHeart: React.FC<{ active: boolean }> = ({ active }) => {
  const color = active ? "#ef4444" /* red-500 */ : "#111827" /* gray-900 */;
  return (
    <Heart
      style={{ color }}
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2.25}
      className="h-5 w-5"
    />
  );
};

/* -------------------------------------------------------------------------- */
/* ProductCard                                                                */
/* -------------------------------------------------------------------------- */
interface ProductCardProps {
  prodctname: string;
  prodctID?: string; // optional, prefer productDetail._id
  price: number;
  image: string;
  productDetail: ProductDetail; // MUST contain _id
}

export const ProductCard: React.FC<ProductCardProps> = ({
  prodctname,
  prodctID,
  price,
  image,
  productDetail,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const hasToken = !!localStorage.getItem("auth_token");
  const initialized = useSelector(selectWishlistInitialized);
  const wishlistIdSet = useSelector(selectWishlistIdSet);

  // Prefer the server id from productDetail
  const idToCheck = productDetail?._id || prodctID || "";
  const isInWishlist = wishlistIdSet.has(idToCheck);

  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    if (!initialized) {
      if (hasToken) dispatch(fetchWishlistThunk());
      else dispatch(initializeWishlistFromLocal());
    }
  }, [dispatch, hasToken, initialized]);

  const {
    isLoggedIn,
    showAuthModal,
    authMode,
    setAuthMode,
    setShowAuthModal,
    openLogin,
    handleLoginSuccess,
  } = useAuthModalWithPendingAction();

  const goToDetails = () => navigate(`/products/product-details/${idToCheck}`);

  const doToggleWishlist = async () => {
    try {
      if (!idToCheck) return;
      if (isInWishlist) {
        await dispatch(removeFromWishlistThunk(idToCheck)).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(
          addToWishlistThunk({
            productId: idToCheck,
            sizes: productDetail.sizes,
            color: productDetail.color,
          })
        ).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (e: any) {
      toast.error(e?.message || "Unable to update wishlist");
    }
  };

  const onHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return openLogin(doToggleWishlist);
    void doToggleWishlist();
  };

  return (
    <>
      <div className="group w-full">
        <div className="relative w-full rounded-xl overflow-hidden bg-gray-50">
          <div className="w-full aspect-[3/4]">
            <img
              src={!imgErr && image ? image : "/cardProductImage.png"}
              alt={prodctname}
              loading="lazy"
              onError={() => setImgErr(true)}
              className="h-full w-full object-cover"
            />
          </div>

          <button
            type="button"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isInWishlist}
            onClick={onHeartClick}
            className="absolute top-2 right-2 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm transition hover:bg-white"
          >
            <WishHeart active={isInWishlist} />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block">
            <button
              onClick={goToDetails}
              className="pointer-events-auto w-full py-3 text-white bg-black/90 hover:bg-black"
            >
              View
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-start justify-between gap-2">
          <p className="text-[13px] sm:text-[14px] leading-tight line-clamp-2">
            {prodctname}
          </p>
          <p className="text-[13px] sm:text-[14px] font-medium whitespace-nowrap">
            ₹ {formatINR(price)}
          </p>
        </div>

        <button
          onClick={goToDetails}
          className="sm:hidden mt-2 w-full py-2 text-sm rounded-md border border-gray-900 text-gray-900 active:scale-[0.99]"
        >
          View
        </button>
      </div>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {authMode === "login" ? "Login" : "Sign Up"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <LoginForm
              signupClick={() => setAuthMode("signup")}
              onSuccess={handleLoginSuccess}
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* ProductCard2                                                               */
/* -------------------------------------------------------------------------- */
interface ProductCard2Props {
  prodctname: string;
  prodctID?: string; // optional, prefer productDetail._id
  index: number;
  price: number;
  image?: string;
  productDetail: ProductDetail; // MUST contain _id
}

export const ProductCard2: React.FC<ProductCard2Props> = ({
  prodctname,
  prodctID,
  price,
  image,
  productDetail,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const hasToken = !!localStorage.getItem("auth_token");
  const initialized = useSelector(selectWishlistInitialized);
  const wishlistIdSet = useSelector(selectWishlistIdSet);

  const idToCheck = productDetail?._id || prodctID || "";
  const isInWishlist = wishlistIdSet.has(idToCheck);

  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    if (!initialized) {
      if (hasToken) dispatch(fetchWishlistThunk());
      else dispatch(initializeWishlistFromLocal());
    }
  }, [dispatch, hasToken, initialized]);

  const {
    isLoggedIn,
    showAuthModal,
    authMode,
    setAuthMode,
    setShowAuthModal,
    openLogin,
    handleLoginSuccess,
  } = useAuthModalWithPendingAction();

  const doToggleWishlist = async () => {
    try {
      if (!idToCheck) return;
      if (isInWishlist) {
        await dispatch(removeFromWishlistThunk(idToCheck)).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(
          addToWishlistThunk({
            productId: idToCheck,
            sizes: productDetail.sizes,
            color: productDetail.color,
          })
        ).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (e: any) {
      toast.error(e?.message || "Unable to update wishlist");
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return openLogin(doToggleWishlist);
    void doToggleWishlist();
  };

  const goToDetails = () => navigate(`/products/product-details/${idToCheck}`);

  return (
    <>
      <div className="group w-full">
        <div className="relative w-full rounded-xl overflow-hidden bg-gray-50">
          <div className="w-full aspect-[3/4]">
            <img
              src={!imgErr && image ? image : "/cardProductImage.png"}
              alt={prodctname}
              loading="lazy"
              onError={() => setImgErr(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>

          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isInWishlist}
            className="absolute top-2 right-2 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm hover:bg-white"
          >
            <WishHeart active={isInWishlist} />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block">
            <button
              onClick={goToDetails}
              className="pointer-events-auto w-full py-3 text-white bg-black/90 hover:bg-black"
            >
              View
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-start justify-between gap-2">
          <p onClick={goToDetails} className="text-[13px] sm:text-[14px] leading-tight line-clamp-2 cursor-pointer">
            {prodctname}
          </p>
          <p className="text-[13px] sm:text-[14px] font-medium whitespace-nowrap">₹ {formatINR(price)}</p>
        </div>

        <button
          onClick={goToDetails}
          className="sm:hidden mt-2 w-full py-2 text-sm rounded-md border border-gray-900 text-gray-900 active:scale-[0.99]"
        >
          View
        </button>
      </div>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {authMode === "login" ? "Login" : "Sign Up"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <LoginForm
              signupClick={() => setAuthMode("signup")}
              onSuccess={handleLoginSuccess}
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* ProductListCard (list view that takes full ProductDetail)                  */
/* -------------------------------------------------------------------------- */
interface ProductListCardProps {
  productDetail: ProductDetail;
}

export const ProductListCard: React.FC<ProductListCardProps> = ({ productDetail }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const hasToken = !!localStorage.getItem("auth_token");
  const initialized = useSelector(selectWishlistInitialized);
  const wishlistIdSet = useSelector(selectWishlistIdSet);

  const idToCheck = productDetail._id || "";
  const isInWishlist = wishlistIdSet.has(idToCheck);

  const [imgErr, setImgErr] = useState(false);

  useEffect(() => {
    if (!initialized) {
      if (hasToken) dispatch(fetchWishlistThunk());
      else dispatch(initializeWishlistFromLocal());
    }
  }, [dispatch, hasToken, initialized]);

  const {
    isLoggedIn,
    showAuthModal,
    authMode,
    setAuthMode,
    setShowAuthModal,
    openLogin,
    handleLoginSuccess,
  } = useAuthModalWithPendingAction();

  const doToggleWishlist = async () => {
    try {
      if (!idToCheck) return;
      if (isInWishlist) {
        await dispatch(removeFromWishlistThunk(idToCheck)).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await dispatch(
          addToWishlistThunk({
            productId: idToCheck,
            sizes: productDetail.sizes,
            color: productDetail.color,
          })
        ).unwrap();
        toast.success("Added to wishlist");
      }
    } catch (e: any) {
      toast.error(e?.message || "Unable to update wishlist");
    }
  };

  const onHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) return openLogin(doToggleWishlist);
    void doToggleWishlist();
  };

  const goToDetails = () => navigate(`/products/product-details/${idToCheck}`);

  return (
    <>
      <div className="group w-full">
        <div className="relative w-full rounded-xl overflow-hidden bg-gray-50">
          <div className="w-full aspect-[3/4]">
            <img
              src={!imgErr && productDetail.image?.[0] ? productDetail.image[0] : "/cardProductImage.png"}
              alt={productDetail.productName}
              loading="lazy"
              onError={() => setImgErr(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>

          <button
            type="button"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isInWishlist}
            onClick={onHeartClick}
            className="absolute top-2 right-2 rounded-full bg-white/90 p-2 shadow-md backdrop-blur-sm hover:bg-white"
          >
            <WishHeart active={isInWishlist} />
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:block">
            <button
              onClick={goToDetails}
              className="pointer-events-auto w-full py-3 text-white bg-black/90 hover:bg-black"
            >
              View
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-start justify-between gap-2">
          <p onClick={goToDetails} className="text-[13px] sm:text-[14px] leading-tight line-clamp-2 cursor-pointer">
            {productDetail.productName}
          </p>
          <p className="text-[13px] sm:text-[14px] font-medium whitespace-nowrap">₹ {formatINR(productDetail.price)}</p>
        </div>

        <button
          onClick={goToDetails}
          className="sm:hidden mt-2 w-full py-2 text-sm rounded-md border border-gray-900 text-gray-900 active:scale-[0.99]"
        >
          View
        </button>
      </div>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {authMode === "login" ? "Login" : "Sign Up"}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <LoginForm
              signupClick={() => setAuthMode("signup")}
              onSuccess={handleLoginSuccess}
            />
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* WishListCard (wishlist page item)                                          */
/* -------------------------------------------------------------------------- */
interface WishListCardProps {
  productDetail: ProductDetail;
  removeProduct: () => void;
}

export const WishListCard: React.FC<WishListCardProps> = ({ productDetail, removeProduct }) => {
  const navigate = useNavigate();

  return (
    <div className="shadow-lg rounded group">
      <div className="relative">
        <button className="absolute top-3 right-3" onClick={removeProduct} aria-label="Remove from wishlist">
          <Trash />
        </button>
        <img
          src={productDetail.image?.[0] || "/cardProductImage.png"}
          alt={productDetail.productName}
          className="w-full h-auto"
        />
        <div className="absolute bottom-0 w-full opacity-0 group-hover:opacity-100 transition">
          <button
            className="w-full py-4 bg-black text-white"
            onClick={() => navigate(`/products/product-details/${productDetail._id}`)}
          >
            View
          </button>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="flex justify-between">
          <p>{productDetail.productName}</p>
          <p>₹ {formatINR(productDetail.price)}</p>
        </div>
      </div>
    </div>
  );
};

/* ---------- named exports ---------- */
// export { ProductCard, ProductCard2, ProductListCard, WishListCard };
