import React, { useState } from "react";
import type { KeyboardEvent } from "react";
import { User } from "lucide-react";
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
import LoaderLottie from "../lottie/Loader";

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLogin = useAuthToken();

  // const [menuOpen, setMenuOpen] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleLogOut = () => {
    dispatch(logoutUserThunk());
  };

  const signupHandleClick = () => {
    // setMenuOpen(false);
    setShowSignupModal(true);
  };

  const handleSearch = () => {
    const query = searchText.trim();
    if (query) {
      window.location.href = `/products?search=${encodeURIComponent(query)}`;
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (

    <header className="p-3 lg:p-5 text-black w-full">
      <div className="flex justify-between items-center w-full">
        {/* Logo */}
        <div
          style={{
            position: "relative",
            width: "90px",
            height: "auto",
            overflow: "hidden",
          }}
        >
          <a href="/">
            <img
              src="/mainLogo.png"
              alt="Logo"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </a>
        </div>

        {/* Search */}
        <div className="w-full lg:flex-1 lg:max-w-[28rem] relative">
          <img
            src="/searchIcon.png"
            alt="Search"
            height={32}
            width={19}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
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

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex gap-10">
            {["Home", "Product", "About", "Sales", "Contact"].map(
              (text, idx) => (
                <li
                  key={idx}
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
              )
            )}
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-6">
            <a href="/mywishlist">
              <img
                src="/harts.png"
                alt="Wishlist"
                width={24}
                height={24}
                className="cursor-pointer"
              />
            </a>
            <Cartpopup />

            {!isLogin ? (
              <Dialog>
                <DialogTrigger>
                  <img
                    src="/account.png"
                    alt="Account"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                  />
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
                  <img
                    src="/account.png"
                    alt="Account"
                    width={24}
                    height={24}
                    className="cursor-pointer"
                  />
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
      </div>
    </header>
  );
};

export default Header;
