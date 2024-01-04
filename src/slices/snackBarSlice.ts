import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SnackBarState } from "../types";

const initialState: SnackBarState = {
    open: false,
    message: '',
}

const snackBarSlice = createSlice({
    name: 'snackBar',
    initialState,
    reducers: {
        showSnackBar: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
            state.open = true;
        },
        hideSnackBar: (state) => {
            state.open = false;
            state.message = '';
        }
    }
})

export const {
    showSnackBar,
    hideSnackBar,
} = snackBarSlice.actions;
export default snackBarSlice.reducer;