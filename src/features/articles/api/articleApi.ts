import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Article, CreateArticlePayload, UpdateArticlePayload } from '../types/article.types';

export const articleApi = createApi({
  reducerPath: 'articleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  }),
  tagTypes: ['Article'],
  endpoints: (builder) => ({
    getArticles: builder.query<Article[], { limit: number; offset: number }>({
      query: ({ limit, offset }) => `/article/${limit}/${offset}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Article' as const, id })),
              { type: 'Article', id: 'LIST' },
            ]
          : [{ type: 'Article', id: 'LIST' }],
    }),
    getArticleById: builder.query<Article, number | string>({
      query: (id) => `/article/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Article', id }],
    }),
    createArticle: builder.mutation<Record<string, never>, CreateArticlePayload>({
      query: (payload) => ({
        url: '/article/',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Article', id: 'LIST' }],
    }),
    updateArticle: builder.mutation<Record<string, never>, UpdateArticlePayload>({
      query: ({ id, ...body }) => ({
        url: `/article/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Article', id },
        { type: 'Article', id: 'LIST' },
      ],
    }),
    deleteArticle: builder.mutation<Record<string, never>, number | string>({
      query: (id) => ({
        url: `/article/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Article', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = articleApi;
