import api from "../utils/baseUrl";
import axios, { AxiosError } from "axios";
import type { CartData, CartResponse } from "../store/types/cart";

interface ApiErrorResponse {
  message: string;
}

// | Add to Cart
export const addToCartData = async (cartData: CartData) => {
  try {
    const token = localStorage.getItem("token");
    console.log(token, "slkdjfalskjhdfaklsjdhfsldh");

    if (!token) {
      return Promise.reject(new Error("User is not logged in"));
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await api.post<CartResponse>(
      "/api/user/cart/",
      cartData,
      config
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new (error.response?.data?.message || "Login failed")();
    }
  }
};

// | Fetch Cart
export const fetchCartData = async (): Promise<CartResponse | undefined> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("User is not logged in.");
    return;
  }

  try {
    const response = await api.get<CartResponse>("/api/user/cart/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    console.error("Error fetching cart:", err.message);
  }
};

// | Remove from Cart
export const removeFromCartData = async (cartId: string): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("User is not logged in.");
    return;
  }

  try {
    await api.delete(`/api/user/cart/?cartId=${cartId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    console.error("Error removing from cart:", err.message);
  }
};

// | Update Cart Item
export const updateCartItemData = async (
  payload: {
    userId: string;
    cartId: string;
    productId: string;
    quantity: number;
  },
  token: string
) => {
  return await api.put(
    `/api/user/cart/${payload.userId}`,
    {
      productId: payload.productId,
      quantity: payload.quantity,
      cartId: payload.cartId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// | Clear Cart
export const clearCartData = async (): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("User is not logged in.");
    return;
  }

  try {
    await api.delete("/api/user/cart/clear", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const err = error as AxiosError<ApiErrorResponse>;
    console.error("Error clearing cart:", err.message);
  }
};
