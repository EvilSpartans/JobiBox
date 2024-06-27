import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import storage from "redux-persist/lib/storage";

import userSlice from "./slices/userSlice";
import postSlice from "./slices/postSlice";
import jobiboxSlice from "./slices/jobiboxSlice";
import videoProcessSlice from "./slices/videoProcessSlice";
import questionVideoSlice from "./slices/questionVideoSlice";

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
    questionVideo: questionVideoSlice,
    jobibox: jobiboxSlice
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