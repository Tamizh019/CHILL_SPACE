-- Fix RLS policies to allow public SELECT access
-- This should resolve the API key issues

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view all user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view all roles" ON roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON roles;

-- Create permissive policies for user_roles
CREATE POLICY "Allow SELECT" ON user_roles FOR SELECT TO public USING (TRUE);
CREATE POLICY "Allow INSERT" ON user_roles FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Allow UPDATE" ON user_roles FOR UPDATE TO authenticated USING (TRUE);
CREATE POLICY "Allow DELETE" ON user_roles FOR DELETE TO authenticated USING (TRUE);

-- Create permissive policies for roles
CREATE POLICY "Allow SELECT" ON roles FOR SELECT TO public USING (TRUE);
CREATE POLICY "Allow INSERT" ON roles FOR INSERT TO authenticated WITH CHECK (TRUE);
CREATE POLICY "Allow UPDATE" ON roles FOR UPDATE TO authenticated USING (TRUE);
CREATE POLICY "Allow DELETE" ON roles FOR DELETE TO authenticated USING (TRUE);

-- Grant necessary permissions
GRANT SELECT ON user_roles TO public;
GRANT SELECT ON roles TO public;
GRANT SELECT ON user_role_details TO public;

-- Verify the policies
SELECT 'user_roles policies:' as status;
SELECT policyname, permissive, roles, cmd, qual FROM pg_policies 
WHERE tablename = 'user_roles';

SELECT 'roles policies:' as status;
SELECT policyname, permissive, roles, cmd, qual FROM pg_policies 
WHERE tablename = 'roles'; 