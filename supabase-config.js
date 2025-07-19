// Supabase Configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = ' X ' 
const supabaseAnonKey = ' X '

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
