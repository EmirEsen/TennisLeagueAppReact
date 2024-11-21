import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import config from "./config";
import { IMatchNotification } from "../../models/IMatchNotification";

export interface INotificationState {
    notificationList: IMatchNotification[];
    isLoading: boolean;
    error: string | null;
}

const initialNotificationState: INotificationState = {
    notificationList: [],
    isLoading: false,
    error: null
};

// Thunk to fetch all notifications for a specific player
export const fetchPlayerNotifications = createAsyncThunk<IMatchNotification[], string, { rejectValue: string }>(
    'notification/fetchPlayerNotifications',
    async (receiverId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/match-notification/receiver/${receiverId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                return rejectWithValue('Failed to fetch notifications');
            }
            return await response.json();
        } catch (error) {
            return rejectWithValue('Error fetching notifications');
        }
    }
);

export const fetchNotification = createAsyncThunk<IMatchNotification, string, { rejectValue: string }>(
    'notification/fetchNotification',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/match-notification/notification/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                return rejectWithValue('Failed to fetch notifications');
            }
            return await response.json();
        } catch (error) {
            return rejectWithValue('Error fetching notifications');
        }
    }
);

// Thunk to mark a notification as read
export const markNotificationAsRead = createAsyncThunk<void, string, { rejectValue: string }>(
    'notification/markAsRead',
    async (notificationId, { rejectWithValue }) => {
        try {
            const response = await fetch(`${config.BASE_URL}/api/v1/match-notification/mark-as-read/${notificationId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                return rejectWithValue('Failed to mark notification as read');
            }
        } catch (error) {
            return rejectWithValue('Error marking notification as read');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialNotificationState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(fetchPlayerNotifications.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPlayerNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.notificationList = action.payload;
            })
            .addCase(fetchPlayerNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to fetch notifications';
            })
            // Mark notification as read
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notification = state.notificationList.find(notif => notif.id === action.meta.arg);
                if (notification) {
                    notification.isRead = true;
                }
            })
            .addCase(markNotificationAsRead.rejected, (state, action) => {
                state.error = action.payload || 'Failed to mark notification as read';
            });
    }
});

export default notificationSlice.reducer;
