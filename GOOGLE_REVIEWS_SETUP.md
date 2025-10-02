# Google Reviews Integration Setup Guide

This guide will help you set up real Google reviews integration for your website.

## Prerequisites

1. A Google Cloud Platform account
2. Your business listed on Google My Business
3. Access to your Google Business Profile

## Step 1: Get Your Google Place ID

1. Go to [Google Maps](https://maps.google.com)
2. Search for your business: "Stokes Water Well Drilling"
3. Click on your business listing
4. Look at the URL - it will contain your place ID
   - Example: `https://maps.google.com/maps/place/Stokes+Water+Well+Drilling/@40.123456,-111.789012,17z/data=!3m1!4b1!4m6!3m5!1s0x874d1234567890ab:0x1234567890abcdef!8m2!3d40.123456!4d-111.789012!16s%2Fg%2F11abcdef123456`
   - The place ID is the long string after `!1s` and before `!8m2`
   - In this example: `0x874d1234567890ab:0x1234567890abcdef`

## Step 2: Create Google Cloud Project and Enable Places API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Places API:
   - Go to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click on "Places API" and click "Enable"

## Step 3: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. (Optional but recommended) Restrict the API key:
   - Click on the API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain: `yourdomain.com/*`
   - Under "API restrictions", select "Restrict key" and choose "Places API"

## Step 4: Configure Your Application

1. Add your API key to your environment variables:
   ```bash
   # Add to your .env file
   GOOGLE_PLACES_API_KEY=your_api_key_here
   ```

2. Update the place ID in `/app/routes/api.reviews.tsx`:
   ```typescript
   const STOKES_PLACE_ID = "your_actual_place_id_here";
   ```

## Step 5: Test the Integration

1. Start your development server
2. Visit your homepage
3. Check the browser console for any errors
4. The reviews section should now display real Google reviews

## Troubleshooting

### Common Issues:

1. **"API key not configured" error**
   - Make sure `GOOGLE_PLACES_API_KEY` is set in your environment variables
   - Restart your development server after adding the environment variable

2. **"Place ID not configured" error**
   - Make sure you've updated `STOKES_PLACE_ID` in `/app/routes/api.reviews.tsx`
   - Verify the place ID is correct by checking the Google Maps URL

3. **"Google Places API error"**
   - Check that the Places API is enabled in your Google Cloud project
   - Verify your API key has the correct permissions
   - Check your API key restrictions

4. **Reviews not showing**
   - The API only returns up to 5 reviews
   - If you have fewer than 3 reviews, it will show fallback reviews
   - Check the browser network tab to see if the API call is successful

### API Limits:

- Google Places API has usage limits
- Free tier: $200 credit per month (approximately 40,000 requests)
- Each review fetch counts as 1 request
- Reviews are cached for 24 hours to minimize API calls

## Cost Considerations

- Google Places API charges per request
- Each review fetch costs approximately $0.005
- With caching, you'll make ~30 requests per month
- Total cost: ~$0.15 per month

## Security Notes

- Never commit your API key to version control
- Use environment variables for all sensitive data
- Consider restricting your API key to specific domains
- Monitor your API usage in Google Cloud Console

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key and place ID are correct
3. Check Google Cloud Console for API usage and errors
4. Ensure your business is properly verified on Google My Business
