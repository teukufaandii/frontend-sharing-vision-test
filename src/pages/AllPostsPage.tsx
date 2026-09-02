import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2, PlusCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setActiveTab } from '@/features/articles/slices/articleSlice';
import {
  useGetArticlesQuery,
  useUpdateArticleMutation,
} from '@/features/articles/api/articleApi';
import type { Article, TabStatus } from '@/features/articles/types/article.types';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export const AllPostsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const activeTab = useAppSelector((state) => state.article.activeTab);

  const {
    data: articles = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetArticlesQuery({ limit: 1000, offset: 0 });

  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();

  const [articleToThrash, setArticleToThrash] = useState<Article | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const publishedArticles = articles.filter(
    (a) => a.status?.toLowerCase() === 'publish'
  );
  const draftArticles = articles.filter(
    (a) => a.status?.toLowerCase() === 'draft'
  );
  const trashedArticles = articles.filter(
    (a) => a.status?.toLowerCase() === 'thrash'
  );

  const getFilteredArticles = (tab: TabStatus): Article[] => {
    switch (tab) {
      case 'publish':
        return publishedArticles;
      case 'draft':
        return draftArticles;
      case 'thrash':
        return trashedArticles;
      default:
        return [];
    }
  };

  const handleTabChange = (value: string) => {
    dispatch(setActiveTab(value as TabStatus));
  };

  const handleOpenThrashDialog = (article: Article) => {
    setArticleToThrash(article);
    setIsDialogOpen(true);
  };

  const handleConfirmThrash = async () => {
    if (!articleToThrash) return;

    try {
      await updateArticle({
        id: articleToThrash.id,
        title: articleToThrash.title,
        content: articleToThrash.content,
        category: articleToThrash.category,
        status: 'Thrash',
      }).unwrap();

      toast.success(`Artikel "${articleToThrash.title}" berhasil dipindahkan ke Trashed`);
      setIsDialogOpen(false);
      setArticleToThrash(null);
      dispatch(setActiveTab('thrash'));
    } catch (error) {
      console.error('Failed to move article to Thrash:', error);
      toast.error('Gagal memindahkan artikel ke Trashed. Silakan coba lagi.');
    }
  };

  const renderArticleTable = (items: Article[]) => {
    if (items.length === 0) {
      if (activeTab === 'publish') {
        return (
          <EmptyState
            title="Belum ada artikel yang dipublikasikan"
            description="Mulai buat artikel baru dan publikasikan untuk pembaca Anda."
            actionText="Tambah Artikel Baru"
            actionHref="/posts/new"
          />
        );
      }
      if (activeTab === 'draft') {
        return (
          <EmptyState
            title="Belum ada draft artikel"
            description="Simpan tulisan Anda sebagai draft untuk dilanjutkan nanti."
            actionText="Tulis Draft Baru"
            actionHref="/posts/new"
          />
        );
      }
      return (
        <EmptyState
          title="Tidak ada artikel di tempat sampah"
          description="Artikel yang dipindahkan ke Thrash akan muncul di sini."
        />
      );
    }

    return (
      <div className="rounded-lg border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-16 text-center font-bold">No</TableHead>
              <TableHead className="font-bold">Title</TableHead>
              <TableHead className="w-48 font-bold">Category</TableHead>
              <TableHead className="w-32 text-center font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((article, index) => (
              <TableRow
                key={article.id || index}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="text-center font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors">
                    {article.title}
                  </div>
                  {article.created_date && (
                    <span className="text-xs text-muted-foreground">
                      Dibuat: {article.created_date}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-medium bg-muted/30">
                    {article.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Edit Article"
                      onClick={() => navigate(`/posts/edit/${article.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Move to Thrash"
                      disabled={article.status?.toLowerCase() === 'thrash'}
                      onClick={() => handleOpenThrashDialog(article)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Thrash</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            All Posts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola seluruh artikel, pantau status publikasi, draft, dan arsip sampah.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button asChild size="sm" className="gap-2">
            <Link to="/posts/new">
              <PlusCircle className="h-4 w-4" />
              Add New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 max-w-md bg-muted/60 p-1">
          <TabsTrigger
            value="publish"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
          >
            <span>Published</span>
            <Badge
              variant="default"
              className="h-5 px-1.5 text-[11px] font-bold rounded-full ml-1"
            >
              {publishedArticles.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="draft"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
          >
            <span>Drafts</span>
            <Badge
              variant="secondary"
              className="h-5 px-1.5 text-[11px] font-bold rounded-full ml-1"
            >
              {draftArticles.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="thrash"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-xs"
          >
            <span>Trashed</span>
            <Badge
              variant="destructive"
              className="h-5 px-1.5 text-[11px] font-bold rounded-full ml-1"
            >
              {trashedArticles.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Loading State */}
        {isLoading ? (
          <div className="rounded-lg border bg-card p-12">
            <LoadingSpinner message="Memuat daftar artikel..." />
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-red-200 bg-red-50/40 dark:border-red-900/30 dark:bg-red-950/20 p-8 text-center">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Gagal Memuat Artikel
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Terjadi kesalahan saat menghubungi server backend di http://localhost:8080.
              Pastikan server backend Go sedang berjalan.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Coba Lagi
            </Button>
          </div>
        ) : (
          <>
            <TabsContent value="publish" className="mt-0 focus-visible:outline-none">
              {renderArticleTable(getFilteredArticles('publish'))}
            </TabsContent>

            <TabsContent value="draft" className="mt-0 focus-visible:outline-none">
              {renderArticleTable(getFilteredArticles('draft'))}
            </TabsContent>

            <TabsContent value="thrash" className="mt-0 focus-visible:outline-none">
              {renderArticleTable(getFilteredArticles('thrash'))}
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Confirmation Alert Dialog for Thrash Action */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2.5 text-foreground font-semibold text-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100/80 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <Trash2 className="h-4 w-4" />
              </div>
              <span>Pindahkan Artikel ke Trash?</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-2 text-muted-foreground leading-relaxed">
              Artikel <span className="font-semibold text-foreground">"{articleToThrash?.title}"</span>{' '}
              akan dipindahkan ke tab <span className="font-semibold text-foreground">Trashed</span> dan tidak
              lagi tampil di blog publik. Anda tetap dapat mengaksesnya di tab Trashed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel disabled={isUpdating}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmThrash();
              }}
              disabled={isUpdating}
              className="bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-xs border-transparent font-medium"
            >
              {isUpdating ? 'Memindahkan...' : 'Pindahkan ke Trash'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
