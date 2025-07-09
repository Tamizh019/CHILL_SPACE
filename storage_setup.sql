-- Storage Bucket Setup for Supabase
-- Run this in your Supabase SQL Editor

-- 1. Create a storage bucket for files
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create storage policies for the files bucket
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'files' 
    AND auth.role() = 'authenticated'
);

-- Allow public to view files
CREATE POLICY "Allow public to view files"
ON storage.objects FOR SELECT
USING (bucket_id = 'files');

-- Allow authenticated users to update files
CREATE POLICY "Allow authenticated users to update files"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'files' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files
CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'files' 
    AND auth.role() = 'authenticated'
); 