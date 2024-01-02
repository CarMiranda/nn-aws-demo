import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {"name": ""},
  reducers: {
    userLoggedIn(state, action) {
      state.name = action.payload.name;
    }
  }
});

export const { userLoggedIn } = userSlice.actions;
export default userSlice.reducer;

