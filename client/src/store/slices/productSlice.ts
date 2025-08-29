// src/store/slices/productSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductDetail } from "../types/product";
import {
  fetchProductByIdThunk,
  fetchAllProductsThunk,
  fetchProductsThunk,        // <-- add this import
} from "../thunks/productThunks";
import type { RootState } from "@/store/store";

interface ProductState {
  product: ProductDetail | null;
  loading: boolean;
  error: string | null;
  list: ProductDetail[];
  listLoading: boolean;
  listError: string | null;
}

const initialState: ProductState = {
  product: null,
  loading: false,
  error: null,
  list: [],
  listLoading: false,
  listError: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError: (state) => { state.error = null; },
    clearProductListError: (state) => { state.listError = null; },
  },
  extraReducers: (builder) => {
    // single product
    builder
      .addCase(fetchProductByIdThunk.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchProductByIdThunk.fulfilled, (state, action: PayloadAction<ProductDetail>) => {
        state.loading = false; state.product = action.payload;
      })
      .addCase(fetchProductByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "Failed to load product";
      });

    // all products (non-paginated)
    builder
      .addCase(fetchAllProductsThunk.pending, (state) => {
        state.listLoading = true; state.listError = null;
      })
      .addCase(fetchAllProductsThunk.fulfilled, (state, action: PayloadAction<ProductDetail[]>) => {
        state.listLoading = false; state.list = action.payload;
      })
      .addCase(fetchAllProductsThunk.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = (action.payload as string) || action.error.message || "Failed to load products";
      });

    // paginated products  <-- THIS WAS MISSING
    builder
      .addCase(fetchProductsThunk.pending, (state) => {
        state.listLoading = true; state.listError = null;
      })
      .addCase(fetchProductsThunk.fulfilled, (state, action: PayloadAction<ProductDetail[]>) => {
        state.listLoading = false; state.list = action.payload;
      })
      .addCase(fetchProductsThunk.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = (action.payload as string) || action.error.message || "Failed to load products";
      });
  },
});

export const selectProduct = (s: RootState) => s.product.product;
export const selectProductLoading = (s: RootState) => s.product.loading;
export const selectProductError = (s: RootState) => s.product.error;
export const selectProducts = (s: RootState) => s.product.list;
export const selectProductsLoading = (s: RootState) => s.product.listLoading;
export const selectProductsError = (s: RootState) => s.product.listError;

export const { clearProductError, clearProductListError } = productSlice.actions;
export default productSlice.reducer;
