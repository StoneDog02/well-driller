# How to Find Your Google Place ID

## Method 1: Google Place ID Finder Tool (Easiest)

1. Go to: https://developers.google.com/maps/documentation/places/web-service/place-id
2. Search for "Stokes Water Well Drilling" or your business address
3. Click on your business from the results
4. Copy the Place ID that appears below your business name

## Method 2: From Google Maps URL

### Step-by-Step Process:

1. **Go to Google Maps**: https://maps.google.com
2. **Search for your business**: "Stokes Water Well Drilling"
3. **Click on your business listing** (the one with your correct address)
4. **Look at the URL** - it will look something like this:

```
https://www.google.com/maps/place/Stokes+Water+Well+Drilling/@40.123456,-111.789012,17z/data=!3m1!4b1!4m6!3m5!1s0x874d1234567890ab:0x1234567890abcdef!8m2!3d40.123456!4d-111.789012!16s%2Fg%2F11abcdef123456
```

### Finding the Place ID:

The Place ID is the long string after `!1s` and before `!8m2`:

- **Before**: `!1s`
- **Place ID**: `0x874d1234567890ab:0x1234567890abcdef`
- **After**: `!8m2`

### Example Breakdown:

```
https://www.google.com/maps/place/Stokes+Water+Well+Drilling/@40.123456,-111.789012,17z/data=!3m1!4b1!4m6!3m5!1s0x874d1234567890ab:0x1234567890abcdef!8m2!3d40.123456!4d-111.789012!16s%2Fg%2F11abcdef123456
                                                                                    ↑
                                                                              This is your Place ID
```

## Method 3: Chrome Extension (Alternative)

1. Install: [Place ID Finder for Google Maps](https://chromewebstore.google.com/detail/place-id-finder-for-googl/gdnnaahojechcmemagbbbbnoiieolafp)
2. Go to your business on Google Maps
3. Click the extension icon
4. Copy the Place ID

## Understanding the Hash Code

### What You're Seeing:
The hash code like `0x874d1234567890ab:0x1234567890abcdef` is called a **Feature ID** (FID) or **Customer ID** (CID).

### Important Distinction:
- **Feature ID/Customer ID**: `0x874d1234567890ab:0x1234567890abcdef` (what you see in URLs)
- **Place ID**: `ChIJN1t_tDeuEmsRUsoyG83frY4` (what we need for the API)

### For Our Integration:
We need the **Place ID**, not the Feature ID. The Google Places API uses Place IDs, which are shorter and look like: `ChIJN1t_tDeuEmsRUsoyG83frY4`

## Quick Test:

Once you have your Place ID, you can test it by visiting:
```
https://maps.googleapis.com/maps/api/place/details/json?place_id=YOUR_PLACE_ID_HERE&key=YOUR_API_KEY_HERE
```

This will return JSON data about your business, including reviews.

## Troubleshooting:

### If you can't find the Place ID in the URL:
1. Try the Google Place ID Finder tool (Method 1)
2. Make sure you're clicking on the correct business listing
3. Try searching with your exact business address

### If the URL looks different:
Google sometimes changes their URL format. If you see a different format, use Method 1 (the Google Place ID Finder tool) instead.

## Next Steps:

1. Find your Place ID using one of the methods above
2. Update `/app/routes/api.reviews.tsx` with your Place ID:
   ```typescript
   const STOKES_PLACE_ID = "your_actual_place_id_here";
   ```
3. Set up your Google Places API key
4. Test the integration!

## Example Place IDs:

Place IDs typically look like:
- `ChIJN1t_tDeuEmsRUsoyG83frY4`
- `ChIJd8BlQ2BZwokRAFQEcDlJRAI`
- `ChIJj8cGJhVZwokR6QeY0gD4nq8`

They are **NOT** the long hex strings you see in URLs!
