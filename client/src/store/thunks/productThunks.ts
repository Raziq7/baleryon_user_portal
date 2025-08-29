// src/store/thunks/productThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductDetail } from "../types/product";
import {
  fetchProductById,
  fetchAllProducts,
  fetchProducts,
} from "../../api/productApi";

// Fetch a single product by ID
export const fetchProductByIdThunk = createAsyncThunk<
  ProductDetail,
  string,
  { rejectValue: string }
>("product/fetchProductById", async (productId, { rejectWithValue }) => {
  try {
    const data = await fetchProductById(productId);
    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// (Optional) Fetch all products
export const fetchAllProductsThunk = createAsyncThunk<
  ProductDetail[],
  void,
  { rejectValue: string }
>("product/fetchAllProducts", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchAllProducts();
    return data;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// src/store/thunks/productThunks.ts
export const fetchProductsThunk = createAsyncThunk<
  ProductDetail[],
  { page?: number; limit?: number } | undefined,
  { rejectValue: string }
>("product/fetchProducts", async (args, { rejectWithValue }) => {
  try {
    const list = await fetchProducts(args?.page ?? 1, args?.limit ?? 10);
    return list;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
