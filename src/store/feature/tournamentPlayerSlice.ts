import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import config from "./config";
import { IGetTournamentPlayer } from "../../models/get/IGetTournamentPlayer";

export interface ITournamentPlayerState {
    tournamentPlayerList: IGetTournamentPlayer[],
    isLoading: boolean,
    error: string | null // Optional: Track errors
}

const initialTournamentState: ITournamentPlayerState = {
    tournamentPlayerList: [],
    isLoading: false,
    error: null
};

export const getPlayersOfTournament = createAsyncThunk<IGetTournamentPlayer[], string, { rejectValue: string }>(
    'tournamentPlayer/getPlayersOfTournament',
    async (tournamentId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/tournament-player/${tournamentId}/players`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch players');
            }
            const result: IGetTournamentPlayer[] = await response.json();
            return result;
        } catch (error) {
            return rejectWithValue("Network error");
        }
    }
);

// Trying to get players of the tournaments
const tournamentSlice = createSlice({
    name: 'tournamentPlayer',
    initialState: initialTournamentState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPlayersOfTournament.pending, (state) => {
                state.isLoading = true;
                state.error = null; // Reset error state when loading
            })
            .addCase(getPlayersOfTournament.fulfilled, (state, action) => {
                state.tournamentPlayerList = action.payload; // Set the fetched players
                state.isLoading = false; // Set loading to false
            })
            .addCase(getPlayersOfTournament.rejected, (state, action) => {
                state.isLoading = false; // Set loading to false
                state.error = action.payload || "Failed to fetch players"; // Set error message
                console.error(action.payload);
            });
    }
});

export default tournamentSlice.reducer;