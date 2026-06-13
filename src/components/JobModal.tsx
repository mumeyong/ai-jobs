import { useState, useEffect } from 'react';
import { X, Globe, DollarSign, Building, Briefcase, FileText } from 'lucide-react';
import type { NewJob, JobStatus } from '../types';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (job: NewJob) => void;
  initialStatus?: JobStatus;
}

export function JobModal({ isOpen, onClose, onSubmit, initialStatus = 'Applied' }: JobModalProps) {
  const [formData, setFormData] = useState<NewJob>({
    company: '',
    role: '',
    status: initialStatus,
    applied_date: new Date().toISOString().split('T')[0],
    link: '',
    notes: '',
    salary_range: '',
    description: '',
    logo_url: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, status: initialStatus }));
    }
  }, [isOpen, initialStatus]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      company: '',
      role: '',
      status: 'Applied',
      applied_date: new Date().toISOString().split('T')[0],
      link: '',
      notes: '',
      salary_range: '',
      description: '',
      logo_url: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-surface w-full max-w-xl rounded-[28px] shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-xl tracking-tight">Add New Job</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary/10 rounded-full transition-colors">
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-8">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-secondary uppercase tracking-[0.1em] flex items-center gap-2 px-1">
                <Building className="w-3.5 h-3.5" /> Company
              </label>
              <input 
                required
                className="input-field"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Apple"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-secondary uppercase tracking-[0.1em] flex items-center gap-2 px-1">
                <Briefcase className="w-3.5 h-3.5" /> Role
              </label>
              <input 
                required
                className="input-field"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Software Engineer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-secondary uppercase tracking-[0.1em] flex items-center gap-2 px-1">
                Status
              </label>
              <div className="relative">
                <select 
                  className="input-field appearance-none cursor-pointer"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
                >
                  <option value="Saved">Saved</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
                  <X className="w-4 h-4 rotate-45" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-secondary uppercase tracking-[0.1em] flex items-center gap-2 px-1">
                Date Applied
              </label>
              <input 
                type="date"
                className="input-field"
                value={formData.applied_date}
                onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-secondary uppercase tracking-[0.1em] flex items-center gap-2 px-1">
                <DollarSign className="w-3.5 h-3.5" /> Salary Range
              </label>
              <input 
                className="input-field"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                placeholder="e.g. $120k - $150k"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-secondary uppercase tracking-[0.1em] flex items-center gap-2 px-1">
                <Globe className="w-3.5 h-3.5" /> Link
              </label>
              <input 
                className="input-field"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <label className="text-[11px] font-bold text-secondary uppercase tracking-[0.1em] flex items-center gap-2 px-1">
              <FileText className="w-3.5 h-3.5" /> Description / Notes
            </label>
            <textarea 
              className="input-field min-h-[120px] resize-none py-3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Key requirements, tech stack, etc."
            />
          </div>

          <div className="flex gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-6 py-3 rounded-2xl border border-border font-bold text-[15px] hover:bg-secondary/5 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-6 py-3 rounded-2xl bg-primary text-background font-bold text-[15px] hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10"
            >
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
