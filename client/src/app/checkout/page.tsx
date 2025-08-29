import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Locate } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Separator } from "../../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import CheckBoxLott from "../../components/lottie/CheckBoxLott";

import type { RootState, AppDispatch } from "../../store/store";
import { removeFromCartData } from "../../api/cartApi";
import {
  getCheckout,
  listAddress,
  oraderPaymentUpdate,
} from "../../api/checkoutApi";
import { fetchCartItemsThunk } from "../../store/thunks/cartThunks";

import { cn } from "../../lib/utils";
import AddressForm from "../../components/items/AddressForm";

type AddressInterface = {
  _id: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type Address = {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  number: string;
  id: string;
};

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayPaymentResponse) => void;
    prefill: {
      name: string;
      email: string;
    };
    theme: {
      color: string;
    };
  }

  interface RazorpayInstance {
    open(): void;
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items } = useSelector((state: RootState) => state.cart);

  const [isClient, setIsClient] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("0");
  const [couponCode, setCouponCode] = useState("");
  const [addressList, setAddressList] = useState<AddressInterface[]>([]);
  const [address, setAddress] = useState<Address>({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    number: "",
    id: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const delivery = 16.99;
  const tax = 12.99;

  // product discount
  const totalDiscount = items.reduce((acc, item) => {
    const discount =
      typeof item.productId === "object" && item.productId.discount
        ? item.productId.discount
        : 0;
    return acc + discount;
  }, 0);

  // product total
  const subtotal = items.reduce((acc, item) => {
    const price =
      typeof item.productId === "object"
        ? item.productId.price
        : item.price || 0;
    return acc + price * item.quantity;
  }, 0);
  const totalBeforeTax = subtotal + delivery - totalDiscount;
  const orderTotal = totalBeforeTax + tax;

  const stripePromise = loadStripe("pk_test_..."); // your Stripe publishable key

  const handleAddressSubmit = (e: string) => {
    setDeliveryMethod(e);
    const selected = addressList[parseInt(e)];
    setAddress({
      name: selected.name,
      street: selected.street,
      city: selected.city,
      state: selected.state,
      zip: selected.zip,
      number: selected.number,
      id: selected._id,
    });
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    if (
      !address.name ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip ||
      !address.number
    ) {
      setFormError("Please complete the address form before continuing.");
      return;
    }

    if (!items || items.length === 0) {
      setFormError("Your cart is empty. Please add items before checking out.");
      return;
    }

    setFormError(null);
    const prodList = items.map((item) => {
      const product =
        typeof item.productId === "object" ? item.productId : null;
      return {
        productId: product?._id || item._id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: product?.price || item.price || 0,
      };
    });

    const res = await getCheckout(totalBeforeTax, "INR", address, prodList);

    // Load Razorpay SDK
    const isRazorpayLoaded = await loadRazorpayScript();
    if (!isRazorpayLoaded) {
      alert("Failed to load Razorpay SDK. Please try again later.");
      return;
    }

    const options: RazorpayOptions = {
      key: "rzp_test_6gXYpAz9Ijk31I",
      amount: res.amount,
      currency: "INR",
      name: "The Baleryon",
      description: "Thank you for shopping with us!",
      order_id: res.id,
      handler: async function () {
        setDialogOpen(true);
        await oraderPaymentUpdate(res.id, "paid");
        setTimeout(() => {
          setDialogOpen(false);
          navigate("/orderList");
        }, 2000);
      },
      prefill: {
        name: address.name,
        email: address.number,
      },
      theme: {
        color: "#F37254",
      },
    };

    if (window.Razorpay) {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } else {
      console.error("Razorpay SDK not loaded");
    }
  };

  const fetchAddressList = async () => {
    try {
      const res = await listAddress();
      setAddressList(res);
      const first = res[0];
      setAddress({
        name: first.name,
        street: first.street,
        city: first.city,
        state: first.state,
        zip: first.zip,
        number: first.number,
        id: first._id,
      });
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const removeProductFromCart = async (productId: string) => {
    try {
      await removeFromCartData(productId);
      dispatch(fetchCartItemsThunk());
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchAddressList();
    dispatch(fetchCartItemsThunk());
  }, []);

  if (!isClient) return null;

  return (
    <>
      <div className="container mx-auto py-6 px-4 md:px-6 max-w-7xl">
        {formError && (
          <div className="text-red-600 bg-red-100 border border-red-200 px-3 py-2 rounded-md text-sm mt-2">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">Shipping address</h3>
            <div className="mb-8">
              <RadioGroup
                value={deliveryMethod}
                onValueChange={handleAddressSubmit}
                className="space-y-3"
              >
                {addressList.map((e, i) => (
                  <div
                    key={e._id}
                    className={cn(
                      "flex items-center rounded-md border p-4",
                      deliveryMethod === i.toString()
                        ? "border-primary"
                        : "border-input"
                    )}
                  >
                    <RadioGroupItem
                      value={i.toString()}
                      id={i.toString()}
                      className="mr-4"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <Locate size={18} className="text-muted-foreground" />
                      <Label
                        htmlFor={i.toString()}
                        className="flex-1 cursor-pointer"
                      >
                        {e.name}, {e.street}, {e.city}, {e.state} {e.zip}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="mb-8">
              <AddressForm address={address} setAddress={setAddress} />
            </div>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {items?.map((item) => (
                  <div key={item._id} className="flex justify-between mb-2">
                    <div className="flex items-start">
                      <span className="text-sm text-muted-foreground mr-2">
                        x {item.quantity}
                      </span>
                      <span className="text-sm">
                        {typeof item.productId === "object"
                          ? item.productId.productName
                          : item.productName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        ₹{" "}
                        {typeof item.productId === "object"
                          ? item.productId.price * item.quantity
                          : item.price * item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          removeProductFromCart(
                            typeof item.productId === "object"
                              ? item.productId._id
                              : item._id
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted-foreground"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>₹ {delivery.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>₹ {totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST</span>
                    <span>₹ {tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between font-medium">
                    <span>Order Total</span>
                    <span>₹ {orderTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-md text-green-600 text-sm flex justify-between">
                  <span>Your total saving on this order:</span>
                  <span className="font-medium">
                    ₹ {totalDiscount.toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">Apply</Button>
                </div>
                <Button className="bg-black mt-4 w-full" onClick={handleSubmit}>
                  Confirm Payment ₹ {totalBeforeTax.toFixed(2)}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Payment Confirmed</DialogTitle>
            <DialogDescription className="text-center">
              Your order has been successfully placed.
            </DialogDescription>
          </DialogHeader>
          <CheckBoxLott />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutPage;
