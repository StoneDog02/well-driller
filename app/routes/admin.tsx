import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import { useState, useMemo } from "react";
import { loadSubmissions, deleteSubmission, updateContactedStatus, updateReferredStatus, FormSubmission } from "~/lib/storage";

export const meta: MetaFunction = () => {
  return [
    { title: "Admin - Stokes Water Well" },
    { name: "robots", content: "noindex, nofollow" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Simple password protection - in production, use proper authentication
  const url = new URL(request.url);
  const password = url.searchParams.get('password');
  
  if (password !== 'stokes2024') {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const submissions = await loadSubmissions();
  return json({ submissions });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('action') as string;
  const id = formData.get('id') as string;

  if (action === 'delete' && id) {
    const success = await deleteSubmission(id);
    if (success) {
      return redirect('/admin?password=stokes2024');
    } else {
      return json({ error: 'Failed to delete submission' }, { status: 400 });
    }
  }

  if (action === 'toggle-contacted' && id) {
    const contacted = formData.get('contacted') === 'true';
    const success = await updateContactedStatus(id, contacted);
    if (success) {
      return redirect('/admin?password=stokes2024');
    } else {
      return json({ error: 'Failed to update contacted status' }, { status: 400 });
    }
  }

  if (action === 'toggle-referred' && id) {
    const referred = formData.get('referred') === 'true';
    const success = await updateReferredStatus(id, referred);
    if (success) {
      return redirect('/admin?password=stokes2024');
    } else {
      return json({ error: 'Failed to update referred status' }, { status: 400 });
    }
  }

  return json({ error: 'Invalid action' }, { status: 400 });
}

export default function Admin() {
  const { submissions, error } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  
  // Filter states
  const [contactedFilters, setContactedFilters] = useState<{
    contacted: boolean;
    notContacted: boolean;
  }>({ contacted: false, notContacted: false });
  
  const [timeframeFilters, setTimeframeFilters] = useState<{
    urgent: boolean;
    soon: boolean;
    future: boolean;
  }>({ urgent: false, soon: false, future: false });
  
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  
  // Helper function to extract start date from message
  const getStartDate = (submission: FormSubmission): Date | null => {
    if (!submission.message) return null;
    
    // Look for "Start Date:" in the message
    const startDateMatch = submission.message.match(/Start Date:\s*(.+)/i);
    if (startDateMatch) {
      const dateStr = startDateMatch[1].trim();
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  };
  
  // Helper function to categorize timeframe
  const getTimeframeCategory = (submission: FormSubmission): 'urgent' | 'soon' | 'future' | 'unknown' => {
    const startDate = getStartDate(submission);
    if (!startDate) return 'unknown';
    
    const now = new Date();
    const diffDays = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 30) return 'urgent';
    if (diffDays <= 90) return 'soon';
    return 'future';
  };
  
  // Filter submissions based on current filter settings
  const filteredSubmissions = useMemo(() => {
    // If no filters are selected, show all submissions
    const hasContactedFilters = contactedFilters.contacted || contactedFilters.notContacted;
    const hasTimeframeFilters = timeframeFilters.urgent || timeframeFilters.soon || timeframeFilters.future;
    
    if (!hasContactedFilters && !hasTimeframeFilters) {
      return submissions;
    }
    
    return submissions.filter(submission => {
      let matchesContacted = true;
      let matchesTimeframe = true;
      
      // Contacted filter - only apply if at least one contacted filter is selected
      if (hasContactedFilters) {
        const isContacted = submission.contacted || false;
        matchesContacted = (isContacted && contactedFilters.contacted) || 
                         (!isContacted && contactedFilters.notContacted);
      }
      
      // Timeframe filter - only apply if at least one timeframe filter is selected
      if (hasTimeframeFilters) {
        const category = getTimeframeCategory(submission);
        matchesTimeframe = (category === 'urgent' && timeframeFilters.urgent) ||
                          (category === 'soon' && timeframeFilters.soon) ||
                          (category === 'future' && timeframeFilters.future);
      }
      
      return matchesContacted && matchesTimeframe;
    });
  }, [submissions, contactedFilters, timeframeFilters]);
  
  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return contactedFilters.contacted || contactedFilters.notContacted ||
           timeframeFilters.urgent || timeframeFilters.soon || timeframeFilters.future;
  }, [contactedFilters, timeframeFilters]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access</h1>
          <p className="text-gray-600 mb-4">Please enter the admin password:</p>
          <Form method="get" className="space-y-4">
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              className="w-full btn-primary py-3"
            >
              Access Admin Panel
            </button>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Home Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-600">
              Form Submissions ({filteredSubmissions.length} of {submissions.length})
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </a>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">

          {actionData?.error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{actionData.error}</p>
            </div>
          )}

          {/* Filter Controls */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilterPopup(!showFilterPopup)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
                    hasActiveFilters
                      ? 'bg-primary-50 border-primary-300 text-primary-700 hover:bg-primary-100'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Active
                    </span>
                  )}
                </button>
                
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      setContactedFilters({ contacted: false, notContacted: false });
                      setTimeframeFilters({ urgent: false, soon: false, future: false });
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            
            {/* Filter Popup */}
            {showFilterPopup && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Status Filters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Status</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={contactedFilters.contacted}
                          onChange={(e) => setContactedFilters(prev => ({ ...prev, contacted: e.target.checked }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Contacted</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={contactedFilters.notContacted}
                          onChange={(e) => setContactedFilters(prev => ({ ...prev, notContacted: e.target.checked }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Not Contacted</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Timeframe Filters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Project Timeframe</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={timeframeFilters.urgent}
                          onChange={(e) => setTimeframeFilters(prev => ({ ...prev, urgent: e.target.checked }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Urgent (≤30 days)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={timeframeFilters.soon}
                          onChange={(e) => setTimeframeFilters(prev => ({ ...prev, soon: e.target.checked }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Soon (31-90 days)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={timeframeFilters.future}
                          onChange={(e) => setTimeframeFilters(prev => ({ ...prev, future: e.target.checked }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Future (&gt;90 days)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            {submissions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
                <p className="mt-1 text-sm text-gray-500">Form submissions will appear here.</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions match your filters</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filter criteria.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Choice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacted?
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <SubmissionRow key={submission.id} submission={submission} />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmissionRow({ submission }: { submission: FormSubmission }) {
  const navigation = useNavigation();
  const isDeleting = navigation.state === "submitting" && 
    navigation.formData?.get('id') === submission.id;

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDisplayName = (submission: FormSubmission) => {
    if (submission.firstName && submission.lastName) {
      return `${submission.firstName} ${submission.lastName}`;
    }
    return submission.name || 'N/A';
  };

  const getStateAbbreviation = (submission: FormSubmission) => {
    // First check if state is directly available
    if (submission.state) {
      return submission.state.toUpperCase();
    }
    
    // If not, try to extract from message
    if (submission.message) {
      const stateMatch = submission.message.match(/STATE:\s*(.+)/i);
      if (stateMatch) {
        const state = stateMatch[1].trim();
        // Convert full state names to abbreviations
        const stateAbbreviations: { [key: string]: string } = {
          'utah': 'UT',
          'idaho': 'ID',
          'nevada': 'NV',
          'wyoming': 'WY',
          'colorado': 'CO',
          'arizona': 'AZ',
          'california': 'CA',
          'oregon': 'OR',
          'washington': 'WA',
          'montana': 'MT'
        };
        
        const lowerState = state.toLowerCase();
        return stateAbbreviations[lowerState] || state.toUpperCase();
      }
    }
    
    return 'N/A';
  };

  return (
    <tr className={isDeleting ? 'opacity-50' : ''}>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          submission.type === 'contact' 
            ? 'bg-blue-100 text-blue-800' 
            : submission.type === 'callback'
            ? 'bg-green-100 text-green-800'
            : 'bg-purple-100 text-purple-800'
        }`}>
          {submission.type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {getDisplayName(submission)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <a href={`mailto:${submission.email}`} className="text-primary-600 hover:text-primary-900">
          {submission.email}
        </a>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {submission.phone ? (
          <a href={`tel:${submission.phone}`} className="text-primary-600 hover:text-primary-900">
            {submission.phone}
          </a>
        ) : (
          'N/A'
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {submission.bookPhoneCall ? (
          submission.bookPhoneCall === 'yes' && submission.phone ? (
            <a
              href={`tel:${submission.phone}`}
              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 hover:opacity-80 bg-blue-100 text-blue-800 hover:bg-blue-200"
              title="Click to call"
              onClick={() => {
                // Mark as contacted when phone is clicked
                if (!submission.contacted) {
                  const form = document.createElement('form');
                  form.method = 'post';
                  form.style.display = 'none';
                  
                  const actionInput = document.createElement('input');
                  actionInput.type = 'hidden';
                  actionInput.name = 'action';
                  actionInput.value = 'toggle-contacted';
                  form.appendChild(actionInput);
                  
                  const idInput = document.createElement('input');
                  idInput.type = 'hidden';
                  idInput.name = 'id';
                  idInput.value = submission.id;
                  form.appendChild(idInput);
                  
                  const contactedInput = document.createElement('input');
                  contactedInput.type = 'hidden';
                  contactedInput.name = 'contacted';
                  contactedInput.value = 'true';
                  form.appendChild(contactedInput);
                  
                  document.body.appendChild(form);
                  form.submit();
                }
              }}
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Phone
            </a>
          ) : submission.bookPhoneCall === 'no' ? (
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(submission.email)}&subject=${encodeURIComponent(submission.subject || 'Re: Your inquiry')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 hover:opacity-80 bg-green-100 text-green-800 hover:bg-green-200"
              title="Click to open Gmail"
              onClick={() => {
                // Mark as contacted when email is clicked
                if (!submission.contacted) {
                  const form = document.createElement('form');
                  form.method = 'post';
                  form.style.display = 'none';
                  
                  const actionInput = document.createElement('input');
                  actionInput.type = 'hidden';
                  actionInput.name = 'action';
                  actionInput.value = 'toggle-contacted';
                  form.appendChild(actionInput);
                  
                  const idInput = document.createElement('input');
                  idInput.type = 'hidden';
                  idInput.name = 'id';
                  idInput.value = submission.id;
                  form.appendChild(idInput);
                  
                  const contactedInput = document.createElement('input');
                  contactedInput.type = 'hidden';
                  contactedInput.name = 'contacted';
                  contactedInput.value = 'true';
                  form.appendChild(contactedInput);
                  
                  document.body.appendChild(form);
                  form.submit();
                }
              }}
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email
            </a>
          ) : (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              submission.bookPhoneCall === 'yes' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {submission.bookPhoneCall === 'yes' ? (
                <>
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Phone
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email
                </>
              )}
            </span>
          )
        ) : (
          'N/A'
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
          submission.contacted
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {submission.contacted ? (
            <>
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Contacted
            </>
          ) : (
            <>
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Pending
            </>
          )}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {submission.subject || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(submission.timestamp)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {getStateAbbreviation(submission)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const modal = document.getElementById(`modal-${submission.id}`);
              if (modal) {
                (modal as any).showModal();
              }
            }}
            className="text-primary-600 hover:text-primary-900"
          >
            View
          </button>
          <Form method="post" className="inline">
            <input type="hidden" name="action" value="delete" />
            <input type="hidden" name="id" value={submission.id} />
            <button
              type="submit"
              disabled={isDeleting}
              className="text-red-600 hover:text-red-900 disabled:opacity-50"
              onClick={(e) => {
                if (!confirm('Are you sure you want to delete this submission?')) {
                  e.preventDefault();
                }
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </Form>
        </div>
      </td>

      {/* Enhanced Detail Modal */}
      <dialog 
        id={`modal-${submission.id}`} 
        className="modal"
        data-submission-id={submission.id}
        onClick={(e) => {
          // Close modal when clicking on the backdrop (outside the modal-box)
          if (e.target === e.currentTarget) {
            (e.currentTarget as any).close();
          }
        }}
      >
        <div className="modal-box max-w-5xl p-0 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 relative">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Submission Details</h3>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    submission.type === 'request' 
                      ? 'bg-blue-100 text-blue-800' 
                      : submission.type === 'contact'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {submission.type === 'request' ? '📋 Request Quote' : 
                     submission.type === 'contact' ? '📧 Contact Form' : '📞 Callback Request'}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    submission.contacted 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {submission.contacted ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Contacted
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Pending Contact
                      </>
                    )}
                  </span>
                  <span className={`referred-status inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    submission.referred 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`} data-submission-id={submission.id}>
                    {submission.referred ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Referred
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Not Referred
                      </>
                    )}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-primary-100 text-sm">Submitted</p>
                <p className="font-semibold">{formatDate(submission.timestamp)}</p>
              </div>
            </div>
            
            {/* Close X Button */}
            <button
              onClick={() => {
                const modal = document.getElementById(`modal-${submission.id}`);
                if (modal) {
                  (modal as any).close();
                }
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200"
              title="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Contact Info */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Name</label>
                      <p className="text-lg font-semibold text-gray-900 mt-1">{getDisplayName(submission)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</label>
                      <p className="mt-1">
                        <a 
                          href={`mailto:${submission.email}`}
                          className="text-lg text-primary-600 hover:text-primary-800 underline font-medium"
                          onClick={() => {
                            if (!submission.contacted) {
                              const form = document.createElement('form');
                              form.method = 'post';
                              form.style.display = 'none';
                              
                              const actionInput = document.createElement('input');
                              actionInput.type = 'hidden';
                              actionInput.name = 'action';
                              actionInput.value = 'toggle-contacted';
                              form.appendChild(actionInput);
                              
                              const idInput = document.createElement('input');
                              idInput.type = 'hidden';
                              idInput.name = 'id';
                              idInput.value = submission.id;
                              form.appendChild(idInput);
                              
                              const contactedInput = document.createElement('input');
                              contactedInput.type = 'hidden';
                              contactedInput.name = 'contacted';
                              contactedInput.value = 'true';
                              form.appendChild(contactedInput);
                              
                              document.body.appendChild(form);
                              form.submit();
                            }
                          }}
                        >
                          {submission.email}
                        </a>
                      </p>
                    </div>
                    
                    {submission.phone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                        <p className="mt-1">
                          <a 
                            href={`tel:${submission.phone}`}
                            className="text-lg text-primary-600 hover:text-primary-800 underline font-medium"
                            onClick={() => {
                              if (!submission.contacted) {
                                const form = document.createElement('form');
                                form.method = 'post';
                                form.style.display = 'none';
                                
                                const actionInput = document.createElement('input');
                                actionInput.type = 'hidden';
                                actionInput.name = 'action';
                                actionInput.value = 'toggle-contacted';
                                form.appendChild(actionInput);
                                
                                const idInput = document.createElement('input');
                                idInput.type = 'hidden';
                                idInput.name = 'id';
                                idInput.value = submission.id;
                                form.appendChild(idInput);
                                
                                const contactedInput = document.createElement('input');
                                contactedInput.type = 'hidden';
                                contactedInput.name = 'contacted';
                                contactedInput.value = 'true';
                                form.appendChild(contactedInput);
                                
                                document.body.appendChild(form);
                                form.submit();
                              }
                            }}
                          >
                            {submission.phone}
                          </a>
                        </p>
                      </div>
                    )}
                    
                    {submission.bookPhoneCall && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Preferred Contact Method</label>
                        <p className="mt-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            submission.bookPhoneCall === 'yes' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {submission.bookPhoneCall === 'yes' ? (
                              <>
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                Phone Call
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                Email
                              </>
                            )}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column - Project Details */}
              <div className="space-y-6">
                {/* Project Details - Show parsed message data */}
                {submission.message && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Project Details
                    </h4>
                    <div className="space-y-3">
                      {submission.message.split('\n').map((line, index) => {
                        if (line.includes(':')) {
                          const [key, ...valueParts] = line.split(':');
                          const value = valueParts.join(':').trim();
                          return (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-start py-2 border-b border-gray-100 last:border-b-0">
                              <div className="sm:w-1/3 mb-1 sm:mb-0">
                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                  {key.trim()}
                                </span>
                              </div>
                              <div className="sm:w-2/3">
                                <span className="text-gray-900">
                                  {value || 'Not provided'}
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div key={index} className="py-1">
                            <span className="text-gray-900">{line}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Subject/Message for non-request submissions */}
                {submission.type !== 'request' && (submission.subject || submission.message) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      Message Details
                    </h4>
                    <div className="space-y-3">
                      {submission.subject && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Subject</label>
                          <p className="text-gray-900 mt-1 font-medium">{submission.subject}</p>
                        </div>
                      )}
                      
                      {submission.message && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Message</label>
                          <div className="mt-1 p-4 bg-white rounded-lg border border-gray-200 text-gray-900">
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {submission.message}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Utah-specific details */}
                {submission.type === 'request' && (submission.hasStartCard || submission.wellPermit || submission.waterRightNumber) && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      Utah Permits & Documentation
                    </h4>
                    <div className="space-y-3">
                      {submission.hasStartCard && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Start Card/Well Permit</label>
                          <p className="text-gray-900 mt-1 font-medium">{submission.hasStartCard}</p>
                        </div>
                      )}
                      
                      {submission.wellPermit && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Well Permit</label>
                          <p className="text-gray-900 mt-1 font-medium">{submission.wellPermit}</p>
                        </div>
                      )}
                      
                      {submission.waterRightNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Water Right Number</label>
                          <p className="text-gray-900 mt-1 font-medium">{submission.waterRightNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional preferences */}
                {submission.type === 'request' && (submission.includePumpBid || submission.requestType || submission.questions) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      Preferences & Questions
                    </h4>
                    <div className="space-y-3">
                      {submission.includePumpBid && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Include Pump Bid</label>
                          <p className="text-gray-900 mt-1 font-medium">{submission.includePumpBid}</p>
                        </div>
                      )}
                      
                      {submission.requestType && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Request Type</label>
                          <p className="text-gray-900 mt-1 font-medium">{submission.requestType}</p>
                        </div>
                      )}
                      
                      {submission.questions && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Questions</label>
                          <div className="mt-1 p-4 bg-white rounded-lg border border-gray-200 text-gray-900">
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {submission.questions}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex justify-between items-center">
              <button
                onClick={() => {
                  // Create email content with all submission details
                  const emailSubject = `Referral: ${submission.subject || 'Well Drilling Inquiry'} - ${getDisplayName(submission)}`;
                  
                  let emailBody = `Dear Colleague,\n\n`;
                  emailBody += `I'm referring a potential well drilling client to you:\n\n`;
                  emailBody += `CONTACT INFORMATION:\n`;
                  emailBody += `Name: ${getDisplayName(submission)}\n`;
                  emailBody += `Email: ${submission.email}\n`;
                  if (submission.phone) {
                    emailBody += `Phone: ${submission.phone}\n`;
                  }
                  emailBody += `Preferred Contact: ${submission.bookPhoneCall === 'yes' ? 'Phone Call' : 'Email'}\n\n`;
                  
                  if (submission.message) {
                    emailBody += `PROJECT DETAILS:\n`;
                    emailBody += submission.message.replace(/:/g, ': ').replace(/\n/g, '\n');
                    emailBody += `\n\n`;
                  }
                  
                  if (submission.subject) {
                    emailBody += `SUBJECT: ${submission.subject}\n\n`;
                  }
                  
                  emailBody += `Submitted: ${formatDate(submission.timestamp)}\n`;
                  emailBody += `Type: ${submission.type === 'request' ? 'Quote Request' : submission.type === 'contact' ? 'Contact Form' : 'Callback Request'}\n\n`;
                  emailBody += `Please follow up with this client as soon as possible.\n\n`;
                  emailBody += `Best regards,\n`;
                  emailBody += `Stokes Drilling Team`;
                  
                  // Open email client with pre-filled content
                  const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                  window.open(mailtoLink);
                  
                  // Mark as referred asynchronously without page reload
                  if (!submission.referred) {
                    fetch('/admin?password=stokes2024', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                      },
                      body: new URLSearchParams({
                        action: 'toggle-referred',
                        id: submission.id,
                        referred: 'true'
                      })
                    }).then(() => {
                      // Update the UI immediately without page reload
                      const referredPill = document.querySelector(`[data-submission-id="${submission.id}"] .referred-status`);
                      if (referredPill) {
                        referredPill.innerHTML = `
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                          Referred
                        `;
                        referredPill.className = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800';
                      }
                    }).catch(console.error);
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send to Email
              </button>
              
              <form method="dialog">
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                  Close
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </tr>
  );
}
