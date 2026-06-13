import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-4">
      <div className="bg-surface border border-border rounded-[32px] shadow-2xl p-10 w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-[20px] flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-background font-bold text-3xl">J</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center mb-3 tracking-tight">{isSignUp ? 'Create account' : 'Welcome back'}</h2>
        <p className="text-secondary text-center text-[15px] mb-10 font-medium">
          {isSignUp ? 'Start tracking your career journey today' : 'Sign in to manage your job applications'}
        </p>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-secondary uppercase tracking-[0.1em] flex items-center gap-2 px-1">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input 
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-secondary uppercase tracking-[0.1em] flex items-center gap-2 px-1">
              <Lock className="w-4 h-4" /> Password
            </label>
            <input 
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-primary text-background rounded-2xl font-bold text-[15px] hover:opacity-95 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl shadow-primary/10 disabled:opacity-50 mt-4"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-border/60">
          <p className="text-center text-[14px] text-secondary font-medium">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-bold hover:underline transition-all"
            >
              {isSignUp ? 'Sign In' : 'Create account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
