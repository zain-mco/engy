-- Eng Vocabulary App - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create folders table
create table if not exists folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create words table
create table if not exists words (
  id uuid default uuid_generate_v4() primary key,
  folder_id uuid references folders(id) on delete cascade not null,
  english_word text not null,
  translation text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table folders enable row level security;
alter table words enable row level security;

-- Drop existing policies if they exist (to avoid errors on re-run)
drop policy if exists "Users can view their own folders" on folders;
drop policy if exists "Users can insert their own folders" on folders;
drop policy if exists "Users can update their own folders" on folders;
drop policy if exists "Users can delete their own folders" on folders;
drop policy if exists "Users can view words in their folders" on words;
drop policy if exists "Users can insert words in their folders" on words;
drop policy if exists "Users can update words in their folders" on words;
drop policy if exists "Users can delete words in their folders" on words;

-- Create policies for folders
create policy "Users can view their own folders"
  on folders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own folders"
  on folders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own folders"
  on folders for update
  using (auth.uid() = user_id);

create policy "Users can delete their own folders"
  on folders for delete
  using (auth.uid() = user_id);

-- Create policies for words
create policy "Users can view words in their folders"
  on words for select
  using (
    exists (
      select 1 from folders
      where folders.id = words.folder_id
      and folders.user_id = auth.uid()
    )
  );

create policy "Users can insert words in their folders"
  on words for insert
  with check (
    exists (
      select 1 from folders
      where folders.id = words.folder_id
      and folders.user_id = auth.uid()
    )
  );

create policy "Users can update words in their folders"
  on words for update
  using (
    exists (
      select 1 from folders
      where folders.id = words.folder_id
      and folders.user_id = auth.uid()
    )
  );

create policy "Users can delete words in their folders"
  on words for delete
  using (
    exists (
      select 1 from folders
      where folders.id = words.folder_id
      and folders.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
create index if not exists folders_user_id_idx on folders(user_id);
create index if not exists words_folder_id_idx on words(folder_id);
