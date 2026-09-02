import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  RefreshCw,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';

import { useGetArticlesQuery } from '@/features/articles/api/articleApi';
import type { Article } from '@/features/articles/types/article.types';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

const ITEMS_PER_PAGE = 6;

// Format date helper: e.g. "02 Sep 2026"
const formatPublishedDate = (dateString?: string): string => {
  if (!dateString) {
    return '02 Sep 2026';
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

// Calculate reading time estimated in minutes
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 180;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};

export const PreviewBlogPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);

  // Fetch articles from backend
  const {
    data: articles = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetArticlesQuery({
    limit: 1000,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  // Filter ONLY published articles
  const publishedArticles = articles.filter(
    (article) => article.status?.toLowerCase() === 'publish'
  );

  // Search filter
  const filteredArticles = publishedArticles.filter((article) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      article.title.toLowerCase().includes(query) ||
      article.category.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query)
    );
  });

  // Pagination calculation
  const totalItems = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenReadModal = (article: Article) => {
    setSelectedArticle(article);
    setIsReadModalOpen(true);
  };

  const handleShare = (article: Article) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(`Tautan untuk "${article.title}" berhasil disalin!`);
    } else {
      toast.info(`Berbagi artikel: ${article.title}`);
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-background via-muted/10 to-muted/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Blog Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/70 bg-muted/60 text-foreground text-xs font-medium mb-4 shadow-2xs">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Public Article Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Blog &amp; Knowledge Feed
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Kumpulan artikel, wawasan teknologi, dan dokumentasi yang telah dipublikasikan secara resmi.
          </p>

          {/* Search & Stats Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari judul, kategori, atau topik..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 h-10 bg-background shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="rounded-2xl border bg-card p-16 shadow-xs">
            <LoadingSpinner message="Memuat artikel publik..." size="lg" />
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-12 text-center max-w-lg mx-auto">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              Koneksi Backend Terputus
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Tidak dapat terhubung ke server backend di http://localhost:8080.
              Pastikan service Go sudah dijalankan.
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Muat Ulang
            </Button>
          </div>
        ) : paginatedArticles.length === 0 ? (
          <div className="max-w-md mx-auto py-12">
            <EmptyState
              title={
                searchQuery
                  ? `Tidak ada artikel sesuai pencarian "${searchQuery}"`
                  : 'Belum Ada Artikel Dipublikasikan'
              }
              description={
                searchQuery
                  ? 'Coba kata kunci lain atau bersihkan kotak pencarian di atas.'
                  : 'Artikel yang berstatus Publish di dashboard akan otomatis ditampilkan di sini.'
              }
              actionText={searchQuery ? 'Reset Pencarian' : 'Tulis Artikel Sekarang'}
              actionHref={searchQuery ? '#' : '/posts/new'}
            />
          </div>
        ) : (
          <>
            {/* Responsive Article Cards Grid: 1 col on mobile, 2-3 on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedArticles.map((article) => {
                const readingTime = calculateReadingTime(article.content);
                const formattedDate = formatPublishedDate(article.created_date);

                return (
                  <Card
                    key={article.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40"
                  >
                    <div>
                      {/* Card Header with Category & Date */}
                      <CardHeader className="p-6 pb-4">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <Badge
                            variant="secondary"
                            className="font-medium"
                          >
                            {article.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                            <Clock className="h-3 w-3" />
                            <span>{readingTime} min read</span>
                          </div>
                        </div>

                        <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                          {article.title}
                        </CardTitle>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formattedDate}</span>
                        </div>
                      </CardHeader>

                      {/* Content Excerpt with Ellipsis */}
                      <CardContent className="px-6 py-2">
                        <CardDescription className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                          {article.content}
                        </CardDescription>
                      </CardContent>
                    </div>

                    {/* Card Footer with Read More Button */}
                    <CardFooter className="p-6 pt-4 border-t bg-muted/10 flex items-center justify-between">
                      <Button
                        variant="default"
                        size="sm"
                        className="gap-2 group/btn cursor-pointer font-medium"
                        onClick={() => handleOpenReadModal(article)}
                      >
                        <span>Read More</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Share Article"
                        onClick={() => handleShare(article)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center">
                <Pagination>
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(safeCurrentPage - 1)}
                        disabled={safeCurrentPage <= 1}
                        className={
                          safeCurrentPage <= 1
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={pageNum === safeCurrentPage}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(safeCurrentPage + 1)}
                        disabled={safeCurrentPage >= totalPages}
                        className={
                          safeCurrentPage >= totalPages
                            ? 'pointer-events-none opacity-50'
                            : 'cursor-pointer'
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* Full Reading Dialog / Modal */}
      <Dialog open={isReadModalOpen} onOpenChange={setIsReadModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-6 sm:p-8">
          {selectedArticle && (
            <>
              <DialogHeader className="space-y-3 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-medium">
                    {selectedArticle.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {calculateReadingTime(selectedArticle.content)} min read
                  </span>
                </div>

                <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight text-left">
                  {selectedArticle.title}
                </DialogTitle>

                <DialogDescription className="flex items-center gap-2 text-xs text-muted-foreground text-left">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Dipublikasikan pada {formatPublishedDate(selectedArticle.created_date)}</span>
                </DialogDescription>
              </DialogHeader>

              {/* Full Content Body */}
              <div className="py-6 text-foreground/90 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-4">
                {selectedArticle.content}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare(selectedArticle)}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Salin Tautan
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsReadModalOpen(false)}
                >
                  Tutup
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
