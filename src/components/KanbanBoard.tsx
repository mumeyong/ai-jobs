import { Plus, MoreHorizontal } from 'lucide-react';
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
    <div className="flex gap-6 overflow-x-auto pb-8 min-h-[calc(100vh-250px)] px-6">
      {COLUMNS.map((column) => {
        const columnJobs = jobs.filter((job) => job.status === column.status);
        
        return (
          <div key={column.status} className="kanban-column">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-primary">{column.label}</h3>
                <span className="bg-gray-200/50 text-secondary text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {columnJobs.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => onAddClick(column.status)}
                  className="p-1 hover:bg-gray-200/50 rounded-lg transition-colors text-secondary hover:text-primary"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-gray-200/50 rounded-lg transition-colors text-secondary">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              {columnJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onUpdateStatus={onUpdateStatus} 
                  onDelete={onDelete} 
                />
              ))}
              
              {columnJobs.length === 0 && (
                <div className="h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No jobs</p>
                </div>
              )}
              
              <button 
                onClick={() => onAddClick(column.status)}
                className="w-full py-3 rounded-xl border border-transparent hover:border-gray-200 hover:bg-white text-secondary hover:text-primary transition-all text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Job
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
