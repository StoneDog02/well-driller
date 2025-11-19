import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { saveSubmission } from "~/lib/storage";
import { InteractiveMap } from "~/components/InteractiveMap";

export const meta: MetaFunction = () => {
  return [
    { title: "Contact Us - Stokes Water Well" },
    {
      name: "description",
      content:
        "Contact Stokes Water Well for residential well drilling services. Call (555) 123-4567 for free consultation and quote.",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  // Basic validation
  if (!firstName || !lastName || !email || !subject || !message) {
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
      type: 'contact',
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      subject,
      message,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return json({ success: true });
  } catch (error) {
    console.error('Error saving submission:', error);
    return json(
      { error: "There was an error sending your message. Please try again." },
      { status: 500 }
    );
  }
}

export default function Contact() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
            alt="Completed well installation with clean water"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Get in <span className="text-primary-400">Touch</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Need well drilling services? We&apos;d love to hear from you
              and discuss how we can help with your residential water well needs.
            </p>
            {/* Prominent Phone Number */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 max-w-md mx-auto border-l-4 border-accent-800">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Call Now</p>
                  <a href="tel:+14357649462" className="text-2xl font-bold text-accent-800 hover:text-accent-900 transition-colors duration-200">
                    (435) 764-9462
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send us a Message
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
                      <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent Successfully!</h3>
                      <p className="text-lg text-green-700">
                        Thank you! Your message has been sent successfully. We'll get back to you soon.
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

              <Form method="post" className="space-y-6" data-netlify="true" name="contact">
                <input type="hidden" name="form-name" value="contact" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="">Select a service</option>
                    <option value="new-well">New Well Drilling</option>
                    <option value="well-repair">Well Repair</option>
                    <option value="pump-installation">Pump Installation</option>
                    <option value="water-testing">Water Testing</option>
                    <option value="well-maintenance">Well Maintenance</option>
                    <option value="emergency">Emergency Service</option>
                    <option value="quote">Free Quote Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-none"
                    placeholder="Tell us about your well drilling needs, property location, or any specific requirements..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                    'Send Message'
                  )}
                </button>
              </Form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Address
                    </h3>
                    <p className="text-gray-600">
                      Serving Local Area
                      <br />
                      Residential Well Drilling
                      <br />
                      Licensed & Insured
                    </p>
                  </div>
                </div>


                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Phone
                    </h3>
                    <a
                      href="tel:+14357649462"
                      className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                    >
                      (435) 764-9462
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Business Hours
                    </h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 4:00 PM
                      <br />
                      Sunday: Emergency Service Only
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Find Us
                </h3>
                <InteractiveMap className="w-full h-64" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about well drilling services and our process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                How long does well drilling take?
              </h3>
              <p className="text-gray-600">
                Well drilling typically takes 1-3 days depending on depth and ground conditions. 
                We&apos;ll provide a detailed timeline during our initial consultation and 
                keep you updated throughout the process.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                How much does a new well cost?
              </h3>
              <p className="text-gray-600">
                Well costs vary based on depth, ground conditions, and location. 
                We provide detailed quotes after site assessment. Contact us for a 
                free consultation and estimate with no obligation.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Do you provide well maintenance?
              </h3>
              <p className="text-gray-600">
                Yes, we offer comprehensive well maintenance services including 
                pump maintenance, water testing, and system inspections. We can 
                discuss maintenance schedules during our consultation.
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Do you offer emergency services?
              </h3>
              <p className="text-gray-600">
                Yes, we provide 24/7 emergency well services for urgent situations 
                like pump failures or water loss. We understand water is essential 
                and respond quickly to emergency calls.
              </p>
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
          });
        `,
      }}
    />
  );
}
