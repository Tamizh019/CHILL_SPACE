-- Check your current user role and fix admin assignment
-- Replace '732b4525-2db5-4468-8746-0cada9e81540' with your actual user ID

-- 1. Check your current role
SELECT 'Current user role:' as status;
SELECT 
    ur.user_id,
    p.username,
    p.email,
    r.name as role_name,
    r.display_name,
    r.color,
    r.emoji
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
LEFT JOIN profiles p ON ur.user_id = p.id
WHERE ur.user_id = '732b4525-2db5-4468-8746-0cada9e81540';

-- 2. Check if you have any role assigned
SELECT 'All your role assignments:' as status;
SELECT * FROM user_roles WHERE user_id = '732b4525-2db5-4468-8746-0cada9e81540';

-- 3. Get admin role ID
SELECT 'Admin role ID:' as status;
SELECT id, name, display_name FROM roles WHERE name = 'admin';

-- 4. Assign admin role if not already assigned
INSERT INTO user_roles (user_id, role_id)
SELECT '732b4525-2db5-4468-8746-0cada9e81540', id 
FROM roles 
WHERE name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- 5. Verify the assignment
SELECT 'After assignment - your roles:' as status;
SELECT 
    ur.user_id,
    p.username,
    p.email,
    r.name as role_name,
    r.display_name,
    r.color,
    r.emoji
FROM user_roles ur
JOIN roles r ON ur.role_id = r.id
LEFT JOIN profiles p ON ur.user_id = p.id
WHERE ur.user_id = '732b4525-2db5-4468-8746-0cada9e81540';

-- 6. Test the view
SELECT 'Testing user_role_details view:' as status;
SELECT * FROM user_role_details 
WHERE user_id = '732b4525-2db5-4468-8746-0cada9e81540'; 