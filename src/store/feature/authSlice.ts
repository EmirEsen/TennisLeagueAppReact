import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IRegister } from "../../models/auth/IRegister";
import { IResponse } from "../../models/IResponse";
import { ILogin } from "../../models/auth/ILogin";
import config from "./config";

export interface IAuthState {
    data: string
    isLoading: boolean
    message: string
    token?: string;
    isAuth?: boolean;
}

const initialAuthState: IAuthState = {
    data: '',
    isLoading: false,
    message: '',
    token: undefined,
    isAuth: false
}
/**
 * @param {firstname, lastname, email, password} payload
 */
export const fetchRegister = createAsyncThunk<IResponse, IRegister, { rejectValue: string }>(
    'auth/register',
    async (payload: IRegister) => {
        const response = await fetch(`${config.BASE_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(data => data.json())
        return response;
    }
);

export const fetchLogin = createAsyncThunk<IResponse, ILogin, { rejectValue: string }>(
    'auth/login',
    async (payload: ILogin) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    'email': payload.email,
                    'password': payload.password
                })
            }).then(data => data.json())
            return response;

        } catch (err) {
            console.log('err...: ', err);
        }

    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.isAuth = true
            state.token = action.payload;
        },
        logout(state) {
            state.isAuth = false;
            state.token = ''
            localStorage.removeItem('token')
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRegister.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchRegister.fulfilled, (state, action: PayloadAction<IResponse>) => {
                state.isLoading = false;
                state.data = action.payload.data;
            })
            .addCase(fetchRegister.rejected, (state) => {
                state.isLoading = false;
                state.message = 'Error fetching data';
            })
            .addCase(fetchLogin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.data) {
                    state.isAuth = true;
                    state.token = action.payload.data;
                    console.log('logged in auth true and token set to local stoage', action.payload.data, action.payload.message)
                    localStorage.setItem('token', action.payload.data)
                }
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                console.log(action.payload);
                console.log(state)
            });
    }
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;