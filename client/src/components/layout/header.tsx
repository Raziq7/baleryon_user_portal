import React, { useEffect, useState, type KeyboardEvent } from "react";
import { User, Menu, X } from "lucide-react";
import { useDispatch } from "react-redux";
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
import useAuthToken from "../../hooks/useAuthToken";
import { logoutUserThunk } from "../../store/thunks/authThunks";
import type { AppDispatch } from "../../store/store";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/products" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact-us" },
];

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLogin = useAuthToken();

  const [showSignupModal, setShowSignupModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogOut = () => dispatch(logoutUserThunk());
  const signupHandleClick = () => setShowSignupModal(true);

  const handleSearch = () => {
    const q = searchText.trim();
    if (q) window.location.href = `/products?search=${encodeURIComponent(q)}`;
  };
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur supports-backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 lg:px-5">
        {/* Top Bar */}
        <div className="flex h-16 lg:h-20 items-center">
          {/* Left: Desktop Search */}
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

          {/* Center: Logo (slightly reduced sizes) */}
          <div className="absolute left-1/2 -translate-x-1/2 z-10 w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32">
            <a href="/" aria-label="Go to homepage">
              <img
                src="/baleryonWithTextBlack.png"
                alt="Logo"
                className="block w-full h-auto object-contain"
              />
            </a>
          </div>

          {/* Right: Desktop Nav + Icons */}
          <div className="hidden lg:flex flex-1 justify-end items-center gap-8">
            <nav aria-label="Primary" className="flex">
              <ul className="flex gap-8">
                {navItems.map((n) => (
                  <li key={n.href}>
                    <a
                      href={n.href}
                      className="text-[15px] text-gray-900 hover:text-gray-700 hover:underline underline-offset-4"
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-6">
              <a href="/mywishlist" aria-label="Wishlist" className="opacity-90 hover:opacity-100">
                <img src="/harts.png" alt="Wishlist" width={24} height={24} />
              </a>
              <Cartpopup />

              {!isLogin ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <button aria-label="Open account login" className="opacity-90 hover:opacity-100">
                      <img src="/account.png" alt="Account" width={24} height={24} />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="w-[400px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Login</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <LoginForm signupClick={signupHandleClick} />
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              ) : (
                <Popover>
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
                        <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                        <p className="text-gray-600 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 my-3" />
                    <ul className="space-y-2 text-sm">
                      <li><a className="text-gray-700 hover:text-black" href="/profile">My Account</a></li>
                      <li><a className="text-gray-700 hover:text-black" href="/mywishlist">My Wishlist</a></li>
                      <li><a className="text-gray-700 hover:text-black" href="/orderList">My Orders</a></li>
                    </ul>
                    <Button className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white" onClick={handleLogOut}>
                      Log Out
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          {/* Right: Mobile Hamburger */}
          <button
            aria-label="Toggle menu"
            className="lg:hidden ml-auto p-1 rounded hover:bg-black/5"
            onClick={() => setMobileMenuOpen((s) => !s)}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Search */}
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

      {/* Mobile Menu Panel + overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Dim overlay */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        {/* Panel */}
        <div
          className={`absolute top-[64px] left-0 right-0 bg-white rounded-t-2xl shadow-lg px-4 pt-4 pb-6 transition-transform duration-300 ${
            mobileMenuOpen ? "translate-y-0" : "-translate-y-4 opacity-0"
          }`}
        >
          <nav aria-label="Mobile Primary">
            <ul className="flex flex-col gap-3">
              {navItems.map((n) => (
                <li key={n.href} className="border-b pb-2">
                  <a
                    href={n.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base text-gray-900"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Icons row */}
          <div className="mt-4 flex items-center gap-6">
            <a href="/mywishlist" aria-label="Wishlist" className="opacity-90 hover:opacity-100">
              <img src="/harts.png" alt="Wishlist" width={24} height={24} />
            </a>
            <Cartpopup />
            {!isLogin ? (
              <Dialog>
                <DialogTrigger asChild>
                  <button aria-label="Open account login" className="opacity-90 hover:opacity-100">
                    <img src="/account.png" alt="Account" width={24} height={24} />
                  </button>
                </DialogTrigger>
                <DialogContent className="w-[400px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Login</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <LoginForm signupClick={signupHandleClick} />
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                className="ml-auto bg-red-500 hover:bg-red-600 text-white"
                onClick={handleLogOut}
              >
                Log Out
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Sign Up Modal */}
      {showSignupModal && (
        <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
          <DialogContent className="w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Sign Up</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <SignupModal onClose={() => setShowSignupModal(false)} />
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </header>
  );
};

export default Header;
