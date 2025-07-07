# Supabase Email Verification System Setup Guide

## 🚀 Overview
This guide will help you set up a complete email verification system using Supabase's built-in authentication. Users will receive a verification email during registration and must click the link to verify their account before they can log in.

## 📋 Prerequisites
- Supabase project set up
- Basic knowledge of SQL
- Supabase Auth enabled

## 🔧 Step 1: Supabase Dashboard Configuration

### 1.1 Enable Email Confirmations
1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Settings > Email**
3. Turn ON **"Enable email confirmations"**
4. Save the settings

### 1.2 Configure Email Templates
1. Go to **Authentication > Templates**
2. Click on **"Confirm signup"** template
3. Customize the email template with your branding:

```html
<h2>Welcome to Sathyabama ERP!</h2>
<p>Please confirm your email address by clicking the button below:</p>
<a href="{{ .ConfirmationURL }}" style="background: #f39c12; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
    Confirm Email Address
</a>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

### 1.3 Set Site URL
1. Go to **Authentication > Settings > General**
2. Set your **Site URL** (e.g., `https://yourdomain.com`)
3. Add your domain to **Redirect URLs** if needed

## 🗄️ Step 2: Database Setup

### 2.1 Run Database Script
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database_setup.sql`
4. Click **Run** to execute the script

This will create:
- Email verification columns in the `users` table
- Triggers to sync Supabase Auth with your users table
- Row Level Security policies
- Helper functions for verification status

### 2.2 Verify Setup
Check that these are created:
- `users` table with `email_verified` and `verified_at` columns
- Triggers on `auth.users` table
- RLS policies on `users` table

## 📧 Step 3: Email Service Configuration

### 3.1 Default Email Provider
Supabase uses a default email provider that should work out of the box for testing.

### 3.2 Custom Email Provider (Optional)
For production, you can configure a custom SMTP provider:

1. Go to **Authentication > Settings > Email**
2. Under **SMTP Settings**, configure:
   - **Host**: Your SMTP server
   - **Port**: SMTP port (usually 587 or 465)
   - **Username**: Your email username
   - **Password**: Your email password
   - **Sender Name**: Your app name
   - **Sender Email**: Your verified email address

### 3.3 Popular Email Providers
- **SendGrid**: Free tier available
- **AWS SES**: Very cost-effective
- **Gmail**: For testing (requires app password)
- **Mailgun**: Developer-friendly

## 🔐 Step 4: Security Configuration

### 4.1 Password Policy
1. Go to **Authentication > Settings > Auth**
2. Configure password requirements:
   - Minimum length: 6 characters
   - Require uppercase letters: Optional
   - Require lowercase letters: Optional
   - Require numbers: Optional
   - Require special characters: Optional

### 4.2 Session Management
1. Set **JWT Expiry**: 3600 (1 hour)
2. Set **Refresh Token Rotation**: Enabled
3. Set **Refresh Token Reuse Interval**: 10 seconds

### 4.3 Rate Limiting
Supabase provides built-in rate limiting:
- Email confirmations: 1 per minute per email
- Sign-in attempts: 5 per minute per IP
- Password resets: 1 per minute per email

## 🧪 Step 5: Testing the System

### 5.1 Test Registration Flow
1. Open `register.html`
2. Enter email and password
3. Click "Send Verification Email"
4. Check your email for verification link
5. Click the verification link
6. Verify successful registration

### 5.2 Test Login Flow
1. Open `index.html`
2. Try logging in with unverified email (should be blocked)
3. Verify email and try again (should work)

### 5.3 Test Email Templates
1. Go to **Authentication > Templates**
2. Click **"Test"** on the Confirm signup template
3. Enter your email address
4. Check if the test email is received

## 📱 Step 6: User Experience Features

### 6.1 Email Verification Flow
- **Step 1**: User enters email and password
- **Step 2**: Verification email is sent
- **Step 3**: User clicks verification link
- **Step 4**: Account is automatically verified
- **Step 5**: User can now log in

### 6.2 Progress Indicators
- Step indicators (1/2, 2/2)
- Loading states during API calls
- Success/error messages
- Resend email functionality with cooldown

### 6.3 Mobile Responsive
- Responsive design for all screen sizes
- Touch-friendly buttons
- Readable email templates

## 🚀 Step 7: Production Deployment

### 7.1 Environment Variables
Ensure your Supabase configuration is secure:
```javascript
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
```

### 7.2 Custom Domain
1. Configure your custom domain in Supabase
2. Update Site URL and Redirect URLs
3. Set up DNS records as required

### 7.3 SSL Certificate
Ensure your domain has a valid SSL certificate for secure email links.

## 🔧 Step 8: Customization

### 8.1 Email Template Customization
Customize the email template in Supabase Dashboard:
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #f39c12; color: white; padding: 20px; text-align: center;">
        <h1>Sathyabama ERP</h1>
    </div>
    <div style="padding: 20px;">
        <h2>Welcome to Sathyabama ERP!</h2>
        <p>Thank you for registering. Please confirm your email address to complete your registration.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ .ConfirmationURL }}" style="background: #f39c12; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Confirm Email Address
            </a>
        </div>
        <p>If you didn't create an account with Sathyabama ERP, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
    </div>
    <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #666;">
        <p>&copy; 2024 Sathyabama ERP. All rights reserved.</p>
    </div>
</div>
```

### 8.2 Redirect URL Configuration
Configure where users are redirected after email verification:
```javascript
const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
        emailRedirectTo: 'https://yourdomain.com/login-success.html'
    }
});
```

### 8.3 Custom Error Messages
Handle different error scenarios:
```javascript
if (error.message.includes('already registered')) {
    showMessage('Email already registered. Please log in instead.', 'error');
} else if (error.message.includes('rate limit')) {
    showMessage('Too many attempts. Please wait a moment.', 'error');
} else {
    showMessage('Failed to send verification email: ' + error.message, 'error');
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Email not sending**
   - Check Supabase Auth settings
   - Verify email provider configuration
   - Check browser console for errors
   - Ensure Site URL is configured correctly

2. **Verification link not working**
   - Check Redirect URLs in Supabase settings
   - Verify SSL certificate
   - Check email template configuration

3. **Login blocked for verified users**
   - Check database triggers are working
   - Verify `email_verified` column value
   - Check RLS policies

4. **Rate limiting issues**
   - Wait for rate limit to reset
   - Check Supabase rate limiting settings
   - Implement proper error handling

### Debug Mode
Enable debug logging:
```javascript
console.log('Auth response:', data);
console.log('User session:', session);
console.log('Verification status:', user.email_confirmed_at);
```

### Check Database Triggers
Verify triggers are working:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name IN ('on_auth_user_created', 'on_auth_user_updated');
```

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions for Custom Logic](https://supabase.com/docs/guides/functions)

## 🎯 Next Steps

1. **Test the complete flow** with real email addresses
2. **Customize email templates** with your branding
3. **Configure custom SMTP** for production
4. **Set up monitoring** for email delivery rates
5. **Implement password reset** functionality
6. **Add social login** options if needed

## 🔒 Security Best Practices

1. **Always verify email** before allowing login
2. **Use HTTPS** for all redirect URLs
3. **Implement proper error handling**
4. **Monitor failed authentication attempts**
5. **Regular security audits**
6. **Keep Supabase SDK updated**

---

**Note**: This implementation uses Supabase's built-in authentication system, which is production-ready and follows security best practices. The email verification is handled automatically by Supabase, making it more secure and reliable than custom implementations. 