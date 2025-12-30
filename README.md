# Task Management System

A full-stack Task Management System built with Next.js, Express.js, and Supabase.

## Features

- **User Authentication**: Sign up and Login using Supabase Auth.
- **Task Management**: Create, Read, Update, and Delete (CRUD) tasks.
- **Security**: Row Level Security (RLS) ensures users can only access their own tasks.
- **Validation**: Input validation on the backend to prevent invalid data.
- **Responsive UI**: Built with Tailwind CSS for a modern look.

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, TypeScript
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Supabase (PostgreSQL)

## Setup Instructions

### Prerequisites

- Node.js installed.
- A Supabase project.

### 1. Database Setup (Supabase)

Run the following SQL in your Supabase SQL Editor to create the table and policies:

```sql
-- Create tasks table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  status text check (status in ('Pending', 'Completed')) default 'Pending',
  user_id uuid references auth.users not null default auth.uid()
);

-- Enable RLS
alter table tasks enable row level security;

-- Create Policy: Users can only see their own tasks
create policy "Users can view their own tasks"
on tasks for select
using ( auth.uid() = user_id );

-- Create Policy: Users can insert their own tasks
create policy "Users can insert their own tasks"
on tasks for insert
with check ( auth.uid() = user_id );

-- Create Policy: Users can update their own tasks
create policy "Users can update their own tasks"
on tasks for update
using ( auth.uid() = user_id );

-- Create Policy: Users can delete their own tasks
create policy "Users can delete their own tasks"
on tasks for delete
using ( auth.uid() = user_id );
```

### 2. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in `backend/` with your Supabase credentials:
    ```env
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    PORT=5000
    ```
    *Note: Since we are using RLS with the user's token, the Anon Key is sufficient.*

4.  Start the server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in `frontend/` with your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.
