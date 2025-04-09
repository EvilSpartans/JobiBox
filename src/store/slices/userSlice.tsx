import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../models/User";
import { loginUser, registerUser, updateUser } from "../../services/auth.service";

// Types
interface UserState {
    status: string;
    error: string | null;
    user: User;
}

export interface APIResponse {
    token: string;
    message: string;
    data: User;
    user: User;
}

const initialState: UserState = {
    status: '',
    error: null,
    user: {
        id: "",
        firstname: "",
        lastname: "",
        email: "",
        avatar: "",
        token: "",
        questionLists: [],
        job: "",
        roles: [],
        username: "",
        cover: ""
    },
};

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
                job: "",
                roles: [],
                username: "",
                cover: ""
            };
        },
        changeStatus: (state, action: PayloadAction<string>) => {
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
    },
    extraReducers(builder) {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<APIResponse>) => {
                state.status = 'succeeded';
                state.error = null;
                state.user = {
                    ...action.payload.user,
                    token: action.payload.token,
                };
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to register';
                console.error("Erreur d'inscription':", action.payload);
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<APIResponse>) => {
                // console.log('Payload:', action.payload);
                state.status = 'succeeded';
                state.error = action.payload.message || null;
                state.user = {
                    ...action.payload.data,
                    token: action.payload.token,
                };
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to login';
            })
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.status = 'succeeded';
                state.error = null;
                state.user = {
                    ...state.user,
                    ...action.payload,
                };
                // console.log("État de l'utilisateur mis à jour :", state.user);
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to update user';
            });
    }
})

export const { logout, changeStatus, updateQuestionLists } = userSlice.actions;
export default userSlice.reducer;
