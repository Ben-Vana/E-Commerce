import { createSlice } from "@reduxjs/toolkit";

interface configType {
  login: boolean;
  userData: object | string;
}

const initialConfig: configType = {
  login: false,
  userData: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialConfig,
  reducers: {
    login(state, action) {
      state.login = true;
      state.userData = action.payload;
    },
    logout: () => initialConfig,
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
