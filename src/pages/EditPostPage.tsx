import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Send, Save, ArrowLeft, Loader2, Edit3, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setTitle,
  setContent,
  setCategory,
  setStatus,
  setFormValues,
  validateAll,
  resetForm,
} from '@/features/articles/slices/articleFormSlice';
import {
  useGetArticleByIdQuery,
  useUpdateArticleMutation,
} from '@/features/articles/api/articleApi';
import type { ArticleStatus } from '@/features/articles/types/article.types';
import { validateForm } from '@/features/articles/utils/validation';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/lib/utils';

export const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const articleId = id ? parseInt(id, 10) : 0;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { title, content, category, status: currentFormStatus, errors, isDirty } = useAppSelector(
    (state) => state.articleForm
  );

  // Fetch article by ID from backend
  const {
    data: article,
    isLoading: isFetchingArticle,
    isError: isFetchError,
    refetch,
  } = useGetArticleByIdQuery(articleId, {
    skip: !articleId,
  });

  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const [submittingStatus, setSubmittingStatus] = useState<ArticleStatus | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Pre-fill Redux form state when article data arrives
  useEffect(() => {
    if (article) {
      dispatch(
        setFormValues({
          title: article.title || '',
          content: article.content || '',
          category: article.category || '',
          status: article.status || 'Draft',
        })
      );
    }
  }, [article, dispatch]);

  // Reset form when unmounting
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

  const handleUpdate = async (targetStatus: ArticleStatus) => {
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
      await updateArticle({
        id: articleId,
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        status: targetStatus,
      }).unwrap();

      toast.success(
        targetStatus === 'Publish'
          ? 'Artikel berhasil diperbarui dan dipublikasikan!'
          : 'Artikel berhasil diperbarui sebagai Draft!'
      );
      dispatch(resetForm());
      navigate('/posts');
    } catch (error) {
      console.error('Failed to update article:', error);
      toast.error('Gagal memperbarui artikel. Pastikan backend server aktif.');
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

  // Loading State
  if (isFetchingArticle) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="p-12 shadow-sm">
          <LoadingSpinner message={`Memuat data artikel #${id}...`} />
        </Card>
      </div>
    );
  }

  // Error / Not Found State
  if (isFetchError || !article) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-destructive/20 bg-destructive/5 p-8 text-center shadow-sm">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle className="text-xl font-bold mb-2">
            Artikel Tidak Ditemukan
          </CardTitle>
          <CardDescription className="max-w-md mx-auto mb-6 text-muted-foreground">
            Artikel dengan ID <span className="font-semibold text-foreground">#{id}</span> tidak
            ditemukan atau terjadi masalah saat menghubungi server backend di http://localhost:8080.
          </CardDescription>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Coba Lagi
            </Button>
            <Button asChild size="sm" className="gap-2">
              <Link to="/posts">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Daftar Post
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status Saat Ini:</span>
          <Badge
            variant={
              article.status?.toLowerCase() === 'publish'
                ? 'default'
                : article.status?.toLowerCase() === 'draft'
                ? 'secondary'
                : 'destructive'
            }
          >
            {article.status || 'Draft'}
          </Badge>
        </div>
      </div>

      <Card className="shadow-md border-border/80">
        <CardHeader className="border-b bg-muted/20 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Edit Post #{article.id}</CardTitle>
              <CardDescription className="text-sm mt-0.5">
                Perbarui konten artikel dan simpan sebagai status Publish atau Draft.
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
              disabled={isUpdating}
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
              disabled={isUpdating}
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
              disabled={isUpdating}
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
            disabled={isUpdating}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleUpdate('Draft')}
              disabled={isUpdating}
              className="flex-1 sm:flex-none gap-2"
            >
              {isUpdating && submittingStatus === 'Draft' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Menyimpan Draft...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update as Draft
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="default"
              onClick={() => handleUpdate('Publish')}
              disabled={isUpdating}
              className="flex-1 sm:flex-none gap-2 bg-primary hover:bg-primary/90"
            >
              {isUpdating && submittingStatus === 'Publish' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memperbarui...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {currentFormStatus === 'Publish' ? 'Update & Publish' : 'Publish Post'}
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
