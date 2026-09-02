import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';
import { articleApi } from '../features/articles/api/articleApi';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(articleApi.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
