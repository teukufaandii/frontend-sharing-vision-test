import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ArticleFormState, ArticleStatus } from '../types/article.types';
import {
  validateCategory,
  validateContent,
  validateForm,
  validateStatus,
  validateTitle,
} from '../utils/validation';

const initialState: ArticleFormState = {
  title: '',
  content: '',
  category: '',
  status: 'Publish',
  errors: {
    titleError: null,
    contentError: null,
    categoryError: null,
    statusError: null,
  },
  isValid: false,
  isDirty: false,
};

export const articleFormSlice = createSlice({
  name: 'articleForm',
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
      state.isDirty = true;
      state.errors.titleError = validateTitle(action.payload);
      state.isValid =
        !state.errors.titleError &&
        !state.errors.contentError &&
        !state.errors.categoryError &&
        !state.errors.statusError &&
        state.title.trim().length >= 20 &&
        state.content.trim().length >= 200 &&
        state.category.trim().length >= 3;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
      state.isDirty = true;
      state.errors.contentError = validateContent(action.payload);
      state.isValid =
        !state.errors.titleError &&
        !state.errors.contentError &&
        !state.errors.categoryError &&
        !state.errors.statusError &&
        state.title.trim().length >= 20 &&
        state.content.trim().length >= 200 &&
        state.category.trim().length >= 3;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
      state.isDirty = true;
      state.errors.categoryError = validateCategory(action.payload);
      state.isValid =
        !state.errors.titleError &&
        !state.errors.contentError &&
        !state.errors.categoryError &&
        !state.errors.statusError &&
        state.title.trim().length >= 20 &&
        state.content.trim().length >= 200 &&
        state.category.trim().length >= 3;
    },
    setStatus: (state, action: PayloadAction<ArticleStatus>) => {
      state.status = action.payload;
      state.isDirty = true;
      state.errors.statusError = validateStatus(action.payload);
      state.isValid =
        !state.errors.titleError &&
        !state.errors.contentError &&
        !state.errors.categoryError &&
        !state.errors.statusError &&
        state.title.trim().length >= 20 &&
        state.content.trim().length >= 200 &&
        state.category.trim().length >= 3;
    },
    setFormValues: (
      state,
      action: PayloadAction<{
        title: string;
        content: string;
        category: string;
        status: ArticleStatus;
      }>
    ) => {
      const { title, content, category, status } = action.payload;
      state.title = title;
      state.content = content;
      state.category = category;
      state.status = status;
      state.isDirty = false;

      const { errors, isValid } = validateForm(title, content, category, status);
      state.errors = errors;
      state.isValid = isValid;
    },
    validateAll: (state) => {
      state.isDirty = true;
      const { errors, isValid } = validateForm(
        state.title,
        state.content,
        state.category,
        state.status
      );
      state.errors = errors;
      state.isValid = isValid;
    },
    resetForm: () => initialState,
  },
});

export const {
  setTitle,
  setContent,
  setCategory,
  setStatus,
  setFormValues,
  validateAll,
  resetForm,
} = articleFormSlice.actions;

export default articleFormSlice.reducer;
