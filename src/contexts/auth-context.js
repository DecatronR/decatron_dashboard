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

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      const userId = sessionStorage.getItem("userId");
      const token = sessionStorage.getItem("token");
      if (userId) {
        try {
          // the editUsers end point as it is used here is used to fetch the details of the individual user by taking in the userId fetched by triggering the login endpoint as parameter
          const response = await axios.post(
            `${baseUrl}/users/editUsers`,
            { id: userId },
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
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
        `${baseUrl}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log("user response: ", res);
      const { user, token } = res.data;
      console.log("userid: ", user);
      console.log("token: ", token);

      if (!token) {
        console.log("Could not get token");
        throw new Error("Could not get token");
      }
      const userId = user;
      if (!userId) {
        console.log("Could not get userId");
        throw new Error("Could not get userId");
      }
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("token", token);

      // Verify token existence before making editUsers request
      if (!sessionStorage.getItem("token")) {
        throw new Error("Token not found");
      }

      // Await the editUsers response
      const response = await axios.post(
        `${baseUrl}/users/editUsers`,
        { id: userId },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("User: ", response.data.data);
      const userData = response.data.data;

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: userData,
      });
    } catch (err) {
      console.error("Error during sign-in:", err);
      throw err;
    }
  };

  const signUp = async (name, email, phone, role, password, confirmpassword) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await axios.post(
        `${baseUrl}/auth/register`,
        {
          name,
          email,
          phone,
          role,
          password,
          confirmpassword,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error during sign-up:", err);
      throw err;
    }
  };

  const otpAuth = async (email, otp) => {
    try {
      const res = await axios.post(
        `${baseUrl}/auth/confirmOTP`,
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
      await axios.get(`${baseUrl}/auth/logout`, {}, { withCredentials: true });
      sessionStorage.removeItem("token"); // Remove token from session storage
      sessionStorage.removeItem("userId"); // Remove userId from session storage

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
