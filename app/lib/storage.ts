import { promises as fs } from 'fs';
import path from 'path';

export interface FormSubmission {
  id: string;
  type: 'contact' | 'callback' | 'request';
  firstName?: string;
  lastName?: string;
  name?: string; // for callback form
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
  contacted?: boolean; // Whether the customer has been contacted
  referred?: boolean; // Whether the submission has been referred via email
  // Request form fields
  state?: string;
  propertyLocation?: string;
  mailingAddress?: string;
  hasStartCard?: string;
  wellPermit?: string;
  waterRightNumber?: string;
  wellPurpose?: string;
  wellType?: string;
  startMonth?: string;
  startYear?: string;
  constructionFinishDate?: string;
  includePumpBid?: string;
  requestType?: string;
  bookPhoneCall?: string;
  questions?: string;
}

// Check if we're in a Netlify environment
// Netlify sets various environment variables, and Lambda functions run in /var/task
// We can detect this by checking the path or environment variables
const isNetlify = 
  process.env.NETLIFY === 'true' || 
  process.env.NETLIFY_DEV === 'true' ||
  process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined ||
  typeof process.cwd === 'function' && process.cwd().includes('/var/task') ||
  process.env._?.includes('netlify') ||
  false; // Fallback to false if we can't detect

// Use /tmp in production (writable), data/ in development
// On Netlify/Lambda, /tmp is the only writable directory
// Check if we're in a Lambda/Netlify environment by checking the current working directory
const cwd = process.cwd();
const isLambdaOrNetlify = cwd.includes('/var/task') || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;

const STORAGE_DIR = isLambdaOrNetlify ? '/tmp' : path.join(cwd, 'data');
const SUBMISSIONS_FILE = isLambdaOrNetlify 
  ? '/tmp/submissions.json' 
  : path.join(STORAGE_DIR, 'submissions.json');

// Ensure storage directory exists
async function ensureStorageDir() {
  // /tmp already exists on Lambda/Netlify, no need to create it
  if (isLambdaOrNetlify) {
    return;
  }
  
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

// Load all submissions
export async function loadSubmissions(): Promise<FormSubmission[]> {
  // In production, try to load from both file system and Netlify Forms API
  if (isLambdaOrNetlify) {
    const fileSubmissions = await loadFromFileSystem();
    const netlifySubmissions = await loadFromNetlifyForms().catch(() => []);
    
    // Merge submissions, preferring file system for admin features (contacted/referred status)
    // Netlify Forms submissions will have those fields as false
    const merged = [...fileSubmissions];
    
    // Add Netlify Forms submissions that aren't already in file system
    for (const netlifySub of netlifySubmissions) {
      const exists = merged.find(s => 
        s.email === netlifySub.email && 
        s.timestamp === netlifySub.timestamp
      );
      if (!exists) {
        merged.push(netlifySub);
      }
    }
    
    // Sort by timestamp, newest first
    return merged.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
  
  // Local development - just use file system
  return loadFromFileSystem();
}

// Load submissions from file system
async function loadFromFileSystem(): Promise<FormSubmission[]> {
  try {
    await ensureStorageDir();
    
    // Check if file exists before trying to read
    try {
      await fs.access(SUBMISSIONS_FILE);
    } catch {
      // File doesn't exist yet, return empty array
      return [];
    }
    
    const data = await fs.readFile(SUBMISSIONS_FILE, 'utf-8');
    if (!data || data.trim() === '') {
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading from file system:', error);
    return [];
  }
}

// Load submissions from Netlify Forms API
async function loadFromNetlifyForms(): Promise<FormSubmission[]> {
  // Netlify provides these environment variables automatically
  const siteId = process.env.NETLIFY_SITE_ID;
  const accessToken = process.env.NETLIFY_AUTH_TOKEN;
  
  if (!siteId || !accessToken) {
    // If tokens aren't available, return empty array
    // This is normal - not all Netlify functions have access to these
    return [];
  }
  
  try {
    const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/submissions`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Netlify Forms API error:', response.status, response.statusText);
      return [];
    }
    
    const netlifySubmissions = await response.json();
    
    // Convert Netlify form submissions to our format
    return netlifySubmissions.map((sub: any) => convertNetlifySubmission(sub));
  } catch (error) {
    console.error('Error loading from Netlify Forms API:', error);
    return [];
  }
}

// Convert Netlify form submission to our format
function convertNetlifySubmission(netlifySub: any): FormSubmission {
  const data = netlifySub.data || {};
  
  // Determine submission type from form name
  let type: 'contact' | 'callback' | 'request' = 'contact';
  const formName = netlifySub.form_name || data['form-name'] || '';
  if (formName === 'callback' || formName.includes('callback')) type = 'callback';
  if (formName === 'request' || formName.includes('request')) type = 'request';
  
  // Extract all fields - Netlify Forms stores them in the data object
  return {
    id: netlifySub.id || generateId(),
    type,
    firstName: data.firstName || data['first-name'] || data.first_name,
    lastName: data.lastName || data['last-name'] || data.last_name,
    name: data.name,
    email: data.email || '',
    phone: data.phone,
    subject: data.subject,
    message: data.message || data.questions || '',
    timestamp: netlifySub.created_at || netlifySub.submitted_at || new Date().toISOString(),
    ip: netlifySub.ip,
    userAgent: netlifySub.user_agent,
    contacted: false, // Netlify Forms doesn't store this
    referred: false, // Netlify Forms doesn't store this
    state: data.state,
    propertyLocation: data.propertyLocation || data['property-location'] || data.property_location,
    mailingAddress: data.mailingAddress || data['mailing-address'] || data.mailing_address,
    hasStartCard: data.hasStartCard || data['has-start-card'] || data.has_start_card,
    wellPermit: data.wellPermit || data['well-permit'] || data.well_permit,
    waterRightNumber: data.waterRightNumber || data['water-right-number'] || data.water_right_number,
    wellPurpose: data.wellPurpose || data['well-purpose'] || data.well_purpose,
    wellType: data.wellType || data['well-type'] || data.well_type,
    startMonth: data.startMonth || data['start-month'] || data.start_month,
    startYear: data.startYear || data['start-year'] || data.start_year,
    constructionFinishDate: data.constructionFinishDate || data['construction-finish-date'] || data.construction_finish_date,
    includePumpBid: data.includePumpBid || data['include-pump-bid'] || data.include_pump_bid,
    requestType: data.requestType || data['request-type'] || data.request_type,
    bookPhoneCall: data.bookPhoneCall || data['book-phone-call'] || data.book_phone_call,
    questions: data.questions,
  };
}

// Save a new submission
export async function saveSubmission(submission: Omit<FormSubmission, 'id' | 'timestamp'>): Promise<FormSubmission> {
  const newSubmission: FormSubmission = {
    ...submission,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  
  // Try to save to file system (for admin panel)
  // If this fails, we don't throw - Netlify Forms will capture it anyway
  try {
    await ensureStorageDir();
    
    // Load existing submissions from file system only (not Netlify API)
    const existingSubmissions = await loadFromFileSystem();
    existingSubmissions.push(newSubmission);
    
    // Write to file system
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(existingSubmissions, null, 2), 'utf-8');
    console.log('Successfully saved submission to file system');
  } catch (error) {
    // Log the error but don't fail the request
    // Netlify Forms (with data-netlify="true") will capture the submission
    console.error('Warning: Failed to save submission to file system:', error);
    console.error('Storage directory:', STORAGE_DIR);
    console.error('Submissions file:', SUBMISSIONS_FILE);
    console.error('Is Lambda/Netlify:', isLambdaOrNetlify);
    console.error('Current working directory:', process.cwd());
    console.error('AWS_LAMBDA_FUNCTION_NAME:', process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error code:', (error as any).code);
      console.error('Error stack:', error.stack);
    }
    // Continue - the submission will still be captured by Netlify Forms
  }
  
  return newSubmission;
}

// Delete a submission
export async function deleteSubmission(id: string): Promise<boolean> {
  const submissions = await loadSubmissions();
  const filtered = submissions.filter(s => s.id !== id);
  
  if (filtered.length === submissions.length) {
    return false; // Submission not found
  }
  
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

// Update contacted status
export async function updateContactedStatus(id: string, contacted: boolean): Promise<boolean> {
  const submissions = await loadSubmissions();
  const submission = submissions.find(s => s.id === id);
  
  if (!submission) {
    return false; // Submission not found
  }
  
  submission.contacted = contacted;
  
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
  return true;
}

// Update referred status
export async function updateReferredStatus(id: string, referred: boolean): Promise<boolean> {
  const submissions = await loadSubmissions();
  const submission = submissions.find(s => s.id === id);
  
  if (!submission) {
    return false; // Submission not found
  }
  
  submission.referred = referred;
  
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
  return true;
}

// Generate a simple ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
