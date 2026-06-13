import { MoreVertical, Calendar, ExternalLink, Trash2 } from 'lucide-react';
import type { Job, JobStatus } from '../types';

interface JobCardProps {
  job: Job;
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
}

export function JobCard({ job, onUpdateStatus, onDelete }: JobCardProps) {
  const statusColors: Record<JobStatus, string> = {
    Saved: 'bg-gray-100 text-gray-700',
    Applied: 'bg-blue-50 text-blue-700',
    Interviewing: 'bg-purple-50 text-purple-700',
    Rejected: 'bg-red-50 text-red-700',
    Offer: 'bg-green-50 text-green-700',
  };

  return (
    <div className="glass-card p-4 hover:border-primary/20 transition-all group cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-border flex items-center justify-center overflow-hidden shrink-0">
            {job.logo_url ? (
              <img src={job.logo_url} alt={job.company} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-gray-300">{job.company[0]}</span>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-primary text-sm leading-tight mb-1">{job.role}</h4>
            <p className="text-xs text-secondary font-medium">{job.company}</p>
          </div>
        </div>
        <div className="relative">
          <select 
            value={job.status}
            onChange={(e) => onUpdateStatus(job.id, e.target.value as JobStatus)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          >
            <option value="Saved">Saved</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button className="p-1 hover:bg-gray-50 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-secondary" />
          </button>
        </div>
      </div>

      {job.description && (
        <p className="text-xs text-secondary line-clamp-2 mb-3 leading-relaxed">
          {job.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {job.salary_range && (
          <span className="px-2 py-1 bg-gray-50 text-secondary text-[10px] font-semibold rounded-lg border border-border">
            {job.salary_range}
          </span>
        )}
        <span className={`px-2 py-1 text-[10px] font-semibold rounded-lg border border-current/10 ${statusColors[job.status]}`}>
          {job.status}
        </span>
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5 text-secondary">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium">{new Date(job.applied_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {job.link && (
            <a 
              href={job.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-gray-50 rounded-lg text-secondary hover:text-primary transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button 
            onClick={() => onDelete(job.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-secondary hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
