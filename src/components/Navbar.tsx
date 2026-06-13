import { Search, Bell, Moon, Sun, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../hooks/useTheme';

interface NavbarProps {
  userEmail?: string | null;
  onSearchChange: (value: string) => void;
  searchValue: string;
}

export function Navbar({ userEmail, onSearchChange, searchValue }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="h-16 border-b border-border bg-surface flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-background font-bold text-xl">J</span>
          </div>
          <span className="font-bold text-lg tracking-tight">JobTrace</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-primary">Workspace</a>
          <a href="#" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Insights</a>
          <a href="#" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Archive</a>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input 
            type="text" 
            placeholder="Search applications..." 
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 w-64 transition-all"
          />
        </div>
        
        <button className="p-2 hover:bg-background rounded-xl transition-colors relative">
          <Bell className="w-5 h-5 text-secondary" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
        </button>
        
        <button 
          onClick={toggleTheme}
          className="p-2 hover:bg-background rounded-xl transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-secondary" />
          ) : (
            <Moon className="w-5 h-5 text-secondary" />
          )}
        </button>

        <div className="h-8 w-px bg-border mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-medium text-primary truncate max-w-[150px]">{userEmail}</p>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="text-[10px] font-bold text-secondary hover:text-red-500 uppercase tracking-wider transition-colors"
            >
              Sign Out
            </button>
          </div>
          <div className="w-9 h-9 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center border border-border overflow-hidden">
            <User className="w-5 h-5 text-secondary" />
          </div>
        </div>
      </div>
    </nav>
  );
}
