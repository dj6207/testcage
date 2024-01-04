import { createSlice } from "@reduxjs/toolkit";
import { TestSampleTableState } from "../types";

const initialState: TestSampleTableState = {
    data: []
}

const testSampleTableSlice = createSlice({
    name: 'testSampleTable',
    initialState,
    reducers: {
        setTestSampleData: (state, actions) => {
            state.data = actions.payload;
        },
    },
});

export const {
    setTestSampleData,
} = testSampleTableSlice.actions;
export default testSampleTableSlice.reducer;