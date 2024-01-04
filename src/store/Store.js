import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import userSlice from "./features/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import postSlice from "./features/postSlice";
import videoProcessSlice from "./features/videoProcessSlice";
import transcriptSlice from "./features/transcriptSlice";
import portalSlice from "./features/portalSlice";

// saveUserOnlyFilter
const saveUserOnlyFilter = createFilter("user", ["user"]);

// persist config
const persistConfig = {
    key: "user",
    storage,
    whitelist: ["user"],
    transforms: [saveUserOnlyFilter]
};

const rootReducer = combineReducers({
    user: userSlice,
    post: postSlice,
    videoProcess: videoProcessSlice,
    transcription: transcriptSlice,
    portal: portalSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false
        }),
    devTools: true
})

export const persistor = persistStore(Store);