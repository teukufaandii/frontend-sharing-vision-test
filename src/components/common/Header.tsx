import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, PlusCircle, Eye, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const navItems = [
    {
      to: '/posts',
      label: 'All Posts',
      icon: FileText,
      exact: true,
    },
    {
      to: '/posts/new',
      label: 'Add New Post',
      icon: PlusCircle,
    },
    {
      to: '/preview',
      label: 'Preview Blog',
      icon: Eye,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xs">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Newspaper className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl m-0">
              Article Management
            </h1>
            <p className="text-xs text-muted-foreground m-0 hidden sm:block">
              Sharing Vision Frontend Test
            </p>
          </div>
        </div>

        <nav className="flex items-center space-x-1 sm:space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
