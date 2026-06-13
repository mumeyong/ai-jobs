export type JobStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Job {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  applied_date: string;
  link?: string;
  notes?: string;
  created_at: string;
}

export interface NewJob {
  company: string;
  role: string;
  status: JobStatus;
  applied_date: string;
  link?: string;
  notes?: string;
}
