import { createContext, useContext, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      const userId = sessionStorage.getItem("userId"); // Retrieve userId from local storage
      if (userId) {
        try {
          // the editUsers end point as it is used here is used to fetch the details of the individual user by taking in the userId fetched by triggering the login endpoint as paramter
          const response = await axios.post(
            "http://localhost:8080/users/editUsers",
            { id: userId },
            { withCredentials: true }
          );
          const user = response.data;
          dispatch({
            type: HANDLERS.INITIALIZE,
            payload: user,
          });
        } catch (error) {
          console.error(error);
          dispatch({
            type: HANDLERS.INITIALIZE,
          });
        }
      } else {
        dispatch({
          type: HANDLERS.INITIALIZE,
        });
      }
    };

    initialize();
  }, []);

  const signIn = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/auth/login",
        { email, password },
        { withCredentials: true }
      );
      console.log("signin res: ", res);
      const userId = res.data.user;

      if (!userId) {
        console.log("Could not get userId");
        throw new Error("Could not get userId");
      }

      sessionStorage.setItem("userId", userId); // Store userId in local storage

      const response = await axios.post(
        "http://localhost:8080/users/editUsers",
        { id: userId },
        { withCredentials: true }
      );
      console.log("User: ", response.data.data);
      const user = response.data.data;

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user,
      });
    } catch (err) {
      console.error("Error during sign-in:", error);
      throw err; // Rethrow the error to be caught in the calling component
    }
  };

  const signUp = async (name, email, phone, role, password, confirmpassword) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/auth/register",
        {
          name,
          email,
          phone,
          role,
          password,
          confirmpassword,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error during sign-up:", err);
      throw err;
    }
  };

  const otpAuth = async (email, otp) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/auth/confirmOTP",
        { email: email, otp: otp },
        { withCredentials: true }
      );
      console.log("otp response: ", res);
    } catch (err) {
      console.error("Error during sign-in:", error);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await axios.get("http://localhost:8080/auth/logout", {}, { withCredentials: true });
      sessionStorage.removeItem("userId"); // we remove userId from local storage

      dispatch({
        type: HANDLERS.SIGN_OUT,
      });
    } catch (err) {
      console.error("Error during sign-out:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        otpAuth,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
