import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

const initialState = {
    status: "",
    error: "",
    user: {
        id: "",
        firstname: "",
        lastname: "",
        email: "",
        avatar: "",
        token: "",
        questionLists: [],
        offerCandidacyIds: []
    }
}

export const registerUser = createAsyncThunk("api/register", async (values, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${BASE_URL}/register`, { ... values});
        return data;
    } catch (error) {
        return rejectWithValue(error.response);
    }
})

export const loginUser = createAsyncThunk(
    "api/login",
    async (values, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${BASE_URL}/login`, {
                ...values,
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const userSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        logout: (state) => {
            state.status = "",
            state.error = "",
            state.user = {
                id: "",
                firstname: "",
                lastname: "",
                email: "",
                avatar: "",
                token: "",
                questionLists: [],
                offerCandidacyIds: []
            };
        },
        changeStatus: (state, action) => {
            state.status = action.payload;
        },
        updateQuestionLists: (state, action) => {
            if (state.user && state.user.questionLists) {
                const newElement = action.payload;
        
                // Vérifie que newElement est un objet valide avec un id
                if (!newElement || typeof newElement.id === "undefined") {
                    console.error("Élément invalide reçu :", newElement);
                    return;
                }
        
                // Vérifie si l'élément existe déjà
                const exists = state.user.questionLists.some(
                    (questionList) => questionList.id === newElement.id
                );
        
                // Ajoute l'élément uniquement s'il n'existe pas
                if (!exists) {
                    state.user.questionLists.push(newElement);
                }
            }
        },
        addCandidacy: (state, action) => {
            const newOfferId = action.payload;
            if (!state.user.offerCandidacyIds.includes(newOfferId)) {
                state.user.offerCandidacyIds.push(newOfferId);
            }
        },
    },
    extraReducers(builder) {
        builder.addCase(registerUser.pending, (state) => {
            state.status = "loading";
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.error = action.payload.data;
            state.user = {
                ...action.payload.user,
                token: action.payload.token
            };
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.data.detail;
        })
        .addCase(loginUser.pending, (state) => {
            state.status = "loading";
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.error = action.payload.data.message;
            state.user = {
                ...action.payload.data,
                token: action.payload.token
            };
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload.data.message;
        });
    }
})

export const { logout, changeStatus, updateQuestionLists, addCandidacy } = userSlice.actions;
export default userSlice.reducer;
