import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Theme } from "../../models/Theme";
import { createTheme, getThemes } from "../../services/theme.service";

// Types
interface ThemeState {
    status: string;
    error: string | null;
    themes: Theme[];
}

const initialState: ThemeState = {
    status: '',
    error: null,
    themes: [],
};

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        changeStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getThemes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getThemes.fulfilled, (state, action: PayloadAction<Theme[]>) => {
                state.status = 'succeeded';
                state.error = null;
                state.themes = action.payload;
            })
            .addCase(getThemes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch themes';
            })
            .addCase(createTheme.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createTheme.fulfilled, (state, action: PayloadAction<Partial<Theme>>) => {
                state.status = 'succeeded';
                state.error = null;
                state.themes.push(action.payload as Theme);
            })
            .addCase(createTheme.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to create theme';
            });
    },
});

export const { } = themeSlice.actions;

export default themeSlice.reducer;
