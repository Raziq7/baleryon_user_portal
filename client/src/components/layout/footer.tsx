// import Link from "next/link";
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full p-4 md:p-8">
      <div className="border border-[#DFDFDF]">
        <div className="flex flex-col md:flex-row justify-between items-start p-4 md:pt-8 md:pr-8 md:pl-10 min-h-[15rem]">
          <div className="w-full md:w-1/3 mb-8 md:mb-0 md:h-full flex items-end justify-evenly gap-1.5">
            <input
              type="text"
              placeholder="Enter your email"
              className="border border-black rounded-3xl p-2 w-full"
            />
            <button className="bg-black text-white px-6 py-2 rounded-3xl whitespace-nowrap">
              Submit
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto">
            <div>
              <ol className="space-y-2">
                <li className="text-lg md:text-xl font-bold">Information</li>
                <li className="text-sm md:text-base">
                  <Link to={"about-us"}>About us</Link>
                </li>
                <li className="text-sm md:text-base">
                  <Link to={"contact-us"}>Contact Us</Link>
                </li>
                <li className="text-sm md:text-base">
                  <Link to={"privacy-policy"}>Privacy Policy</Link>
                </li>
                <li className="text-sm md:text-base">
                  <Link to={"terms-condition"}>Terms & Condition</Link>
                </li>
              </ol>
            </div>

            <div>
              <ol className="space-y-2">
                <li className="text-lg md:text-xl font-bold">Our service</li>
                <li className="text-sm md:text-base">
                  <Link to={"cancel-refund"}>Cancel Refund</Link>
                </li>
                <li className="text-sm md:text-base">
                  <Link to={"shipping-policy"}>Shipping-Policy</Link>
                </li>
                <li className="text-sm md:text-base">FAQs</li>
              </ol>
            </div>

            <div>
              <ol className="space-y-2">
                <li className="text-lg md:text-xl font-bold">My Account</li>
                <li className="text-sm md:text-base">My Account</li>
                <li className="text-sm md:text-base">
                  <Link to={"orderList"}>Order History</Link>
                </li>
                <li className="text-sm md:text-base">Wishlist</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="bg-black p-3">
          <p className="text-white text-center">@2025</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
