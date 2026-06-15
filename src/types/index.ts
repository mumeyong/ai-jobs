export type JobStatus = 'Saved' | 'Applied' | 'Interviewing' | 'Rejected' | 'Offer';

export interface Job {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  applied_date: string;
  interview_date?: string;
  interview_time?: string;
  link?: string;
  notes?: string;
  salary_range?: string;
  description?: string;
  logo_url?: string;
  created_at: string;
}

export interface NewJob {
  company: string;
  role: string;
  status: JobStatus;
  applied_date: string;
  interview_date?: string;
  interview_time?: string;
  link?: string;
  notes?: string;
  salary_range?: string;
  description?: string;
  logo_url?: string;
}
