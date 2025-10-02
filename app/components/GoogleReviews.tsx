import { formatReviewText, getInitials, formatReviewDate } from "~/lib/google-reviews";
import type { GoogleReview } from "~/lib/google-reviews";

interface GoogleReviewsProps {
  maxReviews?: number;
  showAllReviews?: boolean;
  reviewsData?: any;
}

export function GoogleReviews({ maxReviews = 3, showAllReviews = false, reviewsData }: GoogleReviewsProps) {
  const data = reviewsData || { success: false, reviews: [] };

  // Fallback reviews if API fails
  const fallbackReviews: GoogleReview[] = [
    {
      author_name: "Sarah M.",
      rating: 5,
      text: "Excellent service! They drilled our new well quickly and professionally. The water quality is perfect and the price was fair. Highly recommend!",
      time: Date.now() / 1000 - 86400 * 30, // 30 days ago
      relative_time_description: "a month ago",
    },
    {
      author_name: "Mike R.",
      rating: 5,
      text: "When our well pump failed, they came out the same day and had us back up and running quickly. Great emergency service!",
      time: Date.now() / 1000 - 86400 * 45, // 45 days ago
      relative_time_description: "a month ago",
    },
    {
      author_name: "Jennifer L.",
      rating: 5,
      text: "Professional, honest, and fair pricing. They explained everything clearly and delivered exactly what they promised.",
      time: Date.now() / 1000 - 86400 * 60, // 60 days ago
      relative_time_description: "2 months ago",
    },
  ];

  const reviews = data.success && data.reviews ? data.reviews : fallbackReviews;
  const displayReviews = showAllReviews ? reviews : reviews.slice(0, maxReviews);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {displayReviews.map((review, index) => (
        <div key={`${review.author_name}-${review.time}`} className="bg-gray-50 rounded-lg p-8 border-l-4 border-primary-600">
          <div className="flex items-center mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'fill-gray-300'}`} 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          
          <blockquote className="text-gray-700 mb-6 italic">
            "{formatReviewText(review.text)}"
          </blockquote>
          
          <div className="flex items-center">
            <div>
              <div className="font-semibold text-gray-900">{review.author_name}</div>
              <div className="text-sm text-gray-600">
                {review.relative_time_description}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Show error message if API failed */}
      {!data.success && (
        <div className="col-span-full text-center py-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-yellow-800 text-sm">
              Showing sample reviews. Real Google reviews will appear once configured.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Component for displaying review summary stats
export function ReviewSummary({ reviewsData }: { reviewsData?: any }) {
  const data = reviewsData || { success: false, placeDetails: null };

  if (data.success && data.placeDetails) {
    return (
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex text-yellow-400 mr-3">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-6 h-6 ${i < Math.floor(data.placeDetails!.rating) ? 'fill-current' : 'fill-gray-300'}`} 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-2xl font-bold text-gray-900">
            {data.placeDetails.rating.toFixed(1)}
          </span>
        </div>
        <p className="text-lg text-gray-600">
          Based on {data.placeDetails.user_ratings_total} Google reviews
        </p>
      </div>
    );
  }

  // Fallback summary
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <div className="flex text-yellow-400 mr-3">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-2xl font-bold text-gray-900">5.0</span>
      </div>
      <p className="text-lg text-gray-600">
        Trusted by homeowners in Utah
      </p>
    </div>
  );
}
