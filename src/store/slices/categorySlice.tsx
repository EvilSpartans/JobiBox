import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../models/Category";
import { getAllCategories } from "../../services/category.service";

// Types
interface CategoryState {
    status: string;
    error: string | null;
    categories: Category[];
}

const initialState: CategoryState = {
    status: '',
    error: null,
    categories: [],
};

export const categorySlice = createSlice({
    name: "category",
    initialState,
        reducers: {
            changeStatus: (state, action: PayloadAction<string>) => {
                state.status = action.payload;
            },
        },
    extraReducers(builder) {
        builder
            .addCase(getAllCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.status = 'succeeded';
                state.error = null;
                state.categories = action.payload;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch categories';
            })
        ;
    },
});

export const { changeStatus } = categorySlice.actions;

export default categorySlice.reducer;
