# SMTP Setup Guide for Chill Space

## Why Custom SMTP?
- **Supabase Default**: 50,000 emails/month (free tier)
- **Rate Limits**: Can cause delays or failures
- **Custom SMTP**: Better control and higher limits

## Gmail SMTP Setup:

### 1. Enable 2-Factor Authentication
- Go to Google Account settings
- Enable 2-Step Verification

### 2. Generate App Password
- Go to Security settings
- Find "App passwords"
- Generate password for "Mail"
- Save this password (16 characters)

### 3. Supabase Configuration
In your Supabase Dashboard:

**Authentication > Settings > SMTP Settings**

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: your-email@gmail.com
SMTP Pass: [Your 16-character app password]
SMTP Sender Name: Chill Space
SMTP Sender Email: your-email@gmail.com
```

### 4. Email Templates
Go to **Authentication > Email Templates** and paste your custom templates:

#### Confirmation Email Template:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome to Chill Space!</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .container { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #f39c12, #e67e22); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .button { display: inline-block; background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div style="text-align: center; margin-bottom: 30px;">
            <div class="logo">Chill Space</div>
            <h2>Welcome to the crew! 🚀</h2>
        </div>
        <p>Hey there! 👋</p>
        <p>Thanks for joining <strong>Chill Space</strong>! We're excited to have you as part of our awesome community.</p>
        <p>Click the button below to confirm your email:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ .ConfirmationURL }}" class="button">Confirm Your Email ✨</a>
        </div>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888;">
            <p>Cheers,<br><strong>Tamizh</strong><br>Chill Space Team</p>
        </div>
    </div>
</body>
</html>
```

#### Reset Password Template:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Your Password | Chill Space</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
        .container { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .logo { font-size: 28px; font-weight: bold; background: linear-gradient(135deg, #f39c12, #e67e22); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .button { display: inline-block; background: linear-gradient(135deg, #f39c12, #e67e22); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div style="text-align: center; margin-bottom: 30px;">
            <div class="logo">Chill Space</div>
            <h2>Reset Your Password</h2>
        </div>
        <p>Hey there! 👋</p>
        <p>We received a request to reset your password for your <strong>Chill Space</strong> account.</p>
        <p>Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ .ConfirmationURL }}" class="button">Reset Password ✨</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email. 😅</p>
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888;">
            <p>Cheers,<br><strong>Tamizh</strong><br>Chill Space Team</p>
        </div>
    </div>
</body>
</html>
```

## Alternative Email Services:

### **SendGrid (Recommended for Production):**
- 100 emails/day free
- Better deliverability
- Professional dashboard

### **Mailgun:**
- 5,000 emails/month free
- Good for developers

### **Resend:**
- 3,000 emails/month free
- Modern API

## Testing:
1. Try registering a new account
2. Check if confirmation email arrives
3. Test password reset functionality
4. Monitor Supabase logs for errors

## Troubleshooting:
- **No emails**: Check SMTP settings
- **Rate limits**: Upgrade plan or use custom SMTP
- **Spam folder**: Check email templates
- **Authentication errors**: Verify app password 