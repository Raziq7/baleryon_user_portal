import {
  GET_ALL_PRODUCTS_ERR,
  GET_ALL_PRODUCTS_REQUEST,
  GET_ALL_PRODUCTS_SUCCESS,
  GET_PRODUCT_DETAILS_ERR,
  GET_PRODUCT_DETAILS_REQUEST,
  GET_PRODUCT_DETAILS_SUCCESS,
} from "@/constant/productConstant";

const initialState = {
  loading: false,
  product: null,
  error: null,
};

// getProductDetailsReducer
export const getProductDetailsReducer = (
  state = initialState,
  action: { type: string; payload: object }
) => {
  switch (action.type) {
    case GET_PRODUCT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        product: action.payload,
      };

    case GET_PRODUCT_DETAILS_ERR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

const initialProductState = {
  products: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 0,
  totalProducts: 0,
  productDetails: {},
};

export const getAllproductsReducer = (state = initialProductState,
  action: {
    type: string;
    payload: {
      page: number;
      products: Array<object>;
      totalPages: number;
      totalProducts: number;
    };
  }
) => {
  switch (action.type) {
    case GET_ALL_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_ALL_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products:
          action.payload.page === 1
            ? action.payload.products
            : [...state.products, ...action.payload.products],
        page: action.payload.page,
        totalPages: action.payload.totalPages,
        totalProducts: action.payload.totalProducts,
      };
    case GET_ALL_PRODUCTS_ERR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
