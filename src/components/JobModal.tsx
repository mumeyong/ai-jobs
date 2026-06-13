import { useState } from 'react';
import type { NewJob, JobStatus } from '../types';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (job: NewJob) => void;
}

export function JobModal({ isOpen, onClose, onSubmit }: JobModalProps) {
  const [formData, setFormData] = useState<NewJob>({
    company: '',
    role: '',
    status: 'Applied',
    applied_date: new Date().toISOString().split('T')[0],
    link: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      company: '',
      role: '',
      status: 'Applied',
      applied_date: new Date().toISOString().split('T')[0],
      link: '',
      notes: ''
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-card" style={{ padding: '32px', width: '100%', maxWidth: '500px', margin: '20px' }}>
        <h2 style={{ marginBottom: '24px' }}>Add New Job</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Company</label>
            <input 
              required
              className="input"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Google, Meta, etc."
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Role</label>
            <input 
              required
              className="input"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Software Engineer"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Status</label>
              <select 
                className="input"
                style={{ appearance: 'none', colorScheme: 'dark' }}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
              >
                <option value="Applied" style={{ background: '#1e1b4b', color: 'white' }}>Applied</option>
                <option value="Interviewing" style={{ background: '#1e1b4b', color: 'white' }}>Interviewing</option>
                <option value="Offer" style={{ background: '#1e1b4b', color: 'white' }}>Offer</option>
                <option value="Rejected" style={{ background: '#1e1b4b', color: 'white' }}>Rejected</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Date Applied</label>
              <input 
                type="date"
                className="input"
                value={formData.applied_date}
                onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Link (Optional)</label>
            <input 
              className="input"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://jobs.company.com/..."
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Add Job</button>
            <button type="button" onClick={onClose} className="btn" style={{ flex: 1, justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
