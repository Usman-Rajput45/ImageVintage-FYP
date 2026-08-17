import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import authReducer from "./slices/authSlice";
import { injectStore } from "../utils/axios";

const persistConfig = {
  key: "auth",
  storage: sessionStorage,
  whitelist: ["user", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const rootReducer = {
  auth: persistedAuthReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

injectStore(store);

const persistor = persistStore(store);

export { store, persistor };
export default store;
