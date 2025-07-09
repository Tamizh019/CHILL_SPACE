# StudySpace File Upload Setup Guide

## Problem
Your file upload functionality is not working because the required database tables and storage bucket don't exist in your Supabase project.

## Solution Steps

### 1. Set up Database Tables
Run the following SQL in your Supabase SQL Editor:

```sql
-- Run the contents of database_setup.sql in your Supabase SQL Editor
```

This will create:
- `files` table for storing file metadata
- `messages` table for chat functionality  
- `profiles` table for user profiles
- Proper Row Level Security (RLS) policies

### 2. Set up Storage Bucket
Run the following SQL in your Supabase SQL Editor:

```sql
-- Run the contents of storage_setup.sql in your Supabase SQL Editor
```

This will create:
- `files` storage bucket
- Storage policies for file uploads/downloads

### 3. Manual Storage Bucket Creation (Alternative)
If the SQL method doesn't work, manually create the storage bucket:

1. Go to your Supabase Dashboard
2. Navigate to Storage
3. Click "Create a new bucket"
4. Set bucket name: `files`
5. Make it public: ✅
6. Click "Create bucket"

### 4. Storage Policies (Manual Setup)
If you created the bucket manually, add these policies in the SQL Editor:

```sql
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
```

### 5. Test the Setup

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Try uploading a file
4. Check the console for detailed logs
5. Verify files appear in both:
   - Supabase Storage (Storage tab)
   - Database (Table Editor > files table)

### 6. Troubleshooting

#### If files still don't upload:
1. Check browser console for errors
2. Verify you're logged in
3. Check Supabase project URL and API key are correct
4. Ensure storage bucket exists and is public
5. Verify RLS policies are in place

#### Common Errors:
- **"Bucket not found"**: Create the storage bucket
- **"Permission denied"**: Check RLS policies
- **"User not authenticated"**: Make sure user is logged in
- **"Table doesn't exist"**: Run the database setup SQL

### 7. File Upload Flow

The updated code now:
1. Creates unique filenames with user ID prefix
2. Uploads files to Supabase Storage
3. Saves file metadata to database
4. Provides detailed error logging
5. Shows upload progress and results

### 8. Features Added

- ✅ Better error handling and logging
- ✅ File size display
- ✅ Unique file naming to prevent conflicts
- ✅ User-specific file organization
- ✅ Detailed console logging for debugging
- ✅ Progress feedback for users

## Next Steps

After completing this setup:
1. Test file uploads with different file types
2. Verify files can be downloaded
3. Check that chat functionality works
4. Test the study timer feature

If you encounter any issues, check the browser console for detailed error messages and refer to the troubleshooting section above. 