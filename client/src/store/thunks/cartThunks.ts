import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  addToCartData,
  clearCartData,
  removeFromCartData,
  updateCartItemData,
} from "../../api/cartApi";
import api from "../../utils/baseUrl";
import type { CartData, CartResponse, updateCartQuantity } from "../types/cart";

// Add item to cart
export const addToCartThunk = createAsyncThunk<
  CartResponse,
  CartData,
  { rejectValue: string }
>("cart/addToCart", async (cartData, { rejectWithValue }) => {
  const token = localStorage.getItem("token");
  if (!token) return rejectWithValue("AUTH_REQUIRED"); // <— UI can check this

  try {
    const response = await addToCartData(cartData);
    if (!response) return rejectWithValue("No response from server");
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Unknown Axios error"
      );
    }
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred");
  }
});

// Fetch all cart items
export const fetchCartItemsThunk = createAsyncThunk<
  CartResponse,
  void,
  { rejectValue: string }
>("cart/fetchCartItems", async (_, { rejectWithValue }) => {
  const token = localStorage.getItem("token");
  if (!token) return rejectWithValue("User is not logged in");

  try {
    const { data } = await api.get<CartResponse>("/api/user/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart items"
      );
    }
    return rejectWithValue("Unknown error occurred");
  }
});

// Update quantity of cart item
export const updateCartQuantityThunk = createAsyncThunk<
  CartResponse,
  updateCartQuantity,
  { rejectValue: string }
>("cart/updateCartQuantity", async (payload, { rejectWithValue }) => {
  const token = localStorage.getItem("token");
  if (!token) return rejectWithValue("Missing token");

  try {
    const { data } = await updateCartItemData(payload, token);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart item"
      );
    }
    return rejectWithValue("Unknown error occurred");
  }
});

// Clear the entire cart
export const clearCartThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("cart/clearCart", async (_, { rejectWithValue }) => {
  try {
    await clearCartData();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
    return rejectWithValue("Unknown error occurred");
  }
});

// Remove an item from cart
export const removeFromCartThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("cart/removeFromCart", async (cartId, { rejectWithValue, dispatch }) => {
  const token = localStorage.getItem("token");
  if (!token) return rejectWithValue("Missing token");

  try {
    await removeFromCartData(cartId);
    dispatch(fetchCartItemsThunk()); // Refresh the cart
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item from cart"
      );
    }
    return rejectWithValue("Unknown error occurred");
  }
});
