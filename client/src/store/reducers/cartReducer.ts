'use client';
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_ITEM, CLEAR_CART, ADD_TO_CART_ERR, FETCH_CART_REQUEST, FETCH_CART_SUCCESS, FETCH_CART_ERR } from '@/constant/cartConstants'

interface CartItem {
    id: string;
    quantity: number;
    // Add other cart item properties here
}

interface CartState {
    items: CartItem[];
    loading: boolean;
    error: string | null;
}

interface CartAction {
    type: string;
    payload: CartItem[] | string | null;
}

const initialState: CartState = {
    items: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : [],
    loading: true,
    error: null,
};

export const cartReducer = (state = initialState, action: CartAction): CartState => {
    switch (action.type) {

        case FETCH_CART_REQUEST:
            return {
                ...state,
                items: [], 
                loading: true,
            };
        case FETCH_CART_SUCCESS:
            return {
                ...state,
                items: Array.isArray(action.payload) ? action.payload : [],
                loading: false,
                error: null
            };

        case FETCH_CART_ERR:
            return {
                ...state,
                error: typeof action.payload === 'string' ? action.payload : 'An error occurred',
                loading: false,
                items: state.items
            };

        case ADD_TO_CART:
            return {
                ...state,
                items: Array.isArray(action.payload) ? action.payload : state.items,
                error: null
            };

        case ADD_TO_CART_ERR:
            return {
                ...state,
                items: [], 
                error: typeof action.payload === 'string' ? action.payload : 'Cart error occurred'
            };

        case REMOVE_FROM_CART:
            return {
                ...state,
                items: Array.isArray(action.payload) ? action.payload : state.items,
            };

        case UPDATE_CART_ITEM:
            return {
                ...state,
                items: Array.isArray(action.payload) ? action.payload : state.items,
            };

        case CLEAR_CART:
            return {
                ...state,
                items: [],
                error: null
            };

        default:
            return state;
    }
};
