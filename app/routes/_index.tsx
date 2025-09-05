import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { saveSubmission } from "~/lib/storage";

export const meta: MetaFunction = () => {
  return [
    { title: "Stokes Water Well - Professional Residential Well Drilling" },
    {
      name: "description",
      content: "Professional residential well drilling services. New wells, repairs, maintenance, and water testing. Call (555) 123-4567 for free consultation.",
    },
  ];
};

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
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
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

      {/* Services Overview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Well Drilling Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Comprehensive residential well solutions delivered with expertise, reliability, and exceptional customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/services"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-block shadow-lg hover:shadow-xl"
              >
                View All Services
              </a>
              <a
                href="/contact"
                className="bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-block"
              >
                Get Free Quote
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
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Read what our satisfied customers have to say about our professional well drilling services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-8 border-l-4 border-primary-600">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-gray-700 mb-6 italic">
                "Excellent service! They drilled our new well quickly and professionally. 
                The water quality is perfect and the price was fair. Highly recommend!"
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah M.</div>
                  <div className="text-sm text-gray-600">Homeowner</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 border-l-4 border-primary-600">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-gray-700 mb-6 italic">
                "When our well pump failed, they came out the same day and had us 
                back up and running quickly. Great emergency service!"
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-900">Mike R.</div>
                  <div className="text-sm text-gray-600">Property Owner</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 border-l-4 border-primary-600">
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-gray-700 mb-6 italic">
                "Professional, honest, and fair pricing. They explained everything 
                clearly and delivered exactly what they promised."
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-900">Jennifer L.</div>
                  <div className="text-sm text-gray-600">Customer</div>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  );
}
