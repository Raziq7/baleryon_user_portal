import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Locate } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-hot-toast";

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
  id: string; // existing address id (when chosen)
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

  // Addresses
  const [addressList, setAddressList] = useState<AddressInterface[]>([]);
  const [selectedExistingIndex, setSelectedExistingIndex] =
    useState<string>("0"); // for RadioGroup
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Unified address state (used for both existing and new)
  const [address, setAddress] = useState<Address>({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    number: "",
    id: "",
  });

  // UI states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // Pricing (example)
  const delivery = 16.99;
  const tax = 12.99;

  // Discount sum
  const totalDiscount = items.reduce((acc, item) => {
    const discount =
      typeof item.productId === "object" && (item.productId as any).discount
        ? (item.productId as any).discount
        : 0;
    return acc + discount;
  }, 0);

  // Subtotal
  const subtotal = items.reduce((acc, item) => {
    const price =
      typeof item.productId === "object"
        ? (item.productId as any).price
        : item.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const totalBeforeTax = subtotal + delivery - totalDiscount;
  const orderTotal = totalBeforeTax + tax;

  // Stripe key (unused in this flow but kept if you mix gateways)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const stripePromise = loadStripe("pk_test_...");

  // ----- Address helpers -----
  const hydrateAddressFromExisting = (indexStr: string) => {
    const idx = parseInt(indexStr, 10);
    const selected = addressList[idx];
    if (!selected) return;

    setAddress({
      name: selected.name,
      street: selected.street,
      city: selected.city,
      state: selected.state,
      zip: selected.zip,
      number: selected.number,
      id: selected._id, // crucial: carry the id so backend knows it's existing
    });
  };

  // When user selects an existing address radio
  const handleExistingAddressSelect = (indexStr: string) => {
    setSelectedExistingIndex(indexStr);
    hydrateAddressFromExisting(indexStr);
  };

  // Load Razorpay
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

  // ----- Submit handler -----
  const handleSubmit = async () => {
    // Validation: items present
    if (!items || items.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      return;
    }

    // Validation: address fields
    // If using existing address: we expect address.id set + other fields present
    // If adding new: address.id should be "", but all fields must be filled.
    const requiredFields = [
      "name",
      "street",
      "city",
      "state",
      "zip",
      "number",
    ] as const;
    const missing = requiredFields.filter((k) => !address[k]);
    if (missing.length > 0) {
      toast.error("Please complete the address details before continuing.");
      return;
    }

    try {
      setProcessing(true);

      const prodList = items.map((item) => {
        const product =
          typeof item.productId === "object" ? (item.productId as any) : null;
        return {
          productId: product?._id || item._id,
          size: (item as any).size,
          color: (item as any).color,
          quantity: item.quantity,
          price: product?.price || item.price || 0,
        };
      });

      // Create order + get Razorpay order (controller will:
      // - Use address.id if present (existing), else create new address
      // - Create db Order with address ref
      const res = await getCheckout(totalBeforeTax, "INR", address, prodList);

      // Load Razorpay SDK
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        toast.error("Failed to load Razorpay. Please try again.");
        setProcessing(false);
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
          // Success
          try {
            await oraderPaymentUpdate(res.id, "paid");
            setDialogOpen(true);
            toast.success("Payment successful!");
            setTimeout(() => {
              setDialogOpen(false);
              navigate("/orderList");
            }, 1800);
          } catch (e) {
            toast.error(
              "Payment captured, but updating order failed. We'll fix this shortly."
            );
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: address.name,
          email: address.number, // you might want to change this to a real email
        },
        theme: {
          color: "#F37254",
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        toast.error("Razorpay SDK is not available.");
        setProcessing(false);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.message || "Failed to initiate payment. Please try again."
      );
      setProcessing(false);
    }
  };

  // ----- Data loading -----
  const fetchAddressList = async () => {
    try {
      const res = await listAddress();
      setAddressList(res || []);

      if (res && res.length > 0) {
        // Default to first address and hide the form
        setShowAddressForm(false);
        setSelectedExistingIndex("0");
        hydrateAddressFromExisting("0");
      } else {
        // No existing address -> show form by default (no id)
        setShowAddressForm(true);
        setAddress({
          name: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          number: "",
          id: "",
        });
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      // Degrade gracefully: show form if we can't fetch
      setShowAddressForm(true);
    }
  };

  const removeProductFromCart = async (productId: string) => {
    try {
      await removeFromCartData(productId);
      await dispatch(fetchCartItemsThunk());
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error removing product from cart:", error);
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchAddressList();
    dispatch(fetchCartItemsThunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isClient) return null;

  return (
    <>
      <div className="container mx-auto py-6 px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Addresses */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">Shipping Address</h3>

            {/* Existing addresses selector (only if we have at least one) */}
            {addressList.length > 0 && !showAddressForm && (
              <div className="mb-6">
                <RadioGroup
                  value={selectedExistingIndex}
                  onValueChange={handleExistingAddressSelect}
                  className="space-y-3"
                >
                  {addressList.map((addr, i) => (
                    <div
                      key={addr._id}
                      className={cn(
                        "flex items-center rounded-md border p-4",
                        selectedExistingIndex === i.toString()
                          ? "border-primary"
                          : "border-input"
                      )}
                    >
                      <RadioGroupItem
                        value={i.toString()}
                        id={`addr_${i}`}
                        className="mr-4"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <Locate size={18} className="text-muted-foreground" />
                        <Label
                          htmlFor={`addr_${i}`}
                          className="flex-1 cursor-pointer"
                        >
                          {addr.name}, {addr.street}, {addr.city}, {addr.state}{" "}
                          {addr.zip}
                          <span className="block text-xs text-muted-foreground">
                            Phone/Email: {addr.number}
                          </span>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                <div className="mt-4 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddressForm(true)}
                  >
                    Add another address
                  </Button>
                </div>
              </div>
            )}

            {/* Address form (shown if no existing or toggled to add new) */}
            {showAddressForm && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Add New Address</h4>
                  {addressList.length > 0 && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowAddressForm(false);
                        // Reset to first existing after cancel
                        if (addressList.length > 0) {
                          setSelectedExistingIndex("0");
                          hydrateAddressFromExisting("0");
                        }
                      }}
                    >
                      Use existing instead
                    </Button>
                  )}
                </div>

                {/* IMPORTANT: ensure AddressForm does NOT set id (new address) */}
                <AddressForm
                  address={{ ...address, id: "" }} // ensure blank id for "create new"
                  setAddress={(updater) =>
                    setAddress((prev) => {
                      const next =
                        typeof updater === "function"
                          ? (updater as (p: Address) => Address)(prev)
                          : updater;
                      return { ...next, id: "" }; // keep id blank on new-address path
                    })
                  }
                />
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {items?.map((item) => {
                  const product =
                    typeof item.productId === "object"
                      ? (item.productId as any)
                      : null;
                  const priceEach = product?.price ?? item.price ?? 0;
                  return (
                    <div key={item._id} className="flex justify-between mb-2">
                      <div className="flex items-start">
                        <span className="text-sm text-muted-foreground mr-2">
                          x {item.quantity}
                        </span>
                        <span className="text-sm">
                          {product ? product.productName : item.productName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          ₹ {priceEach * item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            removeProductFromCart(product?._id || item._id)
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
                  );
                })}

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
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!couponCode.trim()) {
                        toast.error("Enter a coupon code");
                        return;
                      }
                      toast.success("Coupon applied"); // wire to real API if needed
                    }}
                  >
                    Apply
                  </Button>
                </div>

                <Button
                  className="bg-black mt-4 w-full"
                  onClick={handleSubmit}
                  disabled={processing}
                >
                  {processing
                    ? "Processing..."
                    : `Confirm Payment ₹ ${totalBeforeTax.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success modal */}
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
