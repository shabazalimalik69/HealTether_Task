import {
  USER_SIGNIN_ERROR,
  USER_SIGNIN_LOADING,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_SIGNUP_ERROR,
  USER_SIGNUP_LOADING,
  USER_SIGNUP_SUCCESS,
} from "./userActionTypes";

const token = localStorage.getItem("token") || "";
const email = localStorage.getItem("email") || "";
const initState = {
  token: token,
  email: email,
  loading: false,
  error: false,
};

export const authReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case USER_SIGNUP_LOADING: {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }
    case USER_SIGNUP_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }
    case USER_SIGNUP_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: false,
      };
    }
    case USER_SIGNIN_LOADING: {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }
    case USER_SIGNIN_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }
    case USER_SIGNIN_SUCCESS: {
      console.log("payload",payload)
      localStorage.setItem("token", payload.accessToken);
      localStorage.setItem("email", payload.data.email);
      return {
        ...state,
        loading: false,
        error: false,
        token: payload.accessToken,
        email: payload.data.email,
      };
    }
    case USER_SIGNOUT: {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      return {
        ...state,
        token: "",
        email: "",
      };
    }
    default: {
      return state;
    }
  }
};
