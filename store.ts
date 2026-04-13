import { configureStore } from "@reduxjs/toolkit";
// Check your path: is it "./src/reducer/..." or just "./reducer/..."?
import userReducer from "./src/reducer/user.reducer"; 

export const store = configureStore({
  reducer: {
    // Only keep the reducers that actually exist in your project
    user: userReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;