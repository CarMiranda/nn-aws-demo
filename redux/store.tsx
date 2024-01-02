import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";
import settingsReducer from "./reducers/settings";
import analysisReducer from "./reducers/analysis";

export const store = configureStore({
  reducer: {
    user: userReducer,
    settings: settingsReducer,
    analysis: analysisReducer,
  }
});
