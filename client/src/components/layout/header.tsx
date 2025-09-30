// src/components/layout/Header.tsx
import React, { useEffect, useState, type KeyboardEvent } from "react";
import { User, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import LoginForm from "../items/loginForm";
import Cartpopup from "../items/cartpopup";
import SignupModal from "../../components/SignupModal";
import { logoutUserThunk } from "../../store/thunks/authThunks";
import type { AppDispatch, RootState } from "../../store/store";

/* 👇 NEW: wishlist imports */
import {
  fetchWishlistThunk,
  initializeWishlistFromLocal,
  selectWishlistInitialized,
  selectWishlistCount,
} from "../../store/slices/wishlistSlice";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/products" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
];

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

  /* 👇 NEW: read wishlist count + init flag */
  const wishlistInitialized = useSelector(selectWishlistInitialized);
  const wishlistCount = useSelector(selectWishlistCount);
  const hasToken = !!localStorage.getItem("auth_token");

  useEffect(() => {
    if (!wishlistInitialized) {
      if (hasToken) dispatch(fetchWishlistThunk());
      else dispatch(initializeWishlistFromLocal());
    }
  }, [dispatch, hasToken, wishlistInitialized]);

  const displayName =
    (user?.name && !/undefined/i.test(user.name) && user.name.trim()) ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    (user?.email ? user.email.split("@")[0] : "My Account");
  const displayEmail = user?.email || "";

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [searchText, setSearchText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const handleLogOut = () => {
    setAuthOpen(false);
    setMobileMenuOpen(false);
    setAccountOpen(false);
    dispatch(logoutUserThunk());
  };

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };
  const openSignup = () => {
    setAuthMode("signup");
    setAuthOpen(true);
  };

  const handleSearch = () => {
    const q = searchText.trim();
    if (q) navigate(`/products?search=${encodeURIComponent(q)}`);
  };
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setAuthOpen(false);
    setMobileMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 lg:px-5">
        <div className="flex h-16 lg:h-20 items-center">
          {/* Desktop search */}
          <div className="hidden lg:flex flex-1 max-w-[26rem]">
            <div className="relative w-full">
              <button
                aria-label="Search"
                onClick={handleSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
              >
                <img src="/searchIcon.png" width={18} height={18} alt="Search" />
              </button>
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full rounded-full border border-black/20 pl-10 pr-12 py-2 outline-none focus:ring-2 focus:ring-black/20"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-sm bg-black text-white hover:bg-black/90"
              >
                Go
              </button>
            </div>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 z-10 w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32">
            <Link to="/" aria-label="Go to homepage">
              <img
                src="/baleryonWithTextBlack.png"
                alt="Logo"
                className="block w-full h-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop nav + icons */}
          <div className="hidden lg:flex flex-1 justify-end items-center gap-8">
            <nav aria-label="Primary" className="flex">
              <ul className="flex gap-8">
                {navItems.map((n) => (
                  <li key={n.href}>
                    <Link
                      to={n.href}
                      className="text-[15px] text-gray-900 hover:text-gray-700 hover:underline underline-offset-4"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-6">
              {/* ✅ Wishlist with badge */}
              <Link
                to="/mywishlist"
                aria-label="Wishlist"
                className="relative inline-flex opacity-90 hover:opacity-100"
              >
                <img src="/harts.png" alt="Wishlist" width={24} height={24} />
                {wishlistCount > 0 && (
                  <span
                    aria-label={`${wishlistCount} item${
                      wishlistCount > 1 ? "s" : ""
                    } in wishlist`}
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] leading-[18px] text-center px-1 font-semibold"
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart popover */}
              <Cartpopup />

              {!isAuthenticated ? (
                <Dialog open={authOpen} onOpenChange={setAuthOpen}>
                  <DialogTrigger asChild>
                    <button
                      aria-label="Open account login"
                      className="opacity-90 hover:opacity-100"
                      onClick={openLogin}
                    >
                      <img src="/account.png" alt="Account" width={24} height={24} />
                    </button>
                  </DialogTrigger>
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
                          onSuccess={() => setAuthOpen(false)}
                        />
                      ) : (
                        <SignupModal
                          onClose={() => setAuthOpen(false)}
                          onBackToLogin={() => setAuthMode("login")}
                        />
                      )}
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              ) : (
                <Popover open={accountOpen} onOpenChange={setAccountOpen}>
                  <PopoverTrigger asChild>
                    <button aria-label="Open account menu" className="opacity-90 hover:opacity-100">
                      <img src="/account.png" alt="Account" width={24} height={24} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="flex gap-3 mb-3 items-center">
                      <div className="p-3 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full text-white">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{displayName}</p>
                        <p className="text-gray-600 text-xs">{displayEmail}</p>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 my-3" />
                    <ul className="space-y-2 text-sm">
                      <li><Link className="text-gray-700 hover:text-black" to="/profile">My Account</Link></li>
                      <li><Link className="text-gray-700 hover:text-black" to="/mywishlist">My Wishlist</Link></li>
                      <li><Link className="text-gray-700 hover:text-black" to="/orderList">My Orders</Link></li>
                    </ul>
                    <Button
                      className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white"
                      onClick={handleLogOut}
                    >
                      Log Out
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            className="lg:hidden ml-auto p-1 rounded hover:bg-black/5"
            onClick={() => setMobileMenuOpen((s) => !s)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile search */}
        <div className="lg:hidden pb-3">
          <div className="relative">
            <button
              aria-label="Search"
              onClick={handleSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
            >
              <img src="/searchIcon.png" width={18} height={18} alt="Search" />
            </button>
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full rounded-full border border-black/20 pl-10 pr-12 py-2 outline-none focus:ring-2 focus:ring-black/20"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSearch}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-sm bg-black text-white hover:bg-black/90"
            >
              Go
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu & overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-[64px] left-0 right-0 bg-white rounded-t-2xl shadow-lg px-4 pt-4 pb-6 transition-transform duration-300 ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-4 opacity-0"
          }`}
        >
          {/* Mobile nav */}
          <nav aria-label="Mobile Primary">
            <ul className="flex flex-col gap-3">
              {navItems.map((n) => (
                <li key={n.href} className="border-b pb-2">
                  <Link
                    to={n.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base text-gray-900"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Icons row */}
          <div className="mt-4 flex items-center gap-6">
            {/* ✅ Mobile wishlist with badge */}
            <Link
              to="/mywishlist"
              aria-label="Wishlist"
              className="relative inline-flex opacity-90 hover:opacity-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img src="/harts.png" alt="Wishlist" width={24} height={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] leading-[18px] text-center px-1 font-semibold">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>

            <Cartpopup />
          </div>

          {/* Mobile account panel */}
          <div className="mt-4">
            {!isAuthenticated ? (
              <div className="flex gap-3">
                <Button className="flex-1" onClick={openLogin}>
                  Login
                </Button>
                <Button className="flex-1" variant="outline" onClick={openSignup}>
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex gap-3 items-center">
                  <div className="p-3 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full text-white">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {displayName}
                    </p>
                    <p className="text-gray-600 text-xs truncate">{displayEmail}</p>
                  </div>
                </div>
                <div className="border-b border-gray-200 my-3" />
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      className="block text-gray-700 hover:text-black"
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block text-gray-700 hover:text-black"
                      to="/mywishlist"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block text-gray-700 hover:text-black"
                      to="/orderList"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                  </li>
                </ul>
                <Button
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleLogOut}
                >
                  Log Out
                </Button>
              </div>
            )}
          </div>

          {/* Shared auth dialog */}
          <Dialog open={authOpen} onOpenChange={setAuthOpen}>
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
                    onSuccess={() => {
                      setAuthOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  />
                ) : (
                  <SignupModal
                    onClose={() => {
                      setAuthOpen(false);
                      setMobileMenuOpen(false);
                    }}
                    onBackToLogin={() => setAuthMode("login")}
                  />
                )}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
