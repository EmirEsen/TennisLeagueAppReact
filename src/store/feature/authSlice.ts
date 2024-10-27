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


export const fetchVerifyAccount = createAsyncThunk(
    'auth/fetchVerifyAccount',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/auth/verify-email?token=${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }

            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            return rejectWithValue({ message: 'An error occurred during the verification process.' });
        }
    }
);


export const fetchSendConfirmationEmail = createAsyncThunk<IResponse, String, { rejectValue: string }>(
    'auth/sendConfirmationEmail',
    async (email: String) => {
        const response = await fetch(`${config.BASE_URL}/api/v1/auth/send-confirmation-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'email': email
            })
        })

        return response.json();
    }
);

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
        const response = await fetch(`${config.BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'email': payload.email,
                'password': payload.password
            })
        })

        return response.json();
    }
);

interface IFetchForgotPassword {
    email: string;
}

export const fetchForgotPassword = createAsyncThunk(
    'auth/fetchForgotPassword',
    async (payload: IFetchForgotPassword, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/forget-password?email=${payload.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                return rejectWithValue(errorData);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue({ message: 'Ooops, something went wrong' });
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
            state.data = '';
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
                    localStorage.setItem('token', action.payload.data)
                }
            })
            .addCase(fetchSendConfirmationEmail.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSendConfirmationEmail.fulfilled, (state) => {
                state.isLoading = false;
            })
    }
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;