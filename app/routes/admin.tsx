import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import { loadSubmissions, deleteSubmission, FormSubmission } from "~/lib/storage";

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

  return json({ error: 'Invalid action' }, { status: 400 });
}

export default function Admin() {
  const { submissions, error } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Form Submissions</h1>
            <p className="text-gray-600 mt-1">
              Total submissions: {submissions.length}
            </p>
          </div>

          {actionData?.error && (
            <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{actionData.error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            {submissions.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
                <p className="mt-1 text-sm text-gray-500">Form submissions will appear here.</p>
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
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => (
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
      <td className="px-6 py-4 text-sm text-gray-900">
        {submission.subject || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(submission.timestamp)}
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

      {/* Modal for viewing full submission details */}
      <dialog id={`modal-${submission.id}`} className="modal">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Submission Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="font-semibold text-gray-700">Type:</label>
              <p className="text-gray-900">{submission.type}</p>
            </div>
            
            <div>
              <label className="font-semibold text-gray-700">Name:</label>
              <p className="text-gray-900">{getDisplayName(submission)}</p>
            </div>
            
            <div>
              <label className="font-semibold text-gray-700">Email:</label>
              <p className="text-gray-900">{submission.email}</p>
            </div>
            
            {submission.phone && (
              <div>
                <label className="font-semibold text-gray-700">Phone:</label>
                <p className="text-gray-900">{submission.phone}</p>
              </div>
            )}
            
            {submission.subject && (
              <div>
                <label className="font-semibold text-gray-700">Subject:</label>
                <p className="text-gray-900">{submission.subject}</p>
              </div>
            )}
            
            {submission.message && (
              <div>
                <label className="font-semibold text-gray-700">Message:</label>
                <p className="text-gray-900 whitespace-pre-wrap">{submission.message}</p>
              </div>
            )}
            
            <div>
              <label className="font-semibold text-gray-700">Submitted:</label>
              <p className="text-gray-900">{new Date(submission.timestamp).toLocaleString()}</p>
            </div>
            
            {submission.ip && (
              <div>
                <label className="font-semibold text-gray-700">IP Address:</label>
                <p className="text-gray-900">{submission.ip}</p>
              </div>
            )}
          </div>
          
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </tr>
  );
}
