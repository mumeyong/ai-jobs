import { Plus, MoreHorizontal, Briefcase } from 'lucide-react';
import type { Job, JobStatus } from '../types';
import { JobCard } from './JobCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';

interface KanbanBoardProps {
  jobs: Job[];
  onUpdateStatus: (id: string, status: JobStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (job: Job) => void;
  onAddClick: (status: JobStatus) => void;
}

const COLUMNS: { label: string; status: JobStatus }[] = [
  { label: 'Saved', status: 'Saved' },
  { label: 'Applied', status: 'Applied' },
  { label: 'Interviews', status: 'Interviewing' },
  { label: 'Offered', status: 'Offer' },
  { label: 'Rejected', status: 'Rejected' },
];

export function KanbanBoard({ jobs, onUpdateStatus, onDelete, onEdit, onAddClick }: KanbanBoardProps) {
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // The droppableId is the status
    onUpdateStatus(draggableId, destination.droppableId as JobStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 md:gap-8 overflow-x-auto pb-10 min-h-[calc(100vh-280px)] px-4 md:px-8 snap-x snap-mandatory scroll-smooth">
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
              
              <Droppable droppableId={column.status}>
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex flex-col gap-4 min-h-[150px] transition-colors rounded-[24px] ${snapshot.isDraggingOver ? 'bg-secondary/5' : ''}`}
                  >
                    {columnJobs.map((job, index) => (
                      <Draggable key={job.id} draggableId={job.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? 'z-50' : ''}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.9 : 1,
                            }}
                          >
                            <JobCard 
                              job={job} 
                              onUpdateStatus={onUpdateStatus} 
                              onDelete={onDelete} 
                              onEdit={onEdit}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {columnJobs.length === 0 && !snapshot.isDraggingOver && (
                      <div className="h-32 border-2 border-dashed border-border/60 rounded-[24px] flex flex-col items-center justify-center bg-secondary/5 gap-2 group hover:bg-secondary/10 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-secondary/30">
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <p className="text-[11px] font-bold text-secondary/40 uppercase tracking-widest">No applications</p>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => onAddClick(column.status)}
                      className="w-full py-4 rounded-[20px] border-2 border-dashed border-border hover:border-accent/30 hover:bg-accent/5 text-secondary/60 hover:text-accent transition-all text-[13px] font-bold flex items-center justify-center gap-2.5 mt-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Add to {column.label}
                    </button>
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
