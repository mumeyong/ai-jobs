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
    <nav className="h-18 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center shadow-lg shadow-primary/10 transition-transform group-hover:scale-105 active:scale-95">
            <span className="text-background font-bold text-xl">J</span>
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">JobTrace</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8">
          <a href="#" className="text-[14px] font-bold text-primary tracking-tight">Workspace</a>
          <a href="#" className="text-[14px] font-bold text-secondary hover:text-primary transition-all tracking-tight">Insights</a>
          <a href="#" className="text-[14px] font-bold text-secondary hover:text-primary transition-all tracking-tight">Archive</a>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60" />
          <input 
            type="text" 
            placeholder="Search applications..." 
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11 pr-4 py-2 bg-secondary/5 border border-border/60 rounded-xl text-[14px] font-medium focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/30 w-72 transition-all placeholder:text-secondary/40"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2.5 hover:bg-secondary/10 rounded-xl transition-colors relative group">
            <Bell className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-surface shadow-sm"></span>
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 hover:bg-secondary/10 rounded-xl transition-colors group"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
            ) : (
              <Moon className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
            )}
          </button>
        </div>

        <div className="h-8 w-px bg-border/60 mx-1"></div>

        <div className="flex items-center gap-3.5">
          <div className="text-right hidden xl:block">
            <p className="text-[13px] font-bold text-primary truncate max-w-[150px] tracking-tight">{userEmail}</p>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="text-[10px] font-black text-secondary hover:text-red-500 uppercase tracking-widest transition-colors"
            >
              Sign Out
            </button>
          </div>
          <div className="w-10 h-10 bg-secondary/10 dark:bg-neutral-800 rounded-full flex items-center justify-center border border-border/60 overflow-hidden shadow-sm">
            <User className="w-5.5 h-5.5 text-secondary" />
          </div>
        </div>
      </div>
    </nav>
  );
}
