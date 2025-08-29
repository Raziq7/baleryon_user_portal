// Importing Constants

import { GET_USERS_ADDRESS_REQUEST, GET_USERS_ADDRESS_SUCCESS, GET_USERS_ADDRESS_ERR } from "@/constant/orderConstant";


const initialState = {
  loading: false,
  addressData: null,
  error: null,
};

export const addressFetchReducer = (state = initialState, action : {type: string, payload: Array<object>}) => {
  switch (action.type) {
    // Login request started
    case GET_USERS_ADDRESS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null, // Clear any previous error on request
      };

    case GET_USERS_ADDRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        addressData: action.payload, 
      };

    case GET_USERS_ADDRESS_ERR:
      return {
        ...state,
        loading: false,
        error: action.payload, // Store error message
      };

    default:
      return state;
  }
};