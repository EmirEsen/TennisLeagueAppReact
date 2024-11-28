import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IGetMatch } from "../../models/get/IGetMatch"
import { IPostMatch } from "../../models/post/IPostMatch"
import { IResponse } from "../../models/IResponse"
import config from "./config"
import { IPageDto } from "../../models/IPageDto"

export interface IMatchState {
    matchList: IGetMatch[],
    isLoading: boolean
}

const initialMatchState: IMatchState = {
    matchList: [],
    isLoading: false
}

export const getMatchList = createAsyncThunk<IGetMatch[], void, { rejectValue: string }>(
    'match/getMatchs',
    async () => {
        const result = await fetch(`${config.BASE_URL}/api/v1/match/matches`)
            .then(data => data.json())
        return result;
    }
)

export const getPlayerMatchList = createAsyncThunk<IGetMatch[],{ playerId: string; page: number; size: number }, { rejectValue: string }>(
        'match/getPlayerMatchs',
        async ({ playerId, page, size }) => {
            const result = await fetch(`${config.BASE_URL}/api/v1/match/matches?playerId=${playerId}?page=${page}&size=${size}`)
                .then(data => data.json())
            return result;
        }
    )

export const getMatchListByPlayerAndTournament = createAsyncThunk
    <IPageDto<IGetMatch>,
        { tournamentId: string; playerId: string; page: number; size: number },
        { rejectValue: string }>(
            'match/getMatchListByPlayerAndTournament',
            async ({ tournamentId, playerId, page, size }) => {
                const result: IPageDto<IGetMatch> = await fetch(
                    `${config.BASE_URL}/api/v1/match/${tournamentId}/${playerId}/matches?page=${page}&size=${size}`
                )
                    .then(data => data.json())
                console.log('page slice', result);
                return result;
            }
        )

export const getTournamentMatchList = createAsyncThunk<IGetMatch[], { tournamentId: string }, { rejectValue: string }>(
    'match/getMatchListByTournament',
    async ({ tournamentId }) => {
        const result = await fetch(`${config.BASE_URL}/api/v1/match/matches?tournamentId=${tournamentId}`)
            .then(data => data.json())
        return result;
    }
)

export const fetchMatchByTournamentIdAndMatchId = createAsyncThunk<IGetMatch, { tournamentId: string, matchId: string }, { rejectValue: string }>(
    'match/getMatchByTournamentIdAndMatchId',
    async ({ tournamentId, matchId }, { rejectWithValue }) => {
        if (!tournamentId || !matchId) {
            return rejectWithValue("Missing tournamentId or matchId");
        }
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/match/${tournamentId}/${matchId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error("Network response was not ok");

            const result: IGetMatch = await response.json();
            return result;
        } catch (error) {
            return rejectWithValue("Network error");
        }
    }
);


export const addNewMatch = createAsyncThunk<IResponse, IPostMatch, { rejectValue: string }>(
    'match/addNewMatch',
    async (payload: IPostMatch, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/match/save`, {
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

export const approveMatch = createAsyncThunk<IResponse, { tournamentId: string, matchId: string }, { rejectValue: string }>(
    'match/approveMatch',
    async ({ tournamentId, matchId }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/match/approve-match/${tournamentId}/${matchId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                return rejectWithValue(errorText || "Failed to approve match");
            }

            const result: IResponse = await response.json();
            return result;
        } catch (error) {
            console.error("Approve Match Error:", error);
            return rejectWithValue("Network error");
        }
    }
);

export const rejectMatch = createAsyncThunk<IResponse, { tournamentId: string, matchId: string }, { rejectValue: string }>(
    'match/rejectMatch',
    async ({ tournamentId, matchId }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/match/reject-match/${tournamentId}/${matchId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                return rejectWithValue(errorText || "Failed to reject match");
            }

            const result: IResponse = await response.json();
            return result;
        } catch (error) {
            console.error("Reject Match Error:", error);
            return rejectWithValue("Network error");
        }
    }
);

export const autoRejectMatch = createAsyncThunk<IResponse, { tournamentId: string, matchId: string }, { rejectValue: string }>(
    'match/autoRejectMatch',
    async ({ tournamentId, matchId }, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/match/auto-reject-match/${tournamentId}/${matchId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',                    
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                return rejectWithValue(errorText || "Failed to reject match");
            }

            const result: IResponse = await response.json();
            return result;
        } catch (error) {
            console.error("Reject Match Error:", error);
            return rejectWithValue("Network error");
        }
    }
);

const matchSlice = createSlice({
    name: 'match',
    initialState: initialMatchState,
    reducers: {},
    extraReducers: (build) => {
        build
            .addCase(getMatchList.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMatchList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.matchList = action.payload;
                console.log(action.payload)
            })
            .addCase(getTournamentMatchList.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTournamentMatchList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.matchList = action.payload;
            })
            .addCase(getTournamentMatchList.rejected, (state, action) => {
                state.isLoading = false;
                console.error(action.payload);
            })
            .addCase(addNewMatch.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addNewMatch.fulfilled, (state, action) => {
                if (action.payload.code === 200) {
                    state.matchList.push(action.payload.data)
                }
                state.isLoading = false;
            })
            .addCase(addNewMatch.rejected, (state, action) => {
                state.isLoading = false;
                console.error(action.payload);
            })
    }
})

export default matchSlice.reducer;
