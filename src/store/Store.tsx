import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import storage from "redux-persist/lib/storage";

import userReducer from "./slices/userSlice";
import themeReducer from "./slices/themeSlice";
import questionReducer from "./slices/questionSlice";
import postReducer from "./slices/postSlice";
import musicReducer from "./slices/musicSlice";
import greenFilterReducer from "./slices/greenFilterSlice";
import jobiboxReducer from "./slices/jobiboxSlice";
import videoProcessReducer from "./slices/videoProcessSlice";
import questionVideoReducer from "./slices/questionVideoSlice";
import categoryReducer from "./slices/categorySlice";
import SubCategoryReducer from "./slices/subCategorySlice";

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
    user: userReducer,
    question: questionReducer,
    theme: themeReducer,
    music: musicReducer,
    greenFilter: greenFilterReducer,
    post: postReducer,
    videoProcess: videoProcessReducer,
    questionVideo: questionVideoReducer,
    jobibox: jobiboxReducer,
    category: categoryReducer,
    subCategory: SubCategoryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof Store.dispatch;

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const Store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(Store);