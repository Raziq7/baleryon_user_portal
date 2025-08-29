import {
  Heart,
  House,
  LayoutDashboard,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import React from "react";

function MobileNav() {
  return (
    <div className="w-full fixed bottom-0 z-50 rounded-t-3xl shadow-lg border-t-1 border-l-1 border-r-1 border-[#00000040] bg-white lg:hidden">
      <div className="flex items-center justify-between  px-4 py-4">

        <Link href={"/"} className="flex flex-col items-center">
          <House />
          <p>Home</p>
        </Link>
        <Link href={"/"} className="flex flex-col items-center">
          <LayoutDashboard />
          <p>categories</p>
        </Link>
        <Link href={"/"} className="flex flex-col items-center">
          <Heart />
          <p>Wishlist</p>
        </Link>
        <Link href={"/"} className="flex flex-col items-center">
          <ShoppingBag />
          <p>Cart</p>
        </Link>
        <Link href={"/"} className="flex flex-col items-center">
          {/* <PersonStanding /> */}
          <UserRound />
          <p>Profile</p>
        </Link>
      </div>
    </div>
  );
}

export default MobileNav;
