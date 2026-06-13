import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Job } from '../types';

interface CalendarViewProps {
  jobs: Job[];
}

export function CalendarView({ jobs }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  // Padding for previous month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="px-6 pb-8 animate-in fade-in duration-500">
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-lg text-primary">{monthName} {year}</h3>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-background rounded-xl transition-colors border border-border">
              <ChevronLeft className="w-5 h-5 text-secondary" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-xs font-bold text-secondary hover:text-primary transition-colors border border-border rounded-xl">
              Today
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-background rounded-xl transition-colors border border-border">
              <ChevronRight className="w-5 h-5 text-secondary" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border bg-gray-50/50 dark:bg-neutral-900/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-[10px] font-bold text-secondary uppercase tracking-widest border-r border-border last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-5 min-h-[600px]">
          {days.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} className="border-r border-b border-border bg-gray-50/20 dark:bg-neutral-900/10"></div>;

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayJobs = jobs.filter(j => j.applied_date.startsWith(dateStr));

            return (
              <div key={day} className="border-r border-b border-border p-2 group hover:bg-gray-50/50 dark:hover:bg-neutral-900/50 transition-colors">
                <span className="text-xs font-bold text-secondary mb-2 block">{day}</span>
                <div className="space-y-1">
                  {dayJobs.map(job => (
                    <div 
                      key={job.id} 
                      className="px-2 py-1 bg-primary text-background rounded-lg text-[9px] font-bold truncate cursor-pointer hover:opacity-90 transition-opacity"
                      title={`${job.company} - ${job.role}`}
                    >
                      {job.company}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
