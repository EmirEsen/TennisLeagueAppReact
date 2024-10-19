import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IResponse } from "../../models/IResponse"
import config from "./config"
import { IPostTournament } from "../../models/IPostTournament"
import { ITournament } from "../../models/ITournament"
import { IPlayerProfile } from "../../models/IPlayerProfile"

export interface ITournamentState {
    tournamentList: ITournament[],
    isLoading: boolean
}

const initialTournamentState: ITournamentState = {
    tournamentList: [],
    isLoading: false
}

export const addNewTournament = createAsyncThunk<IResponse, IPostTournament, { rejectValue: string }>(
    'tournament/addNewTournament',
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

export const getTournamentList = createAsyncThunk<ITournament[], void, { rejectValue: string }>(
    'tournament/getTournaments',
    async () => {
        const result = await fetch(`${config.BASE_URL}/api/v1/tournament/tournaments`)
            .then(data => data.json())
        return result;
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
    name: 'tournament',
    initialState: initialTournamentState,
    reducers: {},
    extraReducers: (build) => {
        build
            .addCase(addNewTournament.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTournamentList.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTournamentList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tournamentList = action.payload;
                console.log(action.payload)
            }).addCase(getPlayersOfTournament.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPlayersOfTournament.fulfilled, (state, action) => {
                state.isLoading = false;
                const tournament = state.tournamentList.find(t => t.id === action.meta.arg);
                if (tournament) {
                    tournament.players = action.payload;
                }
            })
            .addCase(getPlayersOfTournament.rejected, (state, action) => {
                state.isLoading = false;
                console.error(action.payload);
            });
    }
})

export default tournamentSlice.reducer;
