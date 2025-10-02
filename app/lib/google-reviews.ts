// Google Reviews API integration
// This service fetches reviews from Google Places API

export interface GoogleReview {
  author_name: string;
  author_url?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: GoogleReview[];
  formatted_address: string;
}

export interface ReviewsResponse {
  success: boolean;
  reviews?: GoogleReview[];
  error?: string;
  placeDetails?: GooglePlaceDetails;
}

// Cache for reviews to avoid excessive API calls
const reviewsCache = new Map<string, { data: ReviewsResponse; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchGoogleReviews(
  placeId: string,
  apiKey: string
): Promise<ReviewsResponse> {
  // Check cache first
  const cached = reviewsCache.get(placeId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Fetch place details including reviews
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,rating,user_ratings_total,reviews,formatted_address&key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    const result = data.result;
    const reviewsResponse: ReviewsResponse = {
      success: true,
      reviews: result.reviews || [],
      placeDetails: {
        place_id: result.place_id,
        name: result.name,
        rating: result.rating,
        user_ratings_total: result.user_ratings_total,
        reviews: result.reviews || [],
        formatted_address: result.formatted_address,
      },
    };

    // Cache the result
    reviewsCache.set(placeId, {
      data: reviewsResponse,
      timestamp: Date.now(),
    });

    return reviewsResponse;
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// Helper function to format review text (truncate if too long)
export function formatReviewText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
}

// Helper function to get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Helper function to format date
export function formatReviewDate(time: number): string {
  const date = new Date(time * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
