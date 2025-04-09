import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubCategory } from "../../models/Category";
import { getAllSubCategories } from "../../services/category.service";

// Types
interface SubCategoryState {
    status: string;
    error: string | null;
    subCategories: SubCategory[];
}

const initialState: SubCategoryState = {
    status: '',
    error: null,
    subCategories: [],
};

export const subCategorySlice = createSlice({
    name: "subCategory",
    initialState,
        reducers: {
            changeStatus: (state, action: PayloadAction<string>) => {
                state.status = action.payload;
            },
        },
    extraReducers(builder) {
        builder
            .addCase(getAllSubCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllSubCategories.fulfilled, (state, action: PayloadAction<SubCategory[]>) => {
                state.status = 'succeeded';
                state.error = null;
                state.subCategories = action.payload;
            })
            .addCase(getAllSubCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch categories';
            })
        ;
    },
});

export const { changeStatus } = subCategorySlice.actions;

export default subCategorySlice.reducer;
