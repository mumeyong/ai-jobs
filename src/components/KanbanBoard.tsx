import { Plus, MoreHorizontal, Briefcase } from 'lucide-react';
import type { Job, JobStatus } from '../types';
import { JobCard } from './JobCard';

interface KanbanBoardProps {
  jobs: Job[];
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
  onAddClick: (status: JobStatus) => void;
}

const COLUMNS: { label: string; status: JobStatus }[] = [
  { label: 'Saved', status: 'Saved' },
  { label: 'Applied', status: 'Applied' },
  { label: 'Interviews', status: 'Interviewing' },
  { label: 'Offered', status: 'Offer' },
  { label: 'Rejected', status: 'Rejected' },
];

export function KanbanBoard({ jobs, onUpdateStatus, onDelete, onAddClick }: KanbanBoardProps) {
  return (
    <div className="flex gap-8 overflow-x-auto pb-10 min-h-[calc(100vh-280px)] px-8 scrollbar-hide">
      {COLUMNS.map((column) => {
        const columnJobs = jobs.filter((job) => job.status === column.status);
        
        return (
          <div key={column.status} className="kanban-column">
            <div className="flex items-center justify-between mb-4 px-2 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <h3 className="font-extrabold text-[15px] text-primary tracking-tight truncate">{column.label}</h3>
                <span className="bg-secondary/10 text-secondary text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0">
                  {columnJobs.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => onAddClick(column.status)}
                  className="p-1.5 hover:bg-secondary/10 rounded-lg transition-colors text-secondary hover:text-primary"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-secondary/10 rounded-lg transition-colors text-secondary">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {columnJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onUpdateStatus={onUpdateStatus} 
                  onDelete={onDelete} 
                />
              ))}
              
              {columnJobs.length === 0 && (
                <div className="h-32 border-2 border-dashed border-border/60 rounded-[24px] flex flex-col items-center justify-center bg-secondary/5 gap-2 group hover:bg-secondary/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-secondary/30">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-secondary/40 uppercase tracking-widest">No applications</p>
                </div>
              )}
              
              <button 
                onClick={() => onAddClick(column.status)}
                className="w-full py-4 rounded-[20px] border-2 border-dashed border-border hover:border-accent/30 hover:bg-accent/5 text-secondary/60 hover:text-accent transition-all text-[13px] font-bold flex items-center justify-center gap-2.5"
              >
                <Plus className="w-4 h-4" />
                Add to {column.label}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
