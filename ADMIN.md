# Admin Panel Documentation

## Overview
The admin panel allows you to view and manage form submissions from your website without relying on email notifications.

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
- Email notifications for new submissions
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
