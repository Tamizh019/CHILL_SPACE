-- Fix Storage Policies for Supabase
-- Run this in your Supabase SQL Editor to fix the upload issue

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete files" ON storage.objects;

-- Create new, simplified policies
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'files' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public to view files"
ON storage.objects FOR SELECT
USING (bucket_id = 'files');

CREATE POLICY "Allow authenticated users to update files"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'files' 
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'files' 
    AND auth.role() = 'authenticated'
); 