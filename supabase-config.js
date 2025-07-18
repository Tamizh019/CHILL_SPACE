// Supabase Configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cmriyjrqkvpdchvbpnne.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcml5anJxa3ZwZGNodmJwbm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzcyODYsImV4cCI6MjA2ODQxMzI4Nn0.wWRO5jZuUfrMPV8A3J7j36yweLe4o-uIcSZYaMhY4O8'

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