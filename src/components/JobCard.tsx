import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Calendar, ExternalLink, Trash2, Check, Pencil, Bell } from 'lucide-react';
import type { Job, JobStatus } from '../types';

interface JobCardProps {
  job: Job;
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (job: Job) => void;
}

export function JobCard({ job, onUpdateStatus, onDelete, onEdit }: JobCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const statusColors: Record<JobStatus, string> = {
    Saved: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
    Applied: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    Interviewing: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    Rejected: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    Offer: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  };

  const getGoogleCalendarUrl = (job: Job) => {
    if (!job.interview_date) return '';
    
    const title = encodeURIComponent(`Interview: ${job.role} at ${job.company}`);
    const details = encodeURIComponent(`Job Application Details: ${job.link || 'N/A'}\nNotes: ${job.notes || ''}`);
    
    const datePart = job.interview_date.replace(/-/g, '');
    const timePart = (job.interview_time || '09:00').replace(/:/g, '') + '00';
    
    // Assume 1 hour interview
    const startDate = `${datePart}T${timePart}`;
    const endDate = `${datePart}T${String(Number(timePart.slice(0, 2)) + 1).padStart(2, '0')}${timePart.slice(2)}`;
    
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${startDate}/${endDate}`;
  };

  const statuses: JobStatus[] = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

  const toggleMenu = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left - 192 + rect.width + window.scrollX, // Align to the right of the button
      });
    }
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const dropdownMenu = isMenuOpen && createPortal(
    <div 
      ref={menuRef}
      className="absolute w-48 bg-surface border border-border rounded-2xl shadow-2xl z-[999] p-1.5 animate-in fade-in slide-in-from-top-2"
      style={{ top: menuPosition.top + 8, left: menuPosition.left }}
    >
      <p className="text-[10px] font-black text-secondary/40 px-3 py-2 uppercase tracking-[0.2em]">Change Status</p>
      <div className="space-y-0.5">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => {
              onUpdateStatus(job.id, s);
              setIsMenuOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2 text-[13px] font-bold rounded-xl transition-all ${
              job.status === s 
                ? 'bg-accent/5 text-accent' 
                : 'text-secondary hover:bg-secondary/5 hover:text-primary'
            }`}
          >
            {s}
            {job.status === s && <Check className="w-3.5 h-3.5" />}
          </button>
        ))}
      </div>
      <div className="h-px bg-border/60 my-1.5"></div>
      <button
        onClick={() => {
          onEdit(job);
          setIsMenuOpen(false);
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-bold text-secondary hover:bg-secondary/5 hover:text-primary rounded-xl transition-all"
      >
        <Pencil className="w-3.5 h-3.5" />
        Edit Details
      </button>
      <button
        onClick={() => {
          if (confirm('Are you sure you want to delete this job?')) {
            onDelete(job.id);
          }
          setIsMenuOpen(false);
        }}
        className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-bold text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </button>
    </div>,
    document.body
  );

  return (
    <div className="glass-card p-5 hover:border-accent/30 transition-all group cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex gap-4 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-2xl bg-gray-50 dark:bg-neutral-800/50 border border-border flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {job.logo_url ? (
              <img src={job.logo_url} alt={job.company} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-secondary/40">{job.company[0]}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-primary text-[15px] leading-tight mb-1 truncate" title={job.role}>{job.role}</h4>
            <p className="text-[13px] text-secondary font-semibold truncate" title={job.company}>{job.company}</p>
          </div>
        </div>
        
        <div className="relative shrink-0">
          <button 
            ref={triggerRef}
            onClick={toggleMenu}
            className={`p-1.5 rounded-lg transition-colors text-secondary hover:text-primary ${isMenuOpen ? 'bg-secondary/10 text-primary' : 'hover:bg-secondary/10'}`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {dropdownMenu}
        </div>
      </div>

      {job.description && (
        <p className="text-[13px] text-secondary line-clamp-2 mb-4 leading-relaxed font-medium">
          {job.description}
        </p>
      )}

      {job.status === 'Interviewing' && job.interview_date && (
        <div className="mb-4 p-3 bg-purple-500/5 border border-purple-500/20 rounded-xl flex items-center justify-between group/interview">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-purple-600/50 uppercase tracking-widest">Interview Scheduled</p>
              <p className="text-xs font-bold text-purple-700 dark:text-purple-300">
                {new Date(job.interview_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                {job.interview_time && ` at ${job.interview_time}`}
              </p>
            </div>
          </div>
          <a 
            href={getGoogleCalendarUrl(job)}
            target="_blank"
            rel="noopener noreferrer"
            title="Notify me on Gmail/Calendar"
            className="p-2 hover:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400 transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] font-bold">Remind Me</span>
          </a>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {job.salary_range && (
          <span className="px-2.5 py-1 bg-secondary/5 text-secondary text-[11px] font-bold rounded-lg border border-border">
            {job.salary_range}
          </span>
        )}
        <div className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border flex items-center gap-1.5 ${statusColors[job.status]}`}>
          {job.status}
        </div>
      </div>

      <div className="pt-4 border-t border-border/60 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1.5 text-secondary/80">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold uppercase tracking-wider">{new Date(job.applied_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        </div>
        
        <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          {job.link && (
            <a 
              href={job.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-accent/10 rounded-lg text-secondary hover:text-accent transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
