import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import healthLogReducer from './healthLogSlice';
import settingsReducer from './settingsSlice';

const rootReducer = combineReducers({
  healthLog: healthLogReducer,
  settings: settingsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;