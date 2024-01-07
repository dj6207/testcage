import { configureStore } from "@reduxjs/toolkit";
import snackBarSlice from "./slices/snackBarSlice";
import appSettingsSlice from "./slices/appSettingsSlice";

export const store = configureStore({
    reducer: {
        snackBar: snackBarSlice,
        appSettings: appSettingsSlice,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;