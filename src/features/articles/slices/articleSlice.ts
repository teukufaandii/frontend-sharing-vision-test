import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TabStatus } from '../types/article.types';

interface ArticleState {
  activeTab: TabStatus;
  pagination: {
    limit: number;
    offset: number;
    currentPage: number;
  };
}

const initialState: ArticleState = {
  activeTab: 'publish',
  pagination: {
    limit: 6,
    offset: 0,
    currentPage: 1,
  },
};

export const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<TabStatus>) => {
      state.activeTab = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<{ limit?: number; offset?: number; currentPage?: number }>
    ) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      const page = action.payload;
      state.pagination.currentPage = page;
      state.pagination.offset = (page - 1) * state.pagination.limit;
    },
    resetPagination: (state) => {
      state.pagination = initialState.pagination;
    },
  },
});

export const { setActiveTab, setPagination, setPage, resetPagination } = articleSlice.actions;
export default articleSlice.reducer;
