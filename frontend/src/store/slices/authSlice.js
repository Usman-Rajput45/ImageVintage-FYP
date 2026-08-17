import { createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  guestMode: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.guestMode = !!action.payload?.isGuest;
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.guestMode = false;
    },
  },
});

export const { setLoading, setError, setUser, clearUser } = authSlice.actions;

// Thunk: register a new account (FR-01 / UC-02)
export const signup = (userData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.post("/api/auth/register", userData);
    const payload = data?.data ?? data;

    dispatch(
      setUser({
        fullName: payload?.user?.fullName ?? userData.fullName,
        email: payload?.user?.email ?? userData.email,
        token: payload?.token ?? null,
        isGuest: false,
      })
    );

    return { success: true, user: payload?.user };
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Signup failed";
    dispatch(setError(message));
    return { success: false, error: message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk: log in (FR-01 / UC-03)
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await api.post("/api/auth/login", credentials);
    const payload = data?.data ?? data;

    dispatch(
      setUser({
        fullName: payload?.user?.fullName,
        email: payload?.user?.email,
        token: payload?.token,
        isGuest: false,
      })
    );

    return { success: true, user: payload?.user };
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Invalid email or password";
    dispatch(setError(message));
    return { success: false, error: message };
  } finally {
    dispatch(setLoading(false));
  }
};

// Thunk: continue as guest (FR-10 / UC-06) — no account, results are not saved
export const continueAsGuest = () => (dispatch) => {
  dispatch(
    setUser({
      fullName: "Guest",
      email: null,
      token: null,
      isGuest: true,
    })
  );
};

// Thunk: log out (FR-13 / UC-09)
export const logout = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.post("/api/auth/logout").catch(() => {
      // Stateless JWT: even if the network call fails, still clear the client session.
    });
    dispatch(clearUser());
    return { success: true };
  } finally {
    dispatch(setLoading(false));
  }
};

export default authSlice.reducer;
