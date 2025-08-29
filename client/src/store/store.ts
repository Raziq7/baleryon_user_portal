import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import cartReducer  from './slices/cartSclice';
import wishlistReducer from './slices/wishlistSlice';
import authReducer from './slices/authSlice';
import productReducer from "./slices/productSlice";
// import { getAllproductsReducer, getProductDetailsReducer } from './reducers/productReducers';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    product: productReducer,
    // getAllProducts: getAllproductsReducer,
    // productDetails: getProductDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
