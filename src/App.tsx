import { useState, useEffect } from 'react';
import './styles/globals.css';
import { supabase } from './lib/supabase';
import type { Job, NewJob, JobStatus } from './types';
import { JobModal } from './components/JobModal';
import { Auth } from './components/Auth';
import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import type { Session } from '@supabase/supabase-js';
import { LayoutGrid, List, Table, Filter, ArrowUpDown, Plus } from 'lucide-react';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState<JobStatus>('Applied');
  const [view, setView] = useState<'Board' | 'List' | 'Table'>('Board');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchJobs();
    } else {
      setJobs([]);
      setLoading(false);
    }
  }, [session]);

  async function fetchJobs() {
    if (!session?.user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setJobs(data);
    }
    setLoading(false);
  }

  async function addJob(newJob: NewJob) {
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('jobs')
      .insert([{ ...newJob, user_id: session.user.id }])
      .select();

    if (!error && data) {
      setJobs([data[0], ...jobs]);
    }
  }

  async function updateJobStatus(id: string, status: JobStatus) {
    const { error } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
    }
  }

  async function deleteJob(id: string) {
    if (!confirm('Are you sure?')) return;

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (!error) {
      setJobs(jobs.filter(j => j.id !== id));
    }
  }

  const handleAddClick = (status: JobStatus) => {
    setInitialStatus(status);
    setIsModalOpen(true);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar userEmail={null} />
        <main className="flex-1">
          <Auth />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar userEmail={session.user.email} />
      
      <header className="px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">Jobs</h1>
            <p className="text-secondary font-medium">Manage and track your job applications in one place.</p>
          </div>
          <button 
            onClick={() => handleAddClick('Applied')}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add New Job
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center bg-gray-100/50 p-1 rounded-xl border border-border">
            <button 
              onClick={() => setView('Board')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'Board' ? 'bg-white shadow-soft text-primary' : 'text-secondary hover:text-primary'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Board
            </button>
            <button 
              onClick={() => setView('List')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'List' ? 'bg-white shadow-soft text-primary' : 'text-secondary hover:text-primary'}`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
            <button 
              onClick={() => setView('Table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'Table' ? 'bg-white shadow-soft text-primary' : 'text-secondary hover:text-primary'}`}
            >
              <Table className="w-3.5 h-3.5" />
              Table
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-bold text-secondary hover:text-primary hover:border-primary/20 transition-all">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-bold text-secondary hover:text-primary hover:border-primary/20 transition-all">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <KanbanBoard 
            jobs={jobs} 
            onUpdateStatus={updateJobStatus} 
            onDelete={deleteJob} 
            onAddClick={handleAddClick}
          />
        )}
      </main>

      <JobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={addJob}
        initialStatus={initialStatus}
      />
    </div>
  );
}

export default App;
