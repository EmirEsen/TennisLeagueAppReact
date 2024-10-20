import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IResponse } from "../../models/IResponse"
import config from "./config"
import { IPostTournament } from "../../models/post/IPostTournament"
import { IPlayerProfile } from "../../models/IPlayerProfile"
import { IGetTournamentPlayer } from "../../models/get/IGetTournamentPlayer"

export interface ITournamentPlayerState {
    tournamentPlayerList: IGetTournamentPlayer[],
    isLoading: boolean
}

const initialTournamentState: ITournamentPlayerState = {
    tournamentPlayerList: [],
    isLoading: false
}

export const addNewPlayer = createAsyncThunk<IResponse, IPostTournament, { rejectValue: string }>(
    'tournamentPlayer/addNewPlayer',
    async (payload: IPostTournament, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/tournament/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            const result: IResponse = await response.json();
            return result;
        } catch (error) {
            return rejectWithValue("Network error");
        }
    }
)

export const getPlayersOfTournament = createAsyncThunk<IPlayerProfile[], string, { rejectValue: string }>(
    'tournament/getPlayersOfTournament',
    async (tournamentId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/tournament/players-of-tournament/${tournamentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch players');
            }

            const result: IPlayerProfile[] = await response.json();
            return result;
        } catch (error) {
            return rejectWithValue("Network error");
        }
    }
);

//trying to get players of the tournaments
const tournamentSlice = createSlice({
    name: 'tournamentPlayer',
    initialState: initialTournamentState,
    reducers: {},
    extraReducers: (build) => {
        build
            .addCase(getPlayersOfTournament.rejected, (state, action) => {
                state.isLoading = false;
                console.error(action.payload);
            });
    }
})

export default tournamentSlice.reducer;
