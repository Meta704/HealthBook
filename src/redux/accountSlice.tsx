import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HealthLog, User } from '../data/interfaces';
import { storage } from '../data/storage';

interface AccountState {
    userInfo: User;
    healthLogs: HealthLog[];
}

const initialState: AccountState = {
    // CODE TO FETCH USER DATA FROM FIREBASE OR SET EMPTY []
    // CODE TO FETCH HEALTHLOGS FROM THE USER DATABASE - OR SET TO THE STORAGE STATE
};

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {

    }
});

export const { } = accountSlice.actions;
export default accountSlice.reducer;