// src/store/slices/wishlistSlice.ts
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { ProductDetail } from "../types/product";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  removeAllWishList,
} from "../../api/wishlistApi";

/** Normalize any server/local item to a comparable product id string */
const extractWishlistItemId = (it: any): string | null => {
  if (!it) return null;
  if (typeof it === "string") return it; // local string id
  if (typeof it?._id === "string") return it._id; // local ProductDetail
  if (typeof it?.productId === "string") return it.productId; // server item
  if (typeof it?.productId?._id === "string") return it.productId._id; // server populated
  return null;
};

interface WishlistState {
  items: any[];
  initialized: boolean;
  loading: boolean;
  error?: string | null;
}

const initialState: WishlistState = {
  items: [],
  initialized: false,
  loading: false,
  error: null,
};

/* -------------------- THUNKS -------------------- */
export const fetchWishlistThunk = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getWishlist();
      return Array.isArray(data?.items) ? data.items : [];
    } catch (e: any) {
      return rejectWithValue(
        e?.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const addToWishlistThunk = createAsyncThunk(
  "wishlist/add",
  async (
    {
      productId,
      sizes,
      color,
    }: { productId: string; sizes: ProductDetail["sizes"]; color: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await addToWishlist(productId, sizes, color);
      await dispatch(fetchWishlistThunk());
      return true;
    } catch (e: any) {
      return rejectWithValue(
        e?.response?.data?.message || "Failed to add to wishlist"
      );
    }
  }
);

export const removeFromWishlistThunk = createAsyncThunk(
  "wishlist/remove",
  async (productId: string, { dispatch, rejectWithValue }) => {
    try {
      await removeFromWishlist(productId);
      await dispatch(fetchWishlistThunk());
      return true;
    } catch (e: any) {
      return rejectWithValue(
        e?.response?.data?.message || "Failed to remove from wishlist"
      );
    }
  }
);

export const clearWishlistThunk = createAsyncThunk(
  "wishlist/clear",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await removeAllWishList();
      await dispatch(fetchWishlistThunk());
      return true;
    } catch (e: any) {
      return rejectWithValue(
        e?.response?.data?.message || "Failed to clear wishlist"
      );
    }
  }
);

/* -------------------- SLICE -------------------- */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    /** For logged-out users: hydrate from localStorage */
    initializeWishlistFromLocal: (state) => {
      if (!state.initialized && typeof window !== "undefined") {
        const existing = JSON.parse(localStorage.getItem("wishlist") || "[]");
        state.items = Array.isArray(existing) ? existing : [];
        state.initialized = true;
      }
    },
    setLocalWishlist: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload ?? [];
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.initialized = true;
      })
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch wishlist";
      });
  },
});

export const { initializeWishlistFromLocal, setLocalWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;

/* -------------------- SELECTORS -------------------- */
export const selectWishlistState = (s: RootState) => s.wishlist;
export const selectWishlistItems = (s: RootState) => s.wishlist.items;
export const selectWishlistInitialized = (s: RootState) =>
  s.wishlist.initialized;

export const selectWishlistIdSet = createSelector(
  selectWishlistItems,
  (items) => {
    const set = new Set<string>();
    if (Array.isArray(items)) {
      for (const it of items) {
        const id = extractWishlistItemId(it);
        if (id) set.add(id);
      }
    }
    return set;
  }
);

/** ✅ Count you can show in the header badge */
export const selectWishlistCount = createSelector(
  selectWishlistIdSet,
  (idSet) => idSet.size
);
