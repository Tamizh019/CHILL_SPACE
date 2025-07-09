-- Create profiles for existing users
-- Run this in your Supabase SQL Editor

-- Insert profiles for existing auth.users that don't have profiles yet
INSERT INTO public.profiles (id, email, username)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data ->> 'username', split_part(au.email, '@', 1))
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING; 