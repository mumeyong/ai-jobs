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

3. **Database Schema:**
   Run the following SQL in the Supabase SQL Editor:
   ```sql
   create table jobs (
     id uuid primary key default uuid_generate_v4(),
     company text not null,
     role text not null,
     status text default 'Applied',
     applied_date date default now(),
     link text,
     notes text,
     created_at timestamptz default now()
   );

   -- IMPORTANT: For the app to work without authentication, 
   -- you must either disable Row Level Security (RLS) 
   -- or create a policy that allows all users to Read/Write.
   -- To disable RLS (easiest for personal projects):
   alter table jobs disable row level security;
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
