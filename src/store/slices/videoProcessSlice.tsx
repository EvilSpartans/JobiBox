import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { VideoProcess } from "../../models/VideoProcess";
import {
  compileVideoProcess,
  createVideoProcess,
  deleteVideoProcess,
  getVideoProcess,
  getVideoProcesses,
  updateVideoProcess,
} from "../../services/videoProcess.service";

// Types
interface VideoProcessState {
  status: string;
  error: string | null;
  videoProcesses: VideoProcess[];
  videoProcess: VideoProcess | null;
}

const initialState: VideoProcessState = {
  status: "",
  error: null,
  videoProcesses: [],
  videoProcess: null,
};

export const videoProcessSlice = createSlice({
  name: "videoProcess",
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      /** Get all */
      .addCase(getVideoProcesses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVideoProcesses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.videoProcesses = action.payload;
      })
      .addCase(getVideoProcesses.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Failed to fetch videoProcesses";
      })
      /** Get one */
      .addCase(getVideoProcess.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVideoProcess.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.videoProcess = action.payload;
      })
      .addCase(getVideoProcess.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch videoProcess";
      })
      /** Create */
      .addCase(createVideoProcess.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createVideoProcess.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createVideoProcess.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Failed to create videoProcess";
      })
      /** Update */
      .addCase(updateVideoProcess.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateVideoProcess.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateVideoProcess.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Failed to update videoProcess";
      })
      /** Compile */
      .addCase(compileVideoProcess.pending, (state) => {
        state.status = "loading";
      })
      .addCase(compileVideoProcess.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.videoProcess = action.payload;
      })
      .addCase(compileVideoProcess.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Failed to compile videoProcess";
      })
      /** Delete */
      .addCase(deleteVideoProcess.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteVideoProcess.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.videoProcess = action.payload;
      })
      .addCase(deleteVideoProcess.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Failed to delete videoProcess";
      });
  },
});

export const { changeStatus } = videoProcessSlice.actions;
export default videoProcessSlice.reducer;
