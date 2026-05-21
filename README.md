# AG-Grid Views Management System

A robust, full-stack Next.js application that allows authenticated users to create, manage, and persist custom AG-Grid table configurations. Built with a focus on performance, strict type safety, and Server-Side Rendering (SSR).

## 🚀 Tech Stack
* **Framework:** Next.js 14 (App Router)
* **Database & Auth:** Supabase (PostgreSQL, Row Level Security)
* **Table UI:** AG-Grid Community
* **Architecture:** Feature-Sliced Design (FSD)
* **Styling:** Tailwind CSS (Minimalist, zero-background UI)

## 🧠 Key Architectural Highlights
* **True Server-Side Rendering (SSR):** Initial table data is fetched on the server and hydrated directly into the grid's state, resulting in zero Layout Shift and bypassing redundant client-side fetching.
* **Server-Side Data Operations:** All sorting and filtering are translated from AG-Grid state models into Supabase SQL queries (via custom API utilities) to ensure strict server-side processing.
* **Race-Condition Shield:** Implemented a custom synchronization hook (`isApplyingView` ref + microtasks) to perfectly sync AG-Grid's internal DOM mutations with React's state lifecycle, preventing memory leaks and stale state bugs during rapid view hydration.
* **Row Level Security (RLS):** Custom views are securely scoped to the authenticated `user_id`, while raw data tables remain public per ToR.

## 🛠 Getting Started

### 1. Database Setup (Fresh Supabase Project)
1. Create a new [Supabase](https://supabase.com) project.
2. Go to the SQL Editor in your Supabase Dashboard.
3. Copy the contents of `database-setup.sql` (located in the root of this repository) and run it. This will create the `orders`, `invoices`, and `grid_views` tables, insert the test JSON data, and configure the necessary RLS policies.

### 2. Environment Variables
Create a `.env.local` file in the root directory and add your Supabase keys:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 3. Installation & Run
\`\`\`bash
npm install
npm run dev
\`\`\`

### 🔐 Note on Testing Authentication
This application uses Supabase Auth with Email Confirmation enabled. 
* To test the Sign Up flow locally, you can either use a valid email address to receive the confirmation link, or find the confirmation link printed directly in the **Auth Logs** within your Supabase Dashboard.
* After confirmation, proceed to Sign In.