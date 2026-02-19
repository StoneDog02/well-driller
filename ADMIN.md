# Admin Panel Documentation

## Overview
The admin panel lets you view and manage form submissions from your website. You can also receive an automatic email notification for each new submission (optional; see **Email notifications** below).

## Accessing the Admin Panel

1. Navigate to `/admin` in your browser
2. Enter the password: `stokes2024`
3. You'll see all form submissions in a table format

## Features

### View Submissions
- See all contact form and callback form submissions
- View submission details including:
  - Name and contact information
  - Email and phone number
  - Subject and message content
  - Submission date and time
  - IP address (for security purposes)

### Manage Submissions
- **View Details**: Click "View" to see the full submission details in a modal
- **Delete**: Click "Delete" to remove a submission (with confirmation)
- **Contact**: Click on email addresses or phone numbers to contact customers directly

### Form Types
- **Contact**: Full contact form submissions from the Contact page
- **Callback**: Quick callback requests from the homepage

## Email notifications (optional)

When a user submits the **Request a Quote**, **Contact**, or **Callback** form, the submission is always saved to storage and shown in the admin panel. You can additionally have a copy sent to an email address you choose.

To enable admin notification emails:

1. **Get a Resend API key**
   - Sign up at [resend.com](https://resend.com) and create an API key in the dashboard.
   - For testing you can send from `onboarding@resend.dev`. For production, verify your own domain in Resend.

2. **Set environment variables** (in Netlify: Site settings → Environment variables; locally: `.env`):
   - **`ADMIN_NOTIFICATION_EMAIL`** – The email address that should receive each new submission (e.g. `admin@yourdomain.com`).
   - **`RESEND_API_KEY`** – Your Resend API key (e.g. `re_...`).

3. **Optional**
   - **`NOTIFICATION_FROM_EMAIL`** – Sender address and name (default: `Stokes Water Well <onboarding@resend.dev>`). Use a verified domain in production, e.g. `Stokes Water Well <notifications@yourdomain.com>`.

If these are not set, submissions still save and appear in the admin panel; only the email step is skipped. Email failures are logged but do not block or fail the form submission.

## Data Storage
- All submissions are stored in a JSON file at `data/submissions.json`
- No database required - simple file-based storage
- Data persists between server restarts

## Security Notes
- The admin panel is password-protected
- Consider changing the password in production
- The admin route is excluded from search engines (`noindex, nofollow`)
- IP addresses are logged for security purposes

## Future Enhancements
- Export submissions to CSV/Excel
- Search and filter functionality
- Response tracking
- Integration with CRM systems

## Password Management
To change the admin password, edit the password check in `app/routes/admin.tsx`:
```typescript
if (password !== 'your-new-password') {
  return json({ error: 'Unauthorized' }, { status: 401 });
}
```
