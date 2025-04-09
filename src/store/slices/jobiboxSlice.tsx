import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobiBox } from "../../models/JobiBox";
import { getJobibox, getJobiboxPortals, updateJobibox } from "../../services/jobibox.service";

// Types
interface JobiBoxState {
    status: string;
    error: string | null;
    jobiBoxes: JobiBox[];
    jobiBox: JobiBox | null
}

const initialState: JobiBoxState = {
    status: '',
    error: null,
    jobiBoxes: [],
    jobiBox: null,
};

export const jobiboxSlice = createSlice({
    name: "jobibox",
    initialState,
    reducers: {
        changeStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getJobibox.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getJobibox.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.jobiBoxes = action.payload;
            })
            .addCase(getJobibox.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || 'Failed to fetch jobiboxes';
            })
            .addCase(getJobiboxPortals.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getJobiboxPortals.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.jobiBox = action.payload;
            })
            .addCase(getJobiboxPortals.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || 'Failed to fetch jobibox';
            })
            .addCase(updateJobibox.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateJobibox.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.jobiBox = action.payload;
            })
            .addCase(updateJobibox.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || 'Failed to update jobibox';
            });
    },
});

export const { changeStatus } = jobiboxSlice.actions;
export default jobiboxSlice.reducer;
