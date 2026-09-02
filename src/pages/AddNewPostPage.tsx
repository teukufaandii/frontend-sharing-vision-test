import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Send, Save, ArrowLeft, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setTitle,
  setContent,
  setCategory,
  setStatus,
  validateAll,
  resetForm,
} from '@/features/articles/slices/articleFormSlice';
import { useCreateArticleMutation } from '@/features/articles/api/articleApi';
import type { ArticleStatus } from '@/features/articles/types/article.types';
import { validateForm } from '@/features/articles/utils/validation';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const AddNewPostPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { title, content, category, errors, isDirty } = useAppSelector(
    (state) => state.articleForm
  );

  const [createArticle, { isLoading }] = useCreateArticleMutation();
  const [submittingStatus, setSubmittingStatus] = useState<ArticleStatus | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetForm());
    };
  }, [dispatch]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(e.target.value));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setContent(e.target.value));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCategory(e.target.value));
  };

  const handleSubmit = async (targetStatus: ArticleStatus) => {
    setHasAttemptedSubmit(true);
    setSubmittingStatus(targetStatus);
    dispatch(setStatus(targetStatus));
    dispatch(validateAll());

    // Validate current values
    const validation = validateForm(title, content, category, targetStatus);
    if (!validation.isValid) {
      toast.error('Mohon periksa kembali formulir Anda. Beberapa data belum valid.');
      setSubmittingStatus(null);
      return;
    }

    try {
      await createArticle({
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        status: targetStatus,
      }).unwrap();

      toast.success(
        targetStatus === 'Publish'
          ? 'Artikel berhasil dipublikasikan!'
          : 'Artikel berhasil disimpan sebagai Draft!'
      );
      dispatch(resetForm());
      navigate('/posts');
    } catch (error) {
      console.error('Failed to create article:', error);
      toast.error('Gagal membuat artikel. Pastikan backend server aktif.');
    } finally {
      setSubmittingStatus(null);
    }
  };

  const shouldShowTitleError = (isDirty || hasAttemptedSubmit) && !!errors.titleError;
  const shouldShowContentError = (isDirty || hasAttemptedSubmit) && !!errors.contentError;
  const shouldShowCategoryError = (isDirty || hasAttemptedSubmit) && !!errors.categoryError;

  const contentCount = content.trim().length;
  const titleCount = title.trim().length;
  const categoryCount = category.trim().length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header & Back Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link to="/posts">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Post
          </Link>
        </Button>
      </div>

      <Card className="shadow-md border-border/80">
        <CardHeader className="border-b bg-muted/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Add New Post</CardTitle>
              <CardDescription className="text-sm mt-0.5">
                Buat artikel baru untuk dipublikasikan atau disimpan sebagai draft.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Title Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-1">
                Title <span className="text-destructive">*</span>
              </Label>
              <span
                className={cn(
                  'text-xs font-mono',
                  titleCount >= 20 && titleCount <= 200
                    ? 'text-emerald-600 font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {titleCount} / 200 karakter (min. 20)
              </span>
            </div>
            <Input
              id="title"
              type="text"
              placeholder="Masukkan judul artikel (minimal 20 karakter)..."
              value={title}
              onChange={handleTitleChange}
              disabled={isLoading}
              className={cn(
                shouldShowTitleError &&
                  'border-destructive focus-visible:ring-destructive/30'
              )}
            />
            {shouldShowTitleError && (
              <p className="text-xs font-medium text-destructive animate-in fade-in-50">
                {errors.titleError}
              </p>
            )}
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-sm font-semibold flex items-center gap-1">
                Content <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-1.5 text-xs font-mono">
                {contentCount >= 200 ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {contentCount} / 200 karakter terpenuhi
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">
                    {contentCount} / 200 karakter minimum
                  </span>
                )}
              </div>
            </div>
            <Textarea
              id="content"
              placeholder="Tuliskan isi artikel Anda secara mendalam dan jelas (minimal 200 karakter)..."
              value={content}
              onChange={handleContentChange}
              disabled={isLoading}
              rows={10}
              className={cn(
                'resize-y min-h-[200px]',
                shouldShowContentError &&
                  'border-destructive focus-visible:ring-destructive/30'
              )}
            />
            {shouldShowContentError && (
              <p className="text-xs font-medium text-destructive animate-in fade-in-50">
                {errors.contentError}
              </p>
            )}
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-1">
                Category <span className="text-destructive">*</span>
              </Label>
              <span
                className={cn(
                  'text-xs font-mono',
                  categoryCount >= 3 && categoryCount <= 100
                    ? 'text-emerald-600 font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {categoryCount} / 100 karakter (min. 3)
              </span>
            </div>
            <Input
              id="category"
              type="text"
              placeholder="Contoh: Teknologi, Rekayasa Perangkat Lunak, Berita..."
              value={category}
              onChange={handleCategoryChange}
              disabled={isLoading}
              className={cn(
                shouldShowCategoryError &&
                  'border-destructive focus-visible:ring-destructive/30'
              )}
            />
            {shouldShowCategoryError && (
              <p className="text-xs font-medium text-destructive animate-in fade-in-50">
                {errors.categoryError}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t bg-muted/20 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/posts')}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSubmit('Draft')}
              disabled={isLoading}
              className="flex-1 sm:flex-none gap-2"
            >
              {isLoading && submittingStatus === 'Draft' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save as Draft
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="default"
              onClick={() => handleSubmit('Publish')}
              disabled={isLoading}
              className="flex-1 sm:flex-none gap-2 bg-primary hover:bg-primary/90"
            >
              {isLoading && submittingStatus === 'Publish' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
