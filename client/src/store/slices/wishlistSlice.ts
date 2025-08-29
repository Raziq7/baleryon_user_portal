import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { ProductDetail } from "../types/product";

interface WishlistState {
  items: ProductDetail[];
  initialized: boolean;
}

const initialState: WishlistState = {
  items: [],
  initialized: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    initializeWishlist: (state) => {
      if (!state.initialized && typeof window !== "undefined") {
        const existingWishlist = JSON.parse(
          localStorage.getItem("wishlist") || "[]"
        );
        state.items = existingWishlist;
        state.initialized = true;
      }
    },
    toggleWishlistItem: (state, action: PayloadAction<ProductDetail>) => {
      const existingIndex = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(action.payload);
      }
      // Update localStorage only on client side
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist", JSON.stringify(state.items));
      }
    },
  },
});

export const { toggleWishlistItem, initializeWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
