import { RootState } from './store';

// Selector function to retrieve the logs
export const selectHealthLogs = (state: RootState) => state.healthLog.logs;
