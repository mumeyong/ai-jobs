import { ExternalLink, Trash2, Calendar, DollarSign, Building, Pencil } from 'lucide-react';
import type { Job, JobStatus } from '../types';

interface ListViewProps {
  jobs: Job[];
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (job: Job) => void;
}

export function ListView({ jobs, onUpdateStatus, onDelete, onEdit }: ListViewProps) {
  const statusColors: Record<JobStatus, string> = {
    Saved: 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300',
    Applied: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    Interviewing: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
    Rejected: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
    Offer: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  };

  return (
    <div className="px-6 space-y-2">
      {jobs.map((job) => (
        <div 
          key={job.id} 
          className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/20 transition-all group"
        >
          <div className="flex items-center gap-6 flex-1">
            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-border flex items-center justify-center overflow-hidden shrink-0">
              {job.logo_url ? (
                <img src={job.logo_url} alt={job.company} className="w-full h-full object-cover" />
              ) : (
                <Building className="w-5 h-5 text-secondary" />
              )}
            </div>
            
            <div className="flex-1 grid grid-cols-4 gap-4 items-center">
              <div>
                <h4 className="font-bold text-primary text-sm truncate">{job.role}</h4>
                <p className="text-xs text-secondary font-medium">{job.company}</p>
              </div>
              
              <div className="flex items-center gap-1.5 text-secondary">
                <DollarSign className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{job.salary_range || 'Not specified'}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-secondary">
                {job.status === 'Interviewing' && job.interview_date ? (
                  <>
                    <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                      INT: {new Date(job.interview_date).toLocaleDateString()}
                    </span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{new Date(job.applied_date).toLocaleDateString()}</span>
                  </>
                )}
              </div>
              
              <div className="flex justify-start">
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
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
            {job.link && (
              <a 
                href={job.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 hover:bg-background rounded-lg text-secondary hover:text-primary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button 
              onClick={() => onEdit(job)}
              className="p-2 hover:bg-background rounded-lg text-secondary hover:text-primary transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(job.id)}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-secondary hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      
      {jobs.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl">
          <p className="text-secondary font-medium">No applications found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
