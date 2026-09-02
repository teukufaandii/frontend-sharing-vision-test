export type ArticleStatus = 'Publish' | 'Draft' | 'Thrash';

export interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  created_date?: string;
  updated_date?: string;
  status: ArticleStatus;
}

export interface CreateArticlePayload {
  title: string;
  content: string;
  category: string;
  status: ArticleStatus;
}

export interface UpdateArticlePayload extends CreateArticlePayload {
  id: number;
}

export type TabStatus = 'publish' | 'draft' | 'thrash';

export interface FormErrors {
  titleError: string | null;
  contentError: string | null;
  categoryError: string | null;
  statusError: string | null;
}

export interface ArticleFormState {
  title: string;
  content: string;
  category: string;
  status: ArticleStatus;
  errors: FormErrors;
  isValid: boolean;
  isDirty: boolean;
}
