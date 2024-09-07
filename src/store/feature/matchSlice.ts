import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IGetMatch } from "../../models/IGetMatch"
import { IPostMatch } from "../../models/IPostMatch"
import { IResponse } from "../../models/IResponse"

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
        const result = await fetch(`/api/v1/match/matches`)
            .then(data => data.json())
        return result;
    }
)

export const addNewMatch = createAsyncThunk<IResponse, IPostMatch, { rejectValue: string }>(
    'match/addNewMatch',
    async (payload: IPostMatch, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/v1/match/save`, {
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
            });
    }
})

export default matchSlice.reducer;
