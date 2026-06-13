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
      <div className="bg-surface w-full max-w-xl rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gray-50/50">
          <h2 className="font-bold text-lg">Add New Job</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200/50 rounded-xl transition-colors">
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> Company
              </label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Google"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Role
              </label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Product Designer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                Status
              </label>
              <select 
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all appearance-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
              >
                <option value="Saved">Saved</option>
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                Date Applied
              </label>
              <input 
                type="date"
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all"
                value={formData.applied_date}
                onChange={(e) => setFormData({ ...formData, applied_date: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Salary Range
              </label>
              <input 
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all"
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                placeholder="e.g. $120k - $150k"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Link
              </label>
              <input 
                className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-1.5 mb-6">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Description / Notes
            </label>
            <textarea 
              className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all min-h-[100px] resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Key requirements, tech stack, etc."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-4 py-2.5 rounded-xl border border-border font-bold text-sm hover:bg-gray-50 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
