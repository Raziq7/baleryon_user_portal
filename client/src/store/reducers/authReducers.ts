// Importing Constants
import { 
  SUBMIT_LOGIN_DATA_SUCCESS, 
  SUBMIT_LOGIN_DATA_REQUEST, 
  SUBMIT_LOGIN_DATA_ERR,
  OTP_VERIFIED_REQUEST,
  OTP_VERIFIED_SUCCESS,
  OTP_VERIFIED_ERR,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_ERR
} from "@/constant/authConstant";

const initialState = {
  loading: false,
  login: null,
  error: null,
  otpVerified: false, // New state for OTP verification
  otpErrorMsg: null, // To handle OTP-related errors
};

// Reducer for handling login and OTP verification state
export const submitLoginReducer = (state = initialState, action : {type: string, payload: Array<object>}) => {
  switch (action.type) {
    // Login request started
    case SUBMIT_LOGIN_DATA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null, // Clear any previous error on request
      };

    // Login successful
    case SUBMIT_LOGIN_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        login: action.payload, // Store the login data on success
      };

    // Login failed
    case SUBMIT_LOGIN_DATA_ERR:
      return {
        ...state,
        loading: false,
        error: action.payload, // Store error message
      };

    default:
      return state;
  }
};


// submitOtpReducer
export const submitOtpReducer = (state = initialState, action : {type: string, payload: Array<object>}) => {
  switch (action.type) {
    // OTP verification request started
    case OTP_VERIFIED_REQUEST:
      return {
        ...state,
        loading: true,
        otpVerification: action.payload,
        otpErrorMsg: null, // Clear OTP error
      };

    // OTP verification successful
    case OTP_VERIFIED_SUCCESS:
      return {
        ...state,
        loading: false,
        otpVerification: action.payload, // Set OTP verified to true
        otpErrorMsg: null, // Clear OTP error
      };

    // OTP verification failed
    case OTP_VERIFIED_ERR:
      return {
        ...state,
        loading: false,
        otpVerification: false, // Set OTP verification status to false
        otpErrorMsg: action.payload, // Store OTP-related error message
      };

    default:
      return state;
  }
};



// logoutReducer
export const logoutReducer = (state = initialState, action : {type: string, payload: Array<object>}) => {
  switch (action.type) {

    case USER_LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
        logout: action.payload,
        error: null,
      };

    // OTP verification successful
    case USER_LOGOUT_SUCCESS:
      return {
        ...state,
        loading: false,
        logout: action.payload,
        error: null,
      };

    // OTP verification failed
    case USER_LOGOUT_ERR:
      return {
        ...state,
        loading: false,
        logout: null,
        error: action.payload,
      };

    default:
      return state;
  }
};