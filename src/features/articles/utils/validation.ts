import type { ArticleStatus, FormErrors } from '../types/article.types';

export const validateTitle = (title: string): string | null => {
  const trimmed = title.trim();
  if (!trimmed) {
    return 'Title wajib diisi dan minimal 20 karakter';
  }
  if (trimmed.length < 20) {
    return 'Title wajib diisi dan minimal 20 karakter';
  }
  if (trimmed.length > 200) {
    return 'Title maksimal 200 karakter';
  }
  return null;
};

export const validateContent = (content: string): string | null => {
  const trimmed = content.trim();
  if (!trimmed) {
    return 'Content wajib diisi dan minimal 200 karakter';
  }
  if (trimmed.length < 200) {
    return 'Content wajib diisi dan minimal 200 karakter';
  }
  return null;
};

export const validateCategory = (category: string): string | null => {
  const trimmed = category.trim();
  if (!trimmed) {
    return 'Category wajib diisi dan minimal 3 karakter';
  }
  if (trimmed.length < 3) {
    return 'Category wajib diisi dan minimal 3 karakter';
  }
  if (trimmed.length > 100) {
    return 'Category maksimal 100 karakter';
  }
  return null;
};

export const validateStatus = (status: ArticleStatus): string | null => {
  const validStatuses: ArticleStatus[] = ['Publish', 'Draft', 'Thrash'];
  if (!status || !validStatuses.includes(status)) {
    return 'Status harus salah satu dari Publish, Draft, atau Thrash';
  }
  return null;
};

export const validateForm = (
  title: string,
  content: string,
  category: string,
  status: ArticleStatus
): { errors: FormErrors; isValid: boolean } => {
  const titleError = validateTitle(title);
  const contentError = validateContent(content);
  const categoryError = validateCategory(category);
  const statusError = validateStatus(status);

  const errors: FormErrors = {
    titleError,
    contentError,
    categoryError,
    statusError,
  };

  const isValid = !titleError && !contentError && !categoryError && !statusError;

  return { errors, isValid };
};
