import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { fetchGoogleReviews } from "~/lib/google-reviews";

// Your Google Business Profile Place ID
// You can find this by searching for your business on Google Maps and extracting the place_id from the URL
const STOKES_PLACE_ID = "ChIJuwyAI5WZVIcRg2W7nKJOyX4"; // Stokes Water Well Drilling Place ID

// Your Google Places API key
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function loader({ request }: LoaderFunctionArgs) {
  // Check if API key is configured
  if (!GOOGLE_PLACES_API_KEY) {
    return json(
      {
        success: false,
        error: "Google Places API key not configured",
        reviews: [],
      },
      { status: 500 }
    );
  }

  // Check if place ID is configured
  if (!STOKES_PLACE_ID || STOKES_PLACE_ID === "YOUR_PLACE_ID_HERE") {
    return json(
      {
        success: false,
        error: "Google Place ID not configured",
        reviews: [],
      },
      { status: 500 }
    );
  }

  try {
    const reviewsData = await fetchGoogleReviews(STOKES_PLACE_ID, GOOGLE_PLACES_API_KEY);
    
    return json(reviewsData, {
      headers: {
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error in reviews API:", error);
    return json(
      {
        success: false,
        error: "Failed to fetch reviews",
        reviews: [],
      },
      { status: 500 }
    );
  }
}
