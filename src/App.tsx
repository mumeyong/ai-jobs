import { useState, useEffect, useMemo } from 'react';
import './styles/globals.css';
import { supabase } from './lib/supabase';
import type { Job, NewJob, JobStatus } from './types';
import { JobModal } from './components/JobModal';
import { Auth } from './components/Auth';
import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { TableView } from './components/TableView';
import { CalendarView } from './components/CalendarView';
import type { Session } from '@supabase/supabase-js';
import { LayoutGrid, List, Table, Filter, ArrowUpDown, Plus, Calendar as CalendarIcon, X } from 'lucide-react';

type ViewMode = 'Board' | 'List' | 'Table' | 'Calendar';
type SortMode = 'Recent' | 'Company' | 'Role' | 'Date';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState<JobStatus>('Applied');
  const [view, setView] = useState<ViewMode>('Board');
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortMode>('Recent');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchJobs();
    else { setJobs([]); setLoading(false); }
  }, [session]);

  async function fetchJobs() {
    if (!session?.user) return;
    setLoading(true);
    const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (!error && data) setJobs(data);
    setLoading(false);
  }

  async function addJob(newJob: NewJob) {
    if (!session?.user) return;
    const { data, error } = await supabase.from('jobs').insert([{ ...newJob, user_id: session.user.id }]).select();
    if (!error && data) setJobs([data[0], ...jobs]);
  }

  async function updateJobStatus(id: string, status: JobStatus) {
    const { error } = await supabase.from('jobs').update({ status }).eq('id', id);
    if (!error) setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
  }

  async function deleteJob(id: string) {
    if (!confirm('Are you sure you want to delete this?')) return;
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (!error) setJobs(jobs.filter(j => j.id !== id));
  }

  const handleAddClick = (status: JobStatus) => {
    setInitialStatus(status);
    setIsModalOpen(true);
  };

  // Filter & Sort Logic
  const filteredAndSortedJobs = useMemo(() => {
    let result = jobs.filter(job => {
      const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           job.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortBy === 'Company') return a.company.localeCompare(b.company);
      if (sortBy === 'Role') return a.role.localeCompare(b.role);
      if (sortBy === 'Date') return new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime();
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Recent
    });

    return result;
  }, [jobs, searchTerm, filterStatus, sortBy]);

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar userEmail={null} onSearchChange={setSearchTerm} searchValue={searchTerm} />
        <main className="flex-1"><Auth /></main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-200">
      <Navbar userEmail={session.user.email} onSearchChange={setSearchTerm} searchValue={searchTerm} />
      
      <header className="px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">Jobs</h1>
            <p className="text-secondary font-medium">Manage and track your job applications in one place.</p>
          </div>
          <button 
            onClick={() => handleAddClick('Applied')}
            className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Add New Job
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center bg-gray-100/50 dark:bg-neutral-900/50 p-1 rounded-xl border border-border">
            <button onClick={() => setView('Board')} className={`view-tab ${view === 'Board' ? 'view-tab-active' : 'view-tab-inactive'}`}>
              <LayoutGrid className="w-3.5 h-3.5" /> Board
            </button>
            <button onClick={() => setView('List')} className={`view-tab ${view === 'List' ? 'view-tab-active' : 'view-tab-inactive'}`}>
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button onClick={() => setView('Table')} className={`view-tab ${view === 'Table' ? 'view-tab-active' : 'view-tab-inactive'}`}>
              <Table className="w-3.5 h-3.5" /> Table
            </button>
            <button onClick={() => setView('Calendar')} className={`view-tab ${view === 'Calendar' ? 'view-tab-active' : 'view-tab-inactive'}`}>
              <CalendarIcon className="w-3.5 h-3.5" /> Calendar
            </button>
          </div>

          <div className="flex items-center gap-3 relative">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-bold transition-all ${filterStatus !== 'All' ? 'text-primary border-primary/50' : 'text-secondary hover:text-primary'}`}
              >
                <Filter className="w-3.5 h-3.5" />
                {filterStatus === 'All' ? 'Filter' : filterStatus}
                {filterStatus !== 'All' && <X className="w-3 h-3 ml-1 hover:text-red-500" onClick={(e) => { e.stopPropagation(); setFilterStatus('All'); }} />}
              </button>
              
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-surface text-xs font-bold text-secondary hover:text-primary transition-all">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Sort: {sortBy}
                </button>
                <div className="absolute right-0 top-full mt-2 w-32 bg-surface border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {(['Recent', 'Company', 'Role', 'Date'] as SortMode[]).map(s => (
                    <button key={s} onClick={() => setSortBy(s)} className="w-full text-left px-4 py-2 text-[10px] font-bold text-secondary hover:text-primary hover:bg-background first:rounded-t-xl last:rounded-b-xl">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-bold text-secondary px-3 py-2 uppercase tracking-widest">Filter by Status</p>
                {(['All', 'Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'] as const).map(s => (
                  <button 
                    key={s} 
                    onClick={() => { setFilterStatus(s); setIsFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors ${filterStatus === s ? 'bg-primary/5 text-primary' : 'text-secondary hover:bg-background hover:text-primary'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {view === 'Board' && (
              <KanbanBoard jobs={filteredAndSortedJobs} onUpdateStatus={updateJobStatus} onDelete={deleteJob} onAddClick={handleAddClick} />
            )}
            {view === 'List' && (
              <ListView jobs={filteredAndSortedJobs} onUpdateStatus={updateJobStatus} onDelete={deleteJob} />
            )}
            {view === 'Table' && (
              <TableView jobs={filteredAndSortedJobs} onUpdateStatus={updateJobStatus} onDelete={deleteJob} />
            )}
            {view === 'Calendar' && (
              <CalendarView jobs={filteredAndSortedJobs} />
            )}
          </>
        )}
      </main>

      <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addJob} initialStatus={initialStatus} />
    </div>
  );
}

export default App;
