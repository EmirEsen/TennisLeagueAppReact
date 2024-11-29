import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IResponse } from "../../models/IResponse"
import config from "./config"
import { IPostTournament } from "../../models/post/IPostTournament"
import { ITournament } from "../../models/ITournament"
import { IGetMatch } from "../../models/get/IGetMatch"
import { IGetTournamentPlayer } from "../../models/get/IGetTournamentPlayer"
import { getTournamentMatchList } from './matchSlice';

export interface ITournamentState {
    tournamentList: ITournament[],
    myTournaments: ITournament[],
    isLoading: boolean,
    currentTournament: ITournament | null,
    tournamentPlayers: IGetTournamentPlayer[],
    tournamentMatches: IGetMatch[],
    loading: {
        players: boolean,
        matches: boolean,
        tournament: boolean
    },
    error: string | null
}

const initialTournamentState: ITournamentState = {
    tournamentList: [],
    myTournaments: [],
    isLoading: false,
    currentTournament: null,
    tournamentPlayers: [],
    tournamentMatches: [],
    loading: {
        players: false,
        matches: false,
        tournament: false
    },
    error: null
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

export const getComunityTournamentList = createAsyncThunk<ITournament[], void, { rejectValue: string }>(
    'tournament/getTournaments',
    async () => {
        const result = await fetch(`${config.BASE_URL}/api/v1/tournament/tournaments`)
            .then(data => data.json())
        return result;
    }
)

export const getMyTournaments = createAsyncThunk<ITournament[], void, { rejectValue: string }>(
    'tournament/getMyTournaments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/tournament/my-tournaments`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                return rejectWithValue("Failed to fetch tournaments for the player");
            }

            const result: ITournament[] = await response.json();
            return result;
        } catch (error) {
            return rejectWithValue("Network error");
        }
    }
);

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
            .addCase(getComunityTournamentList.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getComunityTournamentList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tournamentList = action.payload;
                console.log(action.payload)
            })
            .addCase(addNewTournament.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewTournament.fulfilled, (state, action) => {
                if (action.payload.code === 200) {
                    console.log('tournament slice data: ', action.payload.data)
                    console.log('tournament slice: ', action.payload.message)
                    state.tournamentList.push(action.payload.data)
                }
                state.isLoading = false;
            })
            .addCase(addNewTournament.rejected, (state, action) => {
                state.isLoading = false;
                console.error(action.payload);
            })
            .addCase(getMyTournaments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyTournaments.fulfilled, (state, action) => {
                state.isLoading = false;
                console.log(action.payload)
                state.myTournaments = action.payload;
            })
            .addCase(getMyTournaments.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(getTournamentMatchList.pending, (state) => {
                state.loading.matches = true;
                state.error = null;
            })
            .addCase(getTournamentMatchList.fulfilled, (state, action) => {
                state.loading.matches = false;
                state.tournamentMatches = action.payload;
                state.error = null;
            })
            .addCase(getTournamentMatchList.rejected, (state, action) => {
                state.loading.matches = false;
                state.error = action.payload || 'Failed to fetch tournament matches';
            });
    }
})

export default tournamentSlice.reducer;
