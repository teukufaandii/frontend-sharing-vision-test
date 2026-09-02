import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { AppRoutes } from '@/routes/AppRoutes';
import { Toaster } from '@/components/ui/sonner';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Header />
        <main className="flex-1 w-full">
          <AppRoutes />
        </main>
        <footer className="border-t py-6 text-center text-xs text-muted-foreground bg-muted/20">
          <div className="container mx-auto px-4">
            &copy; 2026 Sharing Vision Article Management Dashboard &amp; Blog Preview.
          </div>
        </footer>
        <Toaster />
      </div>
    </BrowserRouter>
  );
};

export default App;
