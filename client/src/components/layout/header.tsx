import React, { useState } from "react";
import type { KeyboardEvent } from "react";
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

  return (
    <header className="p-3 lg:p-5 text-black w-full border-b border-gray-200">
      {/* Top bar */}
      <div className="relative flex items-center justify-between w-full">
        {/* Left (Desktop): Search */}
        <div className="hidden lg:block lg:flex-1 lg:max-w-[28rem] relative">
          <img
            src="/searchIcon.png"
            alt="Search"
            height={32}
            width={19}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={handleSearch}
          />
          <input
            type="text"
            placeholder="Search for products..."
            className="border border-[#00000033] rounded-[10px] p-2 w-full pl-10"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        {/* Center: Logo (always perfectly centered) */}
        <div className="absolute left-1/2 -translate-x-1/2 w-20 sm:w-24 md:w-28 lg:w-32 xl:w-36 z-10">
          <a href="/" aria-label="Go to homepage">
            <img
              src="/baleryonWithTextBlack.png"
              alt="Logo"
              className="w-full h-auto object-contain block"
            />
          </a>
        </div>

        {/* Right (Desktop): Nav + Icons */}
        <div className="hidden lg:flex items-center gap-8 lg:flex-1 justify-end">
          <ul className="flex gap-10">
            {["Home", "Product", "About", "Contact"].map((text) => (
              <li
                key={text}
                className="hover:underline hover:text-[#544F51] cursor-pointer"
              >
                <a
                  href={
                    text === "Product"
                      ? "/products"
                      : text === "About"
                      ? "/about-us"
                      : text === "Contact"
                      ? "/contact-us"
                      : "/"
                  }
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-6">
            <a href="/mywishlist" aria-label="Wishlist">
              <img src="/harts.png" alt="Wishlist" width={24} height={24} />
            </a>
            <Cartpopup />
            {!isLogin ? (
              <Dialog>
                <DialogTrigger asChild>
                  <button aria-label="Open account login">
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
                  <button aria-label="Open account menu">
                    <img src="/account.png" alt="Account" width={24} height={24} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="flex gap-4 mb-4 items-center">
                    <div className="p-3 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full text-white">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {user.name}
                      </p>
                      <p className="text-gray-600 text-xs">{user.email}</p>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 mb-4" />
                  <p className="text-md text-gray-500 mb-2">
                    <a href="/profile">My Account</a>
                  </p>
                  <p className="text-md text-gray-500 mb-2">
                    <a href="/mywishlist">My Wishlist</a>
                  </p>
                  <p className="text-md text-gray-500 mb-4">
                    <a href="/orderList">My Orders</a>
                  </p>
                  <Button
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleLogOut}
                  >
                    Log Out
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Right (Mobile): Hamburger */}
        <button
          aria-label="Toggle menu"
          className="lg:hidden flex items-center ml-auto"
          onClick={() => setMobileMenuOpen((s) => !s)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile: Search row */}
      <div className="lg:hidden mt-3">
        <div className="relative">
          <img
            src="/searchIcon.png"
            alt="Search"
            height={32}
            width={19}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={handleSearch}
          />
          <input
            type="text"
            placeholder="Search for products..."
            className="border border-[#00000033] rounded-[10px] p-2 w-full pl-10"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
          <ul className="flex flex-col gap-3">
            {["Home", "Product", "About", "Contact"].map((text) => (
              <li key={text} className="border-b pb-2">
                <a
                  href={
                    text === "Product"
                      ? "/products"
                      : text === "About"
                      ? "/about-us"
                      : text === "Contact"
                      ? "/contact-us"
                      : "/"
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile: Icons row */}
          <div className="flex items-center gap-6">
            <a href="/mywishlist" aria-label="Wishlist">
              <img src="/harts.png" alt="Wishlist" width={24} height={24} />
            </a>
            <Cartpopup />
            {!isLogin ? (
              <Dialog>
                <DialogTrigger asChild>
                  <button aria-label="Open account login">
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
      )}

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
