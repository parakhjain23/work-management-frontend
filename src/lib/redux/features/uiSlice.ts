import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkItem } from '@/types/work-item';

interface UiState {
    selectedWorkItem: WorkItem | null;
    isSidebarOpen: boolean;
    isCreateModalOpen: boolean;
    creationMetadata?: {
        categoryId?: string;
    };
}

const initialState: UiState = {
    selectedWorkItem: null,
    isSidebarOpen: false,
    isCreateModalOpen: false,
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
        },
        openCreateModal: (state, action: PayloadAction<{ categoryId?: string } | undefined>) => {
            state.isCreateModalOpen = true;
            state.creationMetadata = action.payload;
        },
        closeCreateModal: (state) => {
            state.isCreateModalOpen = false;
            state.creationMetadata = undefined;
        }
    },
});

export const { selectWorkItem, closeSidebar, openSidebar, openCreateModal, closeCreateModal } = uiSlice.actions;
export default uiSlice.reducer;
