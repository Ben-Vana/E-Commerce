import authReducer from "./auth";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    authReducer,
  },
});

export default store;
