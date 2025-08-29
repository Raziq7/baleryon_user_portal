import React, { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { Badge } from "../../components/ui/badge";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { Button } from "../../components/ui/button";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  clearCartThunk,
  fetchCartItemsThunk,
  removeFromCartThunk,
  updateCartQuantityThunk,
} from "../../store/thunks/cartThunks";
import { selectSubtotal } from "../../store/slices/cartSclice";
import type { RootState } from "../../store/store";

export interface CartProduct {
  _id: string;
  productId: {
    _id: string;
    productName: string;
    image: string[];
    price: number;
  };
  quantity: number;
  size: string;
  color: string;
  price: number;
  productName: string;
  image: string[];
}

function Cartpopup() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, userId } = useSelector((state: RootState) => state.cart);
  const subtotal = useSelector(selectSubtotal);

  useEffect(() => {
    dispatch(fetchCartItemsThunk());
  }, [dispatch]);

  const handleQuantityChange = (userId: string, item: CartProduct, increase: boolean) => {
    const productId = item.productId?._id || item._id;
    const newQuantity = increase ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity < 1) return;

    dispatch(updateCartQuantityThunk({
      userId,
      cartId: item._id,
      productId,
      quantity: newQuantity,
    }));
  };

  const removeProductFromCart = (cartId: string) => {
    dispatch(removeFromCartThunk(cartId));
  };

  const removeAllProductFromCart = () => {
    dispatch(clearCartThunk());
  };

  return (
    <Popover>
      <PopoverTrigger className="relative">
        {items?.length > 0 && (
          <Badge
            variant="outline"
            className="absolute -top-1 -right-1 bg-white text-[10px] px-[6px] border border-black"
          >
            {items.length}
          </Badge>
        )}
        <img
          className="cursor-pointer"
          height={24}
          width={24}
          src="/cart.png"
          alt="cart icon"
        />
      </PopoverTrigger>

      <PopoverContent className="w-96">
        {items?.length === 0 || !items ? (
          <div className="w-full max-w-md text-center py-4">
            <img
              src="/emptyCart.png"
              alt="empty cart"
              width={250}
              height={250}
              className="mx-auto"
            />
            <h2 className="text-xl font-bold mt-2">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-gray-500 mt-1">
              Add items to make magic happen!
            </p>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="border-b pb-4 flex justify-between px-4">
              <h2 className="text-xl font-bold">Shopping Bag</h2>
            </div>

            <div className="py-4 max-h-96 overflow-y-auto space-y-4">
              {items.map((item, index) => (
                <div
                  key={item._id || index}
                  className="px-4 py-2 bg-white hover:bg-gray-50 transition"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 flex-shrink-0 relative">
                      <img
                        src={item.productId?.image?.[0] || "/fallback.jpg"}
                        alt="Product"
                        className="object-cover rounded w-full h-full"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-sm">
                          {item?.productId?.productName || item?.productName}
                        </h3>
                        <button onClick={() => removeProductFromCart(item._id)}>
                          <img
                            width={16}
                            height={16}
                            src="/icons/close.png"
                            alt="Remove"
                          />
                        </button>
                      </div>

                      <div className="text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-2">
                          <span>Size: {item.size}</span>
                          <span
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: item.color || "#CAB490" }}
                          />
                        </div>

                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <button
                              className="w-6 h-6 border rounded-full flex justify-center items-center"
                              onClick={() =>
                                userId &&
                                handleQuantityChange(userId, item, false)
                              }
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              className="w-6 h-6 border rounded-full flex justify-center items-center"
                              onClick={() =>
                                userId &&
                                handleQuantityChange(userId, item, true)
                              }
                            >
                              +
                            </button>
                          </div>
                          <span className="font-medium">
                            ₹{" "}
                            {new Intl.NumberFormat("en-IN").format(
                              item?.productId?.price
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 px-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  ₹ {new Intl.NumberFormat("en-IN").format(subtotal)}
                </span>
              </div>
              <div className="flex gap-2.5">
                <Link to="/checkout" className="w-full">
                  <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                    Checkout
                  </button>
                </Link>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={removeAllProductFromCart}
                      >
                        <Trash2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove all products</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default Cartpopup;