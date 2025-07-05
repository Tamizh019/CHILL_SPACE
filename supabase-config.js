// Supabase Configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://umcmifajtomyvwjzmvpm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtY21pZmFqdG9teXZ3anptdnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzQzNTMsImV4cCI6MjA2NzMxMDM1M30._SjFGJOINRe0LTljlcK1h392iu5B5VJaAqK6sD3HJYI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Tables Structure
/*
Table: users
- id (uuid, primary key)
- email (text, unique)
- password_hash (text)
- created_at (timestamp)
- updated_at (timestamp)

Table: user_sessions
- id (uuid, primary key)
- user_id (uuid, foreign key)
- session_token (text)
- expires_at (timestamp)
- created_at (timestamp)
*/ 