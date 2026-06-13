import { useState, useEffect } from 'react';
import './styles/globals.css';
import { supabase } from './lib/supabase';
import type { Job, NewJob } from './types';
import { JobModal } from './components/JobModal';
import { Auth } from './components/Auth';
import type { Session } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Job['status'] | 'All'>('All');

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
    if (!session?.user) {
      console.log('No active session, skipping fetch');
      return;
    }
    
    setLoading(true);
    console.log('Fetching jobs for user:', session.user.id);
    
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error:', error);
      alert('Supabase Error: ' + error.message);
    } else {
      console.log('Successfully fetched jobs:', data);
      setJobs(data || []);
    }
    setLoading(false);
  }

  async function addJob(newJob: NewJob) {
    if (!session?.user) {
      alert('You must be logged in to add a job.');
      return;
    }

    const payload = {
      ...newJob,
      user_id: session.user.id
    };

    console.log('Attempting to save job with payload:', payload);

    const { data, error } = await supabase
      .from('jobs')
      .insert([payload])
      .select();

    if (error) {
      console.error('Save Error:', error);
      alert('Failed to save job: ' + error.message + ' (Code: ' + error.code + ')');
    } else if (data) {
      console.log('Successfully saved:', data[0]);
      setJobs([data[0], ...jobs]);
      setIsModalOpen(false);
    }
  }

  async function updateJobStatus(id: string, status: Job['status']) {
    const { error } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status: ' + error.message);
    } else {
      setJobs(jobs.map(j => j.id === id ? { ...j, status } : j));
    }
  }

  async function deleteJob(id: string) {
    if (!confirm('Are you sure you want to delete this application?')) return;

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job: ' + error.message);
    } else {
      setJobs(jobs.filter(j => j.id !== id));
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container">
      {!session ? (
        <>
          <header style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '12px' }}>Jobs Tracker</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Securely track your career journey</p>
          </header>
          <Auth />
        </>
      ) : (
        <>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Jobs Tracker</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <p style={{ color: 'var(--text-secondary)' }}>{session.user.email}</p>
                <button 
                  onClick={() => supabase.auth.signOut()}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}
                >
                  Sign Out
                </button>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <span>+</span> Add New Job
            </button>
          </header>

          <JobModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSubmit={addJob} 
          />

      <section className="filters" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search company or role..." 
          className="input" 
          style={{ flex: 2, minWidth: '200px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="input" 
          style={{ flex: 1, minWidth: '150px' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="All">All Status</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </section>

      <section className="dashboard" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Applications</p>
          <h2 style={{ fontSize: '2rem' }}>{jobs.length}</h2>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Interviews</p>
          <h2 style={{ fontSize: '2rem', color: '#6366f1' }}>{jobs.filter(j => j.status === 'Interviewing').length}</h2>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Offers</p>
          <h2 style={{ fontSize: '2rem', color: '#10b981' }}>{jobs.filter(j => j.status === 'Offer').length}</h2>
        </div>
        <div className="glass-card" style={{ padding: '24px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active</p>
          <h2 style={{ fontSize: '2rem' }}>{jobs.filter(j => j.status !== 'Rejected' && j.status !== 'Offer').length}</h2>
        </div>
      </section>

      <main>
        {loading ? (
          <p>Loading your applications...</p>
        ) : filteredJobs.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '16px' }}>{searchTerm || filterStatus !== 'All' ? 'No jobs match your filters' : 'No jobs tracked yet'}</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {searchTerm || filterStatus !== 'All' ? 'Try adjusting your search or filters.' : 'Click the "Add New Job" button to start tracking your applications.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {filteredJobs.map((job) => (
              <div key={job.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>{job.role}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{job.company}</p>
                  </div>
                  <select 
                    value={job.status}
                    onChange={(e) => updateJobStatus(job.id, e.target.value as Job['status'])}
                    style={{ 
                      padding: '4px 8px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      background: job.status === 'Offer' ? '#10b981' : job.status === 'Rejected' ? '#ef4444' : 'rgba(255,255,255,0.15)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer',
                      outline: 'none',
                      fontWeight: '600',
                      colorScheme: 'dark'
                    }}
                  >
                    <option value="Applied" style={{ background: '#1e1b4b', color: 'white' }}>Applied</option>
                    <option value="Interviewing" style={{ background: '#1e1b4b', color: 'white' }}>Interviewing</option>
                    <option value="Offer" style={{ background: '#10b981', color: 'white' }}>Offer</option>
                    <option value="Rejected" style={{ background: '#ef4444', color: 'white' }}>Rejected</option>
                  </select>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Applied: {new Date(job.applied_date).toLocaleDateString()}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {job.link && (
                      <a href={job.link} target="_blank" rel="noopener noreferrer" className="btn" style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', textDecoration: 'none', color: 'inherit', fontSize: '0.85rem' }}>Link</a>
                    )}
                    <button onClick={() => deleteJob(job.id)} className="btn" style={{ padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.85rem' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      </>
      )}
    </div>
  );
}

export default App;
