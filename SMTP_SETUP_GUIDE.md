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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Chill Space!</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            background: linear-gradient(135deg, #f39c12, #e67e22);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 10px;
        }
        .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #555;
            margin-bottom: 30px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #f39c12, #e67e22);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
            transition: all 0.3s ease;
            margin: 20px 0;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(243, 156, 18, 0.4);
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #888;
            font-size: 14px;
        }
        .emoji {
            font-size: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Chill Space</div>
            <div class="welcome-text">Welcome to the crew! 🚀</div>
        </div>
        
        <div class="message">
            <p>Hey there! <span class="emoji">👋</span></p>
            <p>Thanks for joining <strong>Chill Space</strong>! We're excited to have you as part of our awesome community.</p>
            <p>To get started and confirm your account, just click the button below:</p>
        </div>
        
        <div style="text-align: center;">
            <a href="{{ .ConfirmationURL }}" class="button">
                Confirm Your Email ✨
            </a>
        </div>
        
        <div class="message">
            <p><strong>What's next?</strong></p>
            <ul style="color: #555; line-height: 1.8;">
                <li>💬 Chat and share cool stuff</li>
                <li>📚 Study together in virtual spaces</li>
                <li>🎉 Create amazing memories</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>If you didn't create this account, no worries - just ignore this email! <span class="emoji">😅</span></p>
            <p>This link expires in 24 hours for your security.</p>
            <p style="margin-top: 20px;">
                <strong>Chill Space Team</strong><br>
                Making friends, one vibe at a time ✨<br>
                <span style="color:#f39c12;font-weight:600;">— Tamizh</span>
            </p>
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f8f9fa;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 520px;
      margin: 40px auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      padding: 40px 32px 32px 32px;
    }
    .header {
      text-align: center;
      margin-bottom: 28px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      background: linear-gradient(135deg, #f39c12, #e67e22);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 8px;
    }
    .title {
      font-size: 22px;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 10px;
    }
    .message {
      font-size: 16px;
      color: #555;
      margin-bottom: 28px;
      text-align: center;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #f39c12, #e67e22);
      color: #fff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(243,156,18,0.18);
      transition: all 0.3s ease;
      margin: 18px 0;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(243,156,18,0.28);
    }
    .footer {
      margin-top: 36px;
      padding-top: 18px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #888;
      font-size: 14px;
    }
    .emoji {
      font-size: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Chill Space</div>
      <div class="title">Reset Your Password</div>
    </div>
    <div class="message">
      <p>Hey there! <span class="emoji">👋</span></p>
      <p>We received a request to reset your password for your <strong>Chill Space</strong> account.</p>
      <p>Click the button below to set a new password and get back to chilling:</p>
    </div>
    <div style="text-align:center;">
      <a href="{{ .ConfirmationURL }}" class="button">Reset Password ✨</a>
    </div>
    <div class="message" style="margin-top: 24px;">
      <p>If you didn't request this, you can safely ignore this email. <span class="emoji">😅</span></p>
      <p>This link will expire in 24 hours for your security.</p>
    </div>
    <div class="footer">
      <p>
        Cheers,<br>
        <span style="color:#f39c12;font-weight:600;">— Tamizh</span><br>
        Chill Space Team
      </p>
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
