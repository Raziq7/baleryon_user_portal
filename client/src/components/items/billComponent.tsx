import React from "react";
import { Button } from "../ui/button";

function BillComponent() {
  return (
    <div>
      <p>Get started &grab best offers!</p>
      <div className="relative">
        <input
          className="border border-black py-2 px-3"
          placeholder="Enter pincode"
        />
        <button className="absolute right-2">Check</button>
      </div>
      <p className="text-sm">check your delivery time</p>

      <div className="border border-[#000000] rounded-md mb-14">
        <div className="p-4 border-b border-[#000000] flex">
          <div className="w-[150px] h-[200px] mr-6"></div>
          <div>
            <h2 className="text-xl">MEN BLACK JACKET</h2>
            <p>
              beautiful elegant gown dress with cowl neck and sleeveless made
              lightweight fabric
            </p>
            <p>
              ₹2000 <span className="text-[#000000] ml-3">(10%)</span>{" "}
            </p>
            <button className="text-xl">Qty-1</button>
          </div>
        </div>
        <div className="flex px-3 py-1">
          <p>You pay</p>

          <p>
            <span className="text-[#000000]">₹2000</span> ₹1800
          </p>
        </div>
      </div>

      <div className="border border-[#000000] rounded-md mb-14">
        <p className="text-3xl font-bold">Price details</p>
        <div>
            <table>
                <th>
                    <td>Total MRP (1 items)</td>
                    <td>₹2000</td>
                </th>
                <th>
                    <td>Discounts</td>
                    <td>₹200</td>
                </th>
                <th>
                    <td>Shipping</td>
                    <td>₹70 <span className="text-[#A7AAA6]">FREE</span></td>
                </th>
                <th>
                    <td className="font-bold" >You pay</td>
                    <td className="font-bold" >₹1800</td>
                </th>
            </table>
        </div>
      </div>

      <div className="border border-[#000000] rounded-md mb-14">
        <div className="p-6 flex items-center justify-center">
            <div>
                <p>₹1800</p>
                <p>view detailed bill</p>
            </div>
            <Button className="px-10">
                Process to Pay
            </Button>
        </div>
        </div>
    </div>
  );
}

export default BillComponent;
