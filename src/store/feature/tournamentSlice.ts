import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IResponse } from "../../models/IResponse"
import config from "./config"
import { IPostTournament } from "../../models/post/IPostTournament"
import { ITournament } from "../../models/ITournament"

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

export const getTournamentById = createAsyncThunk<ITournament, string, { rejectValue: string }>(
    'tournament/getTournamentById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/tournament/${id}`);
            if (!response.ok) {
                return rejectWithValue('Failed to fetch the tournament');
            }
            const result: ITournament = await response.json();
            return result;
        } catch (error) {
            return rejectWithValue('Network error');
        }
    }
);



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
            })
    }
})

export default tournamentSlice.reducer;
