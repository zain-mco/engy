# Eng - English Vocabulary Learning App 📚

A beautiful, soft pink-themed web application for organizing and learning English vocabulary with folders, translations, and American accent pronunciation.

## ✨ Features

- 🔐 **Authentication** - Secure email/password authentication with Supabase
- 📁 **Folder Management** - Organize vocabulary into custom folders
- 📝 **Word Management** - Add, edit, and delete words with translations
- 🔊 **Audio Pronunciation** - Listen to words in American English accent
- 🔍 **Search** - Quickly find words within folders
- 🎨 **Beautiful UI** - Soft pink aesthetic with smooth animations
- 📱 **Responsive** - Works perfectly on desktop and mobile
- 🚀 **SEO Optimized** - Comprehensive search engine optimization

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (Auth + Database)
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- A Supabase account and project

### Installation

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

3. Configure your environment variables in `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up your Supabase database with the required tables (see Database Schema below)

5. Start the development server:

```bash
npm run dev
```

## 🗄️ Database Schema

### Table: `users`
- `id` (uuid, primary key)
- `email` (text, unique)
- `created_at` (timestamp)

### Table: `folders`
- `id` (uuid, primary key)
- `user_id` (uuid, references users.id)
- `name` (text)
- `created_at` (timestamp)

### Table: `words`
- `id` (uuid, primary key)
- `folder_id` (uuid, references folders.id)
- `english_word` (text)
- `translation` (text)
- `created_at` (timestamp)

### SQL Setup

Run these commands in your Supabase SQL editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create folders table
create table folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create words table
create table words (
  id uuid default uuid_generate_v4() primary key,
  folder_id uuid references folders(id) on delete cascade not null,
  english_word text not null,
  translation text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table folders enable row level security;
alter table words enable row level security;

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
```

## 🎨 Color Theme

- Background: `#fff0f3`
- Primary: `#ffb6c1`
- Secondary: `#ffc0cb`
- Accent: `#ff69b4`
- Text: `#3d3d3d`

## 🔍 SEO Optimization

This application includes comprehensive SEO improvements:

### Meta Tags
- **Primary Meta Tags**: Title, description, keywords, author, robots
- **Open Graph**: Facebook sharing optimization
- **Twitter Cards**: Twitter sharing optimization
- **Canonical URLs**: Prevents duplicate content issues

### Technical SEO
- **Structured Data (JSON-LD)**: Helps search engines understand the app
- **Sitemap.xml**: Lists all important pages
- **Robots.txt**: Guides search engine crawling
- **Manifest.json**: PWA capabilities for better mobile experience

### Performance & Accessibility
- **Semantic HTML**: Proper heading hierarchy and ARIA labels
- **Font Preloading**: Faster loading times
- **Responsive Design**: Mobile-first approach
- **Theme Colors**: Consistent branding across devices

### Social Sharing
- Optimized meta tags for social media platforms
- Custom favicon and app icons
- PWA manifest for app-like experience

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 🎯 Usage

1. **Sign Up/Login** - Create an account or log in
2. **Create Folders** - Organize your vocabulary by topic
3. **Add Words** - Add English words with their translations
4. **Listen** - Click the speaker icon 🔊 to hear pronunciation
5. **Search** - Use the search bar to find specific words
6. **Manage** - Edit or delete folders and words as needed

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with 💗 by your friendly coding assistant

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- A Supabase account and project

### Installation

1. Clone or download this project
2. Install dependencies:

```bash
npm install
```

3. Configure your environment variables in `.env`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up your Supabase database with the required tables (see Database Schema below)

5. Start the development server:

```bash
npm run dev
```

## 🗄️ Database Schema

### Table: `users`
- `id` (uuid, primary key)
- `email` (text, unique)
- `created_at` (timestamp)

### Table: `folders`
- `id` (uuid, primary key)
- `user_id` (uuid, references users.id)
- `name` (text)
- `created_at` (timestamp)

### Table: `words`
- `id` (uuid, primary key)
- `folder_id` (uuid, references folders.id)
- `english_word` (text)
- `translation` (text)
- `created_at` (timestamp)

### SQL Setup

Run these commands in your Supabase SQL editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create folders table
create table folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create words table
create table words (
  id uuid default uuid_generate_v4() primary key,
  folder_id uuid references folders(id) on delete cascade not null,
  english_word text not null,
  translation text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table folders enable row level security;
alter table words enable row level security;

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
```

## 🎨 Color Theme

- Background: `#fff0f3`
- Primary: `#ffb6c1`
- Secondary: `#ffc0cb`
- Accent: `#ff69b4`
- Text: `#3d3d3d`

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 🎯 Usage

1. **Sign Up/Login** - Create an account or log in
2. **Create Folders** - Organize your vocabulary by topic
3. **Add Words** - Add English words with their translations
4. **Listen** - Click the speaker icon to hear pronunciation
5. **Search** - Use the search bar to find specific words
6. **Manage** - Edit or delete folders and words as needed

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Made with 💗 by your friendly coding assistant
