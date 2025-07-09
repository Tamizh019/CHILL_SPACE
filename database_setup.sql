-- Database Setup for Supabase Email Verification System
-- Run this in your Supabase SQL Editor

-- 1. Update users table to include email verification fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- 2. Create a function to sync user verification status
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.users (id, email, email_verified, verified_at)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.email_confirmed_at IS NOT NULL,
        NEW.email_confirmed_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create trigger to automatically sync auth.users to public.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. Create function to update verification status
CREATE OR REPLACE FUNCTION update_user_verification()
RETURNS trigger AS $$
BEGIN
    UPDATE public.users 
    SET 
        email_verified = (NEW.email_confirmed_at IS NOT NULL),
        verified_at = NEW.email_confirmed_at
    WHERE id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger to update verification status when email is confirmed
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION update_user_verification();

-- 6. Update existing users to be verified (if you want to grandfather existing users)
-- UPDATE users SET email_verified = TRUE, verified_at = NOW() WHERE email_verified IS NULL;

-- 7. Create a view for user verification status
CREATE OR REPLACE VIEW user_verification_status AS
SELECT 
    u.id,
    u.email,
    u.email_verified,
    u.verified_at,
    CASE 
        WHEN u.email_verified THEN 'Verified'
        ELSE 'Unverified'
    END as verification_status
FROM users u;

-- 8. Row Level Security (RLS) policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Allow insert for new users (handled by trigger)
CREATE POLICY "Allow insert for new users" ON users
    FOR INSERT WITH CHECK (true);

-- 9. Enable Supabase Auth (if not already enabled)
-- This is typically done in the Supabase Dashboard under Authentication > Settings

-- 10. Configure email templates in Supabase Dashboard:
-- Go to Authentication > Templates
-- Customize the "Confirm signup" template with your branding

-- 11. Sample data for testing (optional - remove in production)
-- INSERT INTO users (id, email, password_hash, email_verified, verified_at) 
-- VALUES ('test-user-id', 'test@example.com', 'hashed_password_here', TRUE, NOW());

-- 12. Create a function to get user verification status
CREATE OR REPLACE FUNCTION get_user_verification_status(user_email TEXT)
RETURNS TABLE (
    email TEXT,
    verified BOOLEAN,
    verified_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.email,
        u.email_verified,
        u.verified_at
    FROM users u
    WHERE u.email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create files table for file uploads
CREATE TABLE IF NOT EXISTS public.files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    filetype TEXT,
    filepath TEXT NOT NULL,
    filesize BIGINT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for files table
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Create policies for files table
CREATE POLICY "Users can view all files" 
    ON public.files 
    FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own files" 
    ON public.files 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files" 
    ON public.files 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- 14. Create messages table for chat functionality
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages table
CREATE POLICY "Users can view all messages" 
    ON public.messages 
    FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own messages" 
    ON public.messages 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 15. Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view all profiles" 
    ON public.profiles 
    FOR SELECT 
    USING (true);

CREATE POLICY "Users can update their own profile" 
    ON public.profiles 
    FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 16. Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 17. Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile(); 