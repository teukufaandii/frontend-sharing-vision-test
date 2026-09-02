import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AllPostsPage } from '@/pages/AllPostsPage';
import { AddNewPostPage } from '@/pages/AddNewPostPage';
import { EditPostPage } from '@/pages/EditPostPage';
import { PreviewBlogPage } from '@/pages/PreviewBlogPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/posts" replace />} />
      <Route path="/posts" element={<AllPostsPage />} />
      <Route path="/posts/new" element={<AddNewPostPage />} />
      <Route path="/posts/edit/:id" element={<EditPostPage />} />
      <Route path="/preview" element={<PreviewBlogPage />} />
      <Route path="*" element={<Navigate to="/posts" replace />} />
    </Routes>
  );
};
