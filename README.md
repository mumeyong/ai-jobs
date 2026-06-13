# Modern Jobs Tracker

A fast, modern job tracking application built with React, TypeScript, and Supabase.

## Features
- **Modern UI:** Vibrant glassmorphism design with responsive layout.
- **Fast Tracking:** Quickly add, update, and delete job applications.
- **Real-time Stats:** Instant overview of your application progress.
- **Search & Filter:** Easily find jobs by company, role, or status.
- **Persistence:** Powered by Supabase for reliable data storage.

## Setup

1. **Clone and Install:**
   ```bash
   npm install
   ```

2. **Supabase Configuration:**
   - Create a new project on [Supabase](https://supabase.com/).
   - Copy your `Project URL` and `Anon Key`.
   - Create a `.env` file from `.env.example` and paste your credentials.

3. **Database Schema & Security:**
   Run the following SQL in the Supabase SQL Editor:
   ```sql
   -- Create the jobs table with a user_id column
   create table jobs (
     id uuid primary key default uuid_generate_v4(),
     user_id uuid references auth.users not null,
     company text not null,
     role text not null,
     status text default 'Applied',
     applied_date date default now(),
     link text,
     notes text,
     created_at timestamptz default now()
   );

   -- Enable Row Level Security
   alter table jobs enable row level security;

   -- Create policy to allow users to see only their own jobs
   create policy "Users can view their own jobs" 
   on jobs for select 
   using (auth.uid() = user_id);

   -- Create policy to allow users to insert their own jobs
   create policy "Users can insert their own jobs" 
   on jobs for insert 
   with check (auth.uid() = user_id);

   -- Create policy to allow users to update their own jobs
   create policy "Users can update their own jobs" 
   on jobs for update 
   using (auth.uid() = user_id);

   -- Create policy to allow users to delete their own jobs
   create policy "Users can delete their own jobs" 
   on jobs for delete 
   using (auth.uid() = user_id);
   ```

4. **Run the App:**
   ```bash
   npm run dev
   ```

## Deployment

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project root.
3. Follow the prompts to link your project.
4. Add your environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the Vercel Dashboard under **Settings > Environment Variables**.
5. Deploy: `vercel --prod`

### Option 2: GitHub Pages
1. Install the gh-pages package: `npm install gh-pages --save-dev`
2. Add `base: "/<repo-name>/"` to your `vite.config.ts`.
3. Add these scripts to `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. Run `npm run deploy`.
5. Add your environment variables in GitHub under **Settings > Secrets and variables > Actions**.
