import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkItem } from '@/types/work-item';

interface UiState {
    selectedWorkItem: WorkItem | null;
    isSidebarOpen: boolean;
}

const initialState: UiState = {
    selectedWorkItem: null,
    isSidebarOpen: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        selectWorkItem: (state, action: PayloadAction<WorkItem | null>) => {
            state.selectedWorkItem = action.payload;
            state.isSidebarOpen = !!action.payload;
        },
        closeSidebar: (state) => {
            state.isSidebarOpen = false;
        },
        openSidebar: (state) => {
            state.isSidebarOpen = true;
        }
    },
});

export const { selectWorkItem, closeSidebar, openSidebar } = uiSlice.actions;
export default uiSlice.reducer;
