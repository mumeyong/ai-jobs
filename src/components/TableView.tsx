import { Trash2, Building, DollarSign, Calendar, Globe, Pencil } from 'lucide-react';
import type { Job, JobStatus } from '../types';

interface TableViewProps {
  jobs: Job[];
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (job: Job) => void;
}

export function TableView({ jobs, onUpdateStatus, onDelete, onEdit }: TableViewProps) {
  const statusColors: Record<JobStatus, string> = {
    Saved: 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300',
    Applied: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    Interviewing: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    Rejected: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    Offer: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  };

  return (
    <div className="px-6 pb-8">
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-neutral-900/50 border-b border-border">
              <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Role & Company</th>
              <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Salary</th>
              <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Applied Date</th>
              <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50/30 dark:hover:bg-neutral-900/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-neutral-800 border border-border flex items-center justify-center overflow-hidden shrink-0">
                      {job.logo_url ? (
                        <img src={job.logo_url} alt={job.company} className="w-full h-full object-cover" />
                      ) : (
                        <Building className="w-4 h-4 text-secondary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{job.role}</p>
                      <p className="text-xs text-secondary font-medium">{job.company}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={job.status}
                    onChange={(e) => onUpdateStatus(job.id, e.target.value as JobStatus)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold border border-current/10 ${statusColors[job.status]} focus:outline-none cursor-pointer appearance-none`}
                  >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-secondary">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{job.salary_range || '-'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-secondary">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{new Date(job.applied_date).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    {job.link && (
                      <a 
                        href={job.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-background rounded-lg text-secondary hover:text-primary transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    <button 
                      onClick={() => onEdit(job)}
                      className="p-1.5 hover:bg-background rounded-lg text-secondary hover:text-primary transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(job.id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-secondary hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 && (
          <div className="text-center py-20 bg-surface">
            <p className="text-secondary font-medium">No records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
