import type { MetaFunction, ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { saveSubmission } from "~/lib/storage";
import { GoogleReviews, ReviewSummary } from "~/components/GoogleReviews";
import { formatReviewText, getInitials } from "~/lib/google-reviews";

export const meta: MetaFunction = () => {
  return [
    { title: "Stokes Water Well - Professional Residential Well Drilling" },
    {
      name: "description",
      content: "Professional residential well drilling services. New wells, repairs, maintenance, and water testing. Call (555) 123-4567 for free consultation.",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Fetch Google reviews data
  const reviewsResponse = await fetch(`${new URL(request.url).origin}/api/reviews`);
  const reviewsData = await reviewsResponse.json();
  
  return json({ reviewsData });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  // Basic validation
  if (!name || !email) {
    return json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    await saveSubmission({
      type: 'callback',
      name,
      email,
      phone: phone || undefined,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return json({ success: true });
  } catch (error) {
    console.error('Error saving callback submission:', error);
    return json(
      { error: "There was an error sending your request. Please try again." },
      { status: 500 }
    );
  }
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const loaderData = useLoaderData<typeof loader>();

  // Get a different review for the testimonial (4th review to avoid duplication with main reviews section)
  const testimonialReview = loaderData.reviewsData?.success && loaderData.reviewsData?.reviews?.length > 3 
    ? loaderData.reviewsData.reviews[3] 
    : null;

  // Fallback testimonial if no real reviews available
  const fallbackTestimonial = {
    author_name: "Sarah",
    text: "Stokes Drilling did an amazing job installing my new well. I was pleased with their professionalism and experience. Highly recommended!",
    rating: 5,
    relative_time_description: "2 months ago"
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden -mt-24">
        {/* WATER RIPPLE BACKGROUND WITH STATIC WAVES */}
        <div className="absolute inset-0">
          {/* Base gradient background - using your existing blue colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent-600 via-accent-700 to-accent-800"></div>
          
          {/* Static Wave Background */}
          <div className="absolute inset-0">
            <svg className="absolute bottom-0 left-0 w-full h-40" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,60C200,20 400,100 600,40C800,80 1000,0 1200,60V120H0Z" fill="rgba(255,255,255,0.08)"/>
            </svg>
            <svg className="absolute bottom-0 left-0 w-full h-48" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,80C150,20 300,100 450,30C600,90 750,10 900,70C1050,40 1200,80V120H0Z" fill="rgba(255,255,255,0.06)"/>
            </svg>
            <svg className="absolute bottom-0 left-0 w-full h-56" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,50C100,90 200,20 300,70C400,10 500,80 600,30C700,90 800,20 900,60C1000,10 1100,70 1200,40V120H0Z" fill="rgba(255,255,255,0.04)"/>
            </svg>
            <svg className="absolute bottom-0 right-0 w-3/4 h-44" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,70C200,30 400,90 600,50C800,80 1000,20 1200,60V120H0Z" fill="rgba(255,255,255,0.03)"/>
            </svg>
            <svg className="absolute bottom-0 left-0 w-2/3 h-36" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,40C150,80 300,20 450,60C600,10 750,70 900,30C1050,80 1200,40V120H0Z" fill="rgba(255,255,255,0.02)"/>
            </svg>
            <svg className="absolute bottom-0 left-1/4 w-1/2 h-52" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,60C100,20 200,80 300,40C400,90 500,10 600,70C700,30 800,80 900,50C1000,90 1100,20 1200,60V120H0Z" fill="rgba(255,255,255,0.015)"/>
            </svg>
            <svg className="absolute bottom-0 left-1/6 w-1/3 h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,50C100,90 200,20 300,70C400,10 500,80 600,30C700,90 800,20 900,60C1000,10 1100,70 1200,40V120H0Z" fill="rgba(255,255,255,0.01)"/>
            </svg>
            <svg className="absolute bottom-0 right-1/6 w-1/3 h-38" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,80C150,30 300,90 450,40C600,80 750,20 900,70C1050,10 1200,50V120H0Z" fill="rgba(255,255,255,0.012)"/>
            </svg>
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full opacity-20"></div>
              <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-white rounded-full opacity-15"></div>
              <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-white rounded-full opacity-25"></div>
              <div className="absolute top-2/3 right-1/4 w-5 h-5 bg-white rounded-full opacity-10"></div>
              <div className="absolute top-3/4 left-1/2 w-4 h-4 bg-white rounded-full opacity-20"></div>
              <div className="absolute top-1/5 right-1/5 w-2 h-2 bg-white rounded-full opacity-30"></div>
              <div className="absolute top-2/5 left-1/5 w-7 h-7 bg-white rounded-full opacity-5"></div>
              <div className="absolute top-4/5 right-1/3 w-3 h-3 bg-white rounded-full opacity-20"></div>
            </div>
          </div>
          
          {/* Water ripple container */}
          <div className="absolute inset-0" id="water-ripples">
            {/* Dynamic drops will be created here by JavaScript */}
          </div>
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Stokes Water Well Drilling
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                Operating In Your Area Now
              </p>
              <a 
                href="/request" 
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 inline-block shadow-lg hover:shadow-xl"
              >
                REQUEST A QUOTE
              </a>
            </div>
            
            {/* Right Content - Callback Form */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Request A Callback
                </h2>
                
                {/* Success Message */}
                {actionData && 'success' in actionData && actionData.success && (
                  <div className="mb-8 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-lg" id="success-message">
                    <div className="flex items-center justify-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4 text-center">
                        <h3 className="text-2xl font-bold text-green-800 mb-2">Callback Requested!</h3>
                        <p className="text-lg text-green-700">
                          Thank you! We'll call you back soon.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {actionData && 'error' in actionData && actionData.error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">
                          {actionData && 'error' in actionData ? actionData.error : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Form method="post" className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name: *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address: *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telephone Number:
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Our team will be in touch as soon as possible to discuss your needs.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'REQUEST CALLBACK'
                    )}
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave Transition */}
      </section>

      {/* Why Choose Stokes Drilling Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">
              Why Choose Stokes Drilling?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Bullet Points */}
            <div className="space-y-8">
              {/* Local Garland Experts */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary-600 mb-3">
                    Local Garland, Utah Experts
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Stokes Drilling is a well-established well drilling contractor located in Garland, Utah. We are recognized for our reliability and commitment to serving the local community with high-quality drilling services. With 10+ years of experience and 200+ wells drilled, we have built a reputation for providing essential water well solutions to our clients.
                  </p>
                </div>
              </div>

              {/* Licensed Professional Team */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary-600 mb-3">
                    Licensed Professional Team
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Led by Zachary Larsen, our Owner & Lead Driller, we have a team of licensed well drilling professionals committed to delivering exceptional results. Our experienced technicians specialize in well repairs, pump installation, and water system maintenance, ensuring your family has the clean, reliable water they need for years to come.
                  </p>
                </div>
              </div>

              {/* Quality & Reliability */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary-600 mb-3">
                    Quality, Reliability & Integrity
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We conduct business with honesty and transparency, providing fair pricing and honest assessments. With 24/7 emergency service availability, we strive for excellence in every well drilling project, ensuring the highest quality standards and attention to detail in all our work.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Logo with Elevated Review */}
            <div className="relative">
              {/* Full Logo Container */}
              <div className="relative w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-4 border-red-600 overflow-hidden shadow-xl">
                {/* Logo Image */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img 
                    src="/StokesDrillingLogo.png" 
                    alt="Stokes Drilling" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              
              {/* Elevated Review Box - Positioned in corner */}
              <div className="absolute -bottom-36 -right-24 bg-white rounded-lg shadow-2xl p-6 border-l-4 border-red-600 w-72 z-10 transform hover:scale-105 transition-transform duration-200">
                {/* Speech Bubble Icon */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {/* Star Rating */}
                {testimonialReview && (
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < testimonialReview.rating ? 'fill-current' : 'fill-gray-300'}`} 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                )}
                
                {/* Review Text */}
                <blockquote className="text-gray-700 italic mb-4 leading-relaxed text-sm">
                  "{testimonialReview ? formatReviewText(testimonialReview.text, 120) : fallbackTestimonial.text}"
                </blockquote>
                
                {/* Reviewer Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-red-600 font-semibold text-xs">
                        {testimonialReview ? getInitials(testimonialReview.author_name) : getInitials(fallbackTestimonial.author_name)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {testimonialReview ? testimonialReview.author_name : fallbackTestimonial.author_name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {testimonialReview ? testimonialReview.relative_time_description : fallbackTestimonial.relative_time_description}
                      </p>
                    </div>
                  </div>
                  {testimonialReview && (
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Google Review</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">
              Some Of Our Services
            </h2>
            
            {/* Service Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* New Well Drilling Card */}
              <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <i className="fa-solid fa-bore-hole text-6xl text-primary-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">New Well Drilling</h3>
              </div>

              {/* Well Repairs Card */}
              <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <i className="fa-solid fa-screwdriver-wrench text-6xl text-primary-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Well Repairs</h3>
              </div>

              {/* Water Testing Card */}
              <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <i className="fa-solid fa-microscope text-6xl text-primary-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Water Testing</h3>
              </div>
            </div>

            {/* Explore All Services Button */}
            <div className="text-center">
              <a
                href="/services"
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 inline-block shadow-lg hover:shadow-xl"
              >
                EXPLORE ALL OF OUR SERVICES
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Homeowners
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Read what our satisfied customers have to say about our professional well drilling services.
            </p>
            <ReviewSummary reviewsData={loaderData.reviewsData} />
          </div>
          <GoogleReviews maxReviews={3} reviewsData={loaderData.reviewsData} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Contact us today for a free consultation and quote. We're here to help 
                with all your residential well drilling needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 inline-block text-center shadow-lg hover:shadow-xl"
                >
                  Get Free Quote
                </a>
                <a
                  href="tel:+14357649462"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 inline-block text-center"
                >
                  Call (435) 764-9462
                </a>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 border border-white border-opacity-20">
              <h3 className="text-xl font-semibold text-white mb-6">Why Choose Us?</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Licensed & Insured</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">10+ Years Experience</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">24/7 Emergency Service</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-primary-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300">Free Estimates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PhoneFormattingScript />
    </div>
  );
}

// Phone number formatting script
export function PhoneFormattingScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          // Phone number formatting function
          function formatPhoneNumber(value) {
            // Remove all non-numeric characters
            const phoneNumber = value.replace(/[^\\d]/g, '');
            
            // Format as (XXX) XXX-XXXX
            if (phoneNumber.length >= 6) {
              return '(' + phoneNumber.slice(0, 3) + ') ' + phoneNumber.slice(3, 6) + '-' + phoneNumber.slice(6, 10);
            } else if (phoneNumber.length >= 3) {
              return '(' + phoneNumber.slice(0, 3) + ') ' + phoneNumber.slice(3);
            } else if (phoneNumber.length > 0) {
              return '(' + phoneNumber;
            }
            return phoneNumber;
          }
          
          // Apply formatting to phone inputs
          document.addEventListener('DOMContentLoaded', function() {
            const phoneInputs = document.querySelectorAll('input[type="tel"]');
            phoneInputs.forEach(function(input) {
              input.addEventListener('input', function(e) {
                const oldValue = e.target.value;
                const oldCursorPosition = e.target.selectionStart;
                
                // Count digits before cursor position
                const digitsBeforeCursor = oldValue.substring(0, oldCursorPosition).replace(/[^\\d]/g, '').length;
                
                const formattedValue = formatPhoneNumber(oldValue);
                e.target.value = formattedValue;
                
                // Find new cursor position based on digit count
                let newCursorPosition = formattedValue.length; // Default to end
                let digitCount = 0;
                
                for (let i = 0; i < formattedValue.length; i++) {
                  if (/\\d/.test(formattedValue[i])) {
                    digitCount++;
                    if (digitCount === digitsBeforeCursor) {
                      newCursorPosition = i + 1;
                      break;
                    }
                  }
                }
                
                // If we've typed all 10 digits, put cursor at the end
                if (digitsBeforeCursor >= 10) {
                  newCursorPosition = formattedValue.length;
                }
                
                // Set cursor position
                e.target.setSelectionRange(newCursorPosition, newCursorPosition);
              });
            });
            
            // Auto-scroll to success message if it exists
            const successMessage = document.getElementById('success-message');
            if (successMessage) {
              setTimeout(function() {
                successMessage.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'start' 
                });
              }, 100);
            }
          });
        `,
      }}
    />
  );
}
