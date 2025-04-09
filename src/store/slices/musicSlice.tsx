import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Music } from "../../models/Music";
import { createMusic, getMusics } from "../../services/music.service";

// Types
interface MusicState {
    status: string;
    error: string | null;
    musics: Music[];
}

const initialState: MusicState = {
    status: '',
    error: null,
    musics: [],
};

export const musicSlice = createSlice({
    name: "music",
    initialState,
    reducers: {
        changeStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(getMusics.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getMusics.fulfilled, (state, action: PayloadAction<Music[]>) => {
                state.status = 'succeeded';
                state.error = null;
                state.musics = action.payload;
            })
            .addCase(getMusics.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch musics';
            })
            .addCase(createMusic.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createMusic.fulfilled, (state, action: PayloadAction<Partial<Music>>) => {
                state.status = 'succeeded';
                state.error = null;
                state.musics.push(action.payload as Music);
            })
            .addCase(createMusic.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to create music';
            });
    },
});

export const { } = musicSlice.actions;

export default musicSlice.reducer;