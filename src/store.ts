import { configureStore } from "@reduxjs/toolkit";
import testSampleTableSlice from "./slices/testSampleTableSlice";

export const store = configureStore({
    reducer: {
        testSampleTable: testSampleTableSlice,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;