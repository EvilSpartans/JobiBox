import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GreenFilter } from "../../models/GreenFilter";
import { createGreenFilter, getGreenFilters } from "../../services/greenFilter.service";

// Types
interface GreenFilterState {
    status: string;
    error: string | null;
    greenFilters: GreenFilter[];
}

const initialState: GreenFilterState = {
    status: '',
    error: null,
    greenFilters: [],
};

// Slice
export const greenFilterSlice = createSlice({
    name: "greenFilter",
    initialState,
    reducers: {
        changeStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getGreenFilters.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getGreenFilters.fulfilled, (state, action: PayloadAction<GreenFilter[]>) => {
                state.status = 'succeeded';
                state.error = null;
                state.greenFilters = action.payload;
            })
            .addCase(getGreenFilters.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch greenFilters';
            })
            .addCase(createGreenFilter.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createGreenFilter.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.greenFilters.push(action.payload);
            })
            .addCase(createGreenFilter.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || 'Failed to fetch greenFilters';
            });
    },
});

export const { changeStatus } = greenFilterSlice.actions;

export default greenFilterSlice.reducer;
