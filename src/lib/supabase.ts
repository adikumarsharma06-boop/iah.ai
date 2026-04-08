import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://poikqxvsbohbfgpuiveq.supabase.co'
const supabaseKey = 'sb_publishable_2d2LQYvMFpj3Yxb9ifJSPQ_u1zAhXW7'

export const supabaseClient = createClient(supabaseUrl, supabaseKey)

/*
  Supabase Table Schema for 'feedback':
  
  CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    type TEXT NOT NULL, -- 'bug' or 'suggestion'
    email TEXT,
    message TEXT NOT NULL,
    user_agent TEXT,
    is_public BOOLEAN DEFAULT false,
    user_name TEXT -- Optional name for public feedback
  );

  -- Enable RLS
  ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

  -- Allow public insertions
  CREATE POLICY "Allow public insertions" ON feedback FOR INSERT WITH CHECK (true);

  Supabase Table Schema for 'goals':
  
  CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'in-progress', 'completed'
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
    due_date DATE,
    user_id TEXT -- For future auth integration
  );

  -- Enable RLS
  ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

  -- Allow public access for now (demo mode)
  CREATE POLICY "Allow public access" ON goals FOR ALL USING (true);

  Supabase Table Schema for 'contact':
  
  CREATE TABLE contact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL
  );

  -- Enable RLS
  ALTER TABLE contact ENABLE ROW LEVEL SECURITY;

  -- Allow public insertions
  CREATE POLICY "Allow public insertions" ON contact FOR INSERT WITH CHECK (true);
*/

