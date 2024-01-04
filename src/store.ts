import { configureStore } from "@reduxjs/toolkit";
import snackBarSlice from "./slices/snackBarSlice";

export const store = configureStore({
    reducer: {
        snackBar: snackBarSlice,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;