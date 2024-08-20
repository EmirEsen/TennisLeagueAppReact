import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IPlayerProfile } from "../../models/IPlayerProfile"
import { IUpdatePlayerProfile } from "../../models/IUpdatePlayerProfile"
import config from "./config"

export interface IPlayerState {
    playerList: IPlayerProfile[],
    loggedInProfile: IPlayerProfile | null,
    isLoading: boolean,
    error: string | null
}

const initialPlayerState: IPlayerState = {
    playerList: [],
    loggedInProfile: null,
    isLoading: false,
    error: null
}


export const getPlayerProfileList = createAsyncThunk<IPlayerProfile[], void, { rejectValue: string }>(
    'player/getPlayers',
    async () => {
        const result = await fetch(`${config.BASE_URL}/api/v1/player/profiles`)
            .then(data => data.json())
        return result;
    }
)

export const fetchPlayerProfile = createAsyncThunk<IPlayerProfile, void, { rejectValue: string }>(
    'player/getProfile',
    async (_) => {
        const response = await fetch(`${config.BASE_URL}/api/v1/player/profile`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch player profile');
        }
        return await response.json();
    }
);

export const fetchUpdatePlayerProfile = createAsyncThunk<IPlayerProfile, IUpdatePlayerProfile, { rejectValue: string }>(
    'player/updateProfile',
    async (payload: IUpdatePlayerProfile) => {
        const response = await fetch(`${config.BASE_URL}/api/v1/player/profile/update`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return await response.json();
    }
);

export const uploadPlayerProfileImage = createAsyncThunk<string, FormData, { rejectValue: string }>(
    'player/uploadImage',
    async (formData, { rejectWithValue }) => {
        const response = await fetch(`${config.BASE_URL}/api/v1/player/profile-image`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        if (!response.ok) {
            return rejectWithValue('Failed to upload image');
        }
        return await response.text();
    }
);

const playerSlice = createSlice({
    name: 'player',
    initialState: initialPlayerState,
    reducers: {},
    extraReducers: (build) => {
        build
            .addCase(getPlayerProfileList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.playerList = action.payload;
                console.log(state.playerList)
            })
            .addCase(fetchPlayerProfile.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPlayerProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.loggedInProfile = action.payload;
            })
            .addCase(fetchPlayerProfile.rejected, (state) => {
                state.isLoading = false;
                state.error = 'Failed to fetch player profile';
            })
            .addCase(fetchUpdatePlayerProfile.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchUpdatePlayerProfile.rejected, (state) => {
                state.isLoading = false;
                localStorage.removeItem('token');
            })
    }
})



export default playerSlice.reducer;
