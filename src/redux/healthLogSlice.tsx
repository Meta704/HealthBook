import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HealthLog } from '../data/interfaces';
import { storage } from '../data/storage';

interface HealthLogState {
    logs: HealthLog[] | null;
}

const initialState: HealthLogState = {
    logs: (() => {
        try {
            const healthLogsString = storage.getString('healthLogs');
            if (healthLogsString) {
                return JSON.parse(healthLogsString) as HealthLog[];
            }
        } catch (error) {
            console.error('Error retrieving health logs:', error);
        }
        return [];
    })(),
};

const healthLogSlice = createSlice({
    name: 'healthLog',
    initialState,
    reducers: {

        // Add a new log
        addHealthLog(state, action: PayloadAction<HealthLog>) {
            state.logs!.push(action.payload);
            storage.set('healthLogs', JSON.stringify(state.logs));
        },
        
        // Edit a new log
        editHealthLog(state, action: PayloadAction<HealthLog>) {
            const editedLogIndex = state.logs!.findIndex(log => log.id === action.payload.id);
            if (editedLogIndex !== -1) {
                state.logs![editedLogIndex] = action.payload;
                storage.set('healthLogs', JSON.stringify(state.logs));
            } else {
                console.error('Log not found for editing.');
            }
        },
        
        // Delete a log
        deleteHealthLog(state, action: PayloadAction<string>) {
            if (!state.logs || state.logs.length === 0) {
                console.log('STATE LOGS ARE EMPTY');
                return;
            }
            state.logs = state.logs!.filter(log => log.id !== action.payload);
            storage.set('healthLogs', JSON.stringify(state.logs));
        },
        
        // Toggle pin status of a log
        togglePinLog(state, action: PayloadAction<string>) {
            const log = state.logs!.find(log => log.id === action.payload);
            if (log) {
                log.isPinned = !log.isPinned;
                storage.set('healthLogs', JSON.stringify(state.logs));
            }
        },
        
        // Set logs from storage
        setHealthLogs(state, action: PayloadAction<HealthLog[]>) {
            state.logs = action.payload;
        },
    },
});

export const { addHealthLog, deleteHealthLog, setHealthLogs, editHealthLog, togglePinLog } = healthLogSlice.actions;
export default healthLogSlice.reducer;
