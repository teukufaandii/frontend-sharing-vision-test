import { combineReducers } from '@reduxjs/toolkit';
import { articleApi } from '../features/articles/api/articleApi';
import articleReducer from '../features/articles/slices/articleSlice';
import articleFormReducer from '../features/articles/slices/articleFormSlice';

export const rootReducer = combineReducers({
  [articleApi.reducerPath]: articleApi.reducer,
  article: articleReducer,
  articleForm: articleFormReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
