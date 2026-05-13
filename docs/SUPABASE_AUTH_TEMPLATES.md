# Supabase Auth Email Templates Guide

Supabase sends transactional emails for authentication events. You can customize these to match your brand.

## Where to Edit

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**

## Available Templates

| Template | When It's Sent |
|----------|---------------|
| **Confirm signup** | After a user registers (email verification) |
| **Invite user** | When you invite a user via the dashboard or API |
| **Magic Link** | When a user requests a passwordless login |
| **Change Email Address** | When a user changes their email |
| **Reset Password** | When a user requests a password reset |

## Template Variables

Use these variables in your templates (Supabase replaces them automatically):

| Variable | Description |
|----------|-------------|
| `{{ .ConfirmationURL }}` | The full URL the user clicks to confirm |
| `{{ .Token }}` | The raw OTP token (if using token-based confirmation) |
| `{{ .TokenHash }}` | Hashed version of the token |
| `{{ .SiteURL }}` | Your configured site URL |
| `{{ .RedirectTo }}` | The redirect URL after confirmation |

## Example: Branded Signup Confirmation

```html
<html>
<head>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0f1114; color: #e5e7eb; padding: 40px; }
    .container { max-width: 500px; margin: 0 auto; background: #1a1d23; border: 1px solid #32363f; border-radius: 12px; padding: 40px; }
    h1 { color: #f3f4f6; font-size: 24px; margin-bottom: 8px; }
    .subtitle { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
    .btn { display: inline-block; background: #6b8a3e; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .footer { margin-top: 32px; font-size: 12px; color: #4b5563; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚔ Welcome to Roster Maker</h1>
    <p class="subtitle">Confirm your email to start building rosters.</p>
    <p style="color: #9ca3af; font-size: 14px; margin-bottom: 24px;">
      Click the button below to verify your email address and activate your account.
    </p>
    <a href="{{ .ConfirmationURL }}" class="btn">Confirm Email</a>
    <div class="footer">
      <p>If you didn't create this account, you can safely ignore this email.</p>
      <p>— Roster Maker</p>
    </div>
  </div>
</body>
</html>
```

## Example: Password Reset

```html
<html>
<head>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0f1114; color: #e5e7eb; padding: 40px; }
    .container { max-width: 500px; margin: 0 auto; background: #1a1d23; border: 1px solid #32363f; border-radius: 12px; padding: 40px; }
    h1 { color: #f3f4f6; font-size: 24px; margin-bottom: 16px; }
    .btn { display: inline-block; background: #6b8a3e; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .footer { margin-top: 32px; font-size: 12px; color: #4b5563; }
    .warning { color: #f59e0b; font-size: 13px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚔ Reset Your Password</h1>
    <p style="color: #9ca3af; font-size: 14px; margin-bottom: 24px;">
      Someone requested a password reset for your Roster Maker account.
      If this was you, click below:
    </p>
    <a href="{{ .ConfirmationURL }}" class="btn">Reset Password</a>
    <p class="warning">This link expires in 24 hours.</p>
    <div class="footer">
      <p>If you didn't request this, ignore this email. Your password won't change.</p>
    </div>
  </div>
</body>
</html>
```

## Example: Magic Link (Passwordless Login)

```html
<html>
<head>
  <style>
    body { font-family: -apple-system, sans-serif; background: #0f1114; color: #e5e7eb; padding: 40px; }
    .container { max-width: 500px; margin: 0 auto; background: #1a1d23; border: 1px solid #32363f; border-radius: 12px; padding: 40px; }
    h1 { color: #f3f4f6; font-size: 24px; margin-bottom: 16px; }
    .btn { display: inline-block; background: #6b8a3e; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .footer { margin-top: 32px; font-size: 12px; color: #4b5563; }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚔ Your Login Link</h1>
    <p style="color: #9ca3af; font-size: 14px; margin-bottom: 24px;">
      Click below to sign in to Roster Maker. No password needed.
    </p>
    <a href="{{ .ConfirmationURL }}" class="btn">Sign In</a>
    <div class="footer">
      <p>This link expires in 5 minutes and can only be used once.</p>
    </div>
  </div>
</body>
</html>
```

## Configuration Tips

### Site URL
Set your site URL in **Authentication** → **URL Configuration**:
- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** Add `https://your-app.vercel.app/**` to allow all paths

### Rate Limits
Default email rate limits (configurable under Auth settings):
- Max emails per hour: 30
- Signup confirmations: 1 per email per 60 seconds

### Disable Email Confirmation (Development Only)
For faster development, you can disable email confirmation:
1. Go to **Authentication** → **Providers** → **Email**
2. Toggle off "Confirm email"
3. ⚠️ **Re-enable this before going to production!**

## Testing Emails Locally

Supabase uses [Inbucket](https://inbucket.org/) for local development with `supabase start`. Emails are captured at `http://localhost:54324`.

For the hosted project, emails go to real inboxes. Check spam folders during development.
