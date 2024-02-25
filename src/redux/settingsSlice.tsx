import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Settings } from '../data/interfaces';
import { storage } from '../data/storage';

interface SettingsState {
    settings: Settings;
}

const initialState: SettingsState = {
    settings: (() => {
        try {
            const settingsString = storage.getString('healthBookSettings');
            if (settingsString) {
                return JSON.parse(settingsString) as Settings;
            }
        } catch (error) {
            console.error('Error retrieving settings:', error);
        }
        return {
            dateFormat: 'DD/MM/YYYY',
            muteSounds: false,
            gridView: false,
        };
    })(),
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {

        updateDateFormat: (state, action: PayloadAction<string>) => {
            state.settings.dateFormat = action.payload;
            storage.set('healthBookSettings', JSON.stringify(state.settings));
        },

        updateMuteSounds: (state, action: PayloadAction<boolean>) => {
            state.settings.muteSounds = action.payload;
            storage.set('healthBookSettings', JSON.stringify(state.settings));
        },

        updateGridView: (state, action: PayloadAction<boolean>) => {
            state.settings.gridView = action.payload;
            storage.set('healthBookSettings', JSON.stringify(state.settings));
        },

    }
});

export const { updateDateFormat, updateMuteSounds, updateGridView } = settingsSlice.actions;
export default settingsSlice.reducer;