import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import { saveSubmission } from "~/lib/storage";

export const meta: MetaFunction = () => {
  return [
    { title: "Request Quote - Stokes Water Well" },
    {
      name: "description",
      content: "Request a detailed quote for your well drilling project. Get professional estimates for new wells, replacements, and pump installations.",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const state = formData.get("state") as string;
  const propertyLocation = formData.get("propertyLocation") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const mailingAddress = formData.get("mailingAddress") as string;
  const hasStartCard = formData.get("hasStartCard") as string;
  const wellPermit = formData.get("wellPermit") as string;
  const waterRightNumber = formData.get("waterRightNumber") as string;
  const wellPurpose = formData.get("wellPurpose") as string;
  const wellType = formData.get("wellType") as string;
  const startMonth = formData.get("startMonth") as string;
  const startYear = formData.get("startYear") as string;
  const constructionFinishDate = formData.get("constructionFinishDate") as string;
  const includePumpBid = formData.get("includePumpBid") as string;
  const requestType = formData.get("requestType") as string;
  const bookPhoneCall = formData.get("bookPhoneCall") as string;
  const questions = formData.get("questions") as string;

  // Basic validation
  if (!state || !propertyLocation || !firstName || !lastName || !phone || !email || !wellPurpose || !wellType || !startMonth || !startYear) {
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

  // Phone validation
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return json(
      { error: "Please enter a valid phone number." },
      { status: 400 }
    );
  }

  try {
    await saveSubmission({
      type: 'request',
      firstName,
      lastName,
      email,
      phone,
      subject: `Well Drilling Request - ${wellType} ${wellPurpose}`,
      message: `State: ${state}
Property Location: ${propertyLocation}
Mailing Address: ${mailingAddress || 'Not provided'}
${state === 'Utah' ? `Start Card/Permit: ${hasStartCard}
Well Permit: ${wellPermit || 'Not provided'}
Water Right Number: ${waterRightNumber || 'Not provided'}` : ''}
Well Purpose: ${wellPurpose}
Well Type: ${wellType}
Start Date: ${startMonth} ${startYear}
${constructionFinishDate ? `Construction Finish Date: ${constructionFinishDate}` : ''}
Include Pump Bid: ${includePumpBid}
Request Type: ${requestType}
Book Phone Call: ${bookPhoneCall}
Questions: ${questions || 'None'}`,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return json({ success: true });
  } catch (error) {
    console.error('Error saving request submission:', error);
    return json(
      { error: "There was an error submitting your request. Please try again." },
      { status: 500 }
    );
  }
}

export default function Request() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear + i);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
            alt="Professional well drilling equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Request a <span className="text-primary-400">Quote</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              Get a detailed estimate for your well drilling project. Fill out the form below 
              and we'll provide you with a comprehensive quote tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Well Drilling Request Form
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
                    <h3 className="text-2xl font-bold text-green-800 mb-2">Request Submitted Successfully!</h3>
                    <p className="text-lg text-green-700">
                      Thank you for your request. We'll review your information and get back to you with a detailed quote within 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {actionData && 'error' in actionData && actionData.error && (
              <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">
                      {actionData && 'error' in actionData ? actionData.error : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Form method="post" className="space-y-8">
              {/* Location Information */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Location Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      onChange={(e) => {
                        const utahSection = document.getElementById('utah-section');
                        if (utahSection) {
                          utahSection.style.display = e.target.value === 'Utah' ? 'block' : 'none';
                        }
                      }}
                    >
                      <option value="">Select State</option>
                      <option value="Utah">Utah</option>
                      <option value="Nevada">Nevada</option>
                      <option value="Idaho">Idaho</option>
                      <option value="Wyoming">Wyoming</option>
                      <option value="Colorado">Colorado</option>
                      <option value="Arizona">Arizona</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="propertyLocation" className="block text-sm font-medium text-gray-700 mb-2">
                      Property Location (GPS or Address) *
                    </label>
                    <textarea
                      id="propertyLocation"
                      name="propertyLocation"
                      rows={3}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Enter GPS coordinates or full property address..."
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="(435) 764-9462"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="mailingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Mailing Address
                  </label>
                  <textarea
                    id="mailingAddress"
                    name="mailingAddress"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Enter your mailing address if different from property location..."
                  />
                </div>
              </div>

              {/* Utah-Specific Information */}
              <div className="border-b border-gray-200 pb-8" id="utah-section" style={{ display: 'none' }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Utah-Specific Information</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Do you have a start card or well permit? *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hasStartCard"
                          value="yes"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Yes, I have a start card or well permit</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="hasStartCard"
                          value="no"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">No, I don't have a start card or well permit</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="wellPermit" className="block text-sm font-medium text-gray-700 mb-2">
                      Well Permit Number (if applicable)
                    </label>
                    <input
                      type="text"
                      id="wellPermit"
                      name="wellPermit"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter well permit number..."
                    />
                  </div>
                  <div>
                    <label htmlFor="waterRightNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Water Right Number (if applicable)
                    </label>
                    <input
                      type="text"
                      id="waterRightNumber"
                      name="waterRightNumber"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter water right number..."
                    />
                  </div>
                </div>
              </div>

              {/* Well Details */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Well Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Purpose of the Well *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="wellPurpose"
                          value="residential"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Residential</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="wellPurpose"
                          value="livestock"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Livestock</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="wellPurpose"
                          value="irrigation"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Irrigation</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="wellPurpose"
                          value="other"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Other</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Well Type *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="wellType"
                          value="new"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">New Well</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="wellType"
                          value="replacement"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Replacement Well</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Project Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="startMonth" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Start Month *
                    </label>
                    <select
                      id="startMonth"
                      name="startMonth"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="startYear" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Start Year *
                    </label>
                    <select
                      id="startYear"
                      name="startYear"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select Year</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label htmlFor="constructionFinishDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Construction Finish Date (for new construction homes)
                  </label>
                  <input
                    type="date"
                    id="constructionFinishDate"
                    name="constructionFinishDate"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Additional Services */}
              <div className="border-b border-gray-200 pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Additional Services</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Would you like a pump bid as well as a bid for drilling?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="includePumpBid"
                          value="yes"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Yes, include pump bid</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="includePumpBid"
                          value="no"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">No, drilling only</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      What type of estimate are you looking for?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="requestType"
                          value="general"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">General information</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="requestType"
                          value="official"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Official estimate</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Would you like to book a phone call?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="bookPhoneCall"
                          value="yes"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Yes, please call me</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="bookPhoneCall"
                          value="no"
                          className="mr-3 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-700">No, email is fine</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="pb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Questions & Additional Information</h3>
                <div>
                  <label htmlFor="questions" className="block text-sm font-medium text-gray-700 mb-2">
                    What questions do you have about the well drilling process?
                  </label>
                  <textarea
                    id="questions"
                    name="questions"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Ask any questions you have about the well drilling process, timeline, costs, or anything else..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-4 px-8 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Request...
                    </span>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </Form>
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
