import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import storage from "redux-persist/lib/storage";

import userSlice from "./slices/userSlice";
import postSlice from "./slices/postSlice";
import jobiboxSlice from "./slices/jobiboxSlice";
import videoProcessSlice from "./slices/videoProcessSlice";
import questionVideoSlice from "./slices/questionVideoSlice";
import questionSlice from "./slices/questionSlice";
import groupQuestionSlice from "./slices/groupQuestionSlice";
import categorySlice from "./slices/categorySlice";
import greenFilterSlice from "./slices/greenFilterSlice";
import musicSlice from "./slices/musicSlice";
import themeSlice from "./slices/themeSlice";
import subCategorySlice from "./slices/subCategorySlice";
import citySlice from "./slices/citySlice";

// saveUserOnlyFilter
const saveUserOnlyFilter = createFilter("user", ["user"]);

// persist config
const persistConfig = {
 key: "user",
 storage,
 whitelist: ["user"],
 transforms: [saveUserOnlyFilter],
};

const rootReducer = combineReducers({
 user: userSlice,
 post: postSlice,
 videoProcess: videoProcessSlice,
 questionVideo: questionVideoSlice,
 jobibox: jobiboxSlice,
 question: questionSlice,
 groupQuestions: groupQuestionSlice,
 category: categorySlice,
 greenFilter: greenFilterSlice,
 music: musicSlice,
 theme: themeSlice,
 subCategory: subCategorySlice,
 city: citySlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
 reducer: persistedReducer,
 middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
   serializableCheck: false,
  }),
 devTools: true,
});

export const persistor = persistStore(Store);
