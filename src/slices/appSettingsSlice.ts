import { createSlice } from "@reduxjs/toolkit";
import { AppSettingsState } from "../types";

const initialState: AppSettingsState = {
    editMode: false,
}

const appSettingsSlice = createSlice({
    name: 'appSettings',
    initialState,
    reducers: {
        enableEditMode: (state) => {
            state.editMode = true;
        },
        disableEditMode: (state) => {
            state.editMode = false;
        },
    },
});

export const {
    enableEditMode,
    disableEditMode,
} = appSettingsSlice.actions;
export default appSettingsSlice.reducer;