import type {PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { CartProduct, CartResponse } from '../types/cart';
import type { RootState } from '@/store/store';
import {
  addToCartThunk,
  clearCartThunk,
  fetchCartItemsThunk,
  removeFromCartThunk,
  updateCartQuantityThunk
} from '../thunks/cartThunks';

interface CartState {
  items: CartProduct[];
  userId: string | null;
  loading: boolean;
  error: string | null;
  subtotal: number;
  total: number;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  total: 0,
  loading: false,
  error: null,
  userId: null
};

const cartSlice = createSlice({
  name: 'productCart',
  initialState,
  reducers: {
    removeProductToCart: (
      state,
      action: PayloadAction<{ _id: string; size: string; color: string }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item._id === action.payload._id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
          )
      );
    },
    editCartProduct: (
      state,
      action: PayloadAction<{
        _id: string;
        size: string;
        color: string;
        quantity: number;
      }>
    ) => {
      const product = state.items.find(
        (item) =>
          item._id === action.payload._id &&
          item.size === action.payload.size &&
          item.color === action.payload.color
      );
      if (product) {
        product.quantity = action.payload.quantity;
      }
    },
    clearCartError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action: PayloadAction<CartResponse>) => {
        state.loading = false;
        state.items = action.payload.items;
        state.userId = action.payload.userId;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to add to cart';
      });

    builder
      .addCase(fetchCartItemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItemsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.userId = action.payload.userId;
      })
      .addCase(fetchCartItemsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to fetch cart';
      });

    builder
      .addCase(updateCartQuantityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantityThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(updateCartQuantityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string' ? action.payload : 'Failed to update quantity';
      });

    builder
      .addCase(removeFromCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string' ? action.payload : 'Failed to remove item';
      });

    builder.addCase(clearCartThunk.fulfilled, (state) => {
      state.items = [];
    });
  }
});

export const selectCart = (state: RootState) => state.cart;

export const selectSubtotal = (state: RootState) => {
  const items = state?.cart?.items;
  if (!Array.isArray(items)) return 0;

  return items.reduce(
    (acc: number, item: CartProduct) =>
      acc + (item?.productId?.price || item.price || 0) * item.quantity,
    0
  );
};


export const { removeProductToCart, editCartProduct, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
