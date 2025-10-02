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

const STORAGE_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(STORAGE_DIR, 'submissions.json');

// Ensure storage directory exists
async function ensureStorageDir() {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

// Load all submissions
export async function loadSubmissions(): Promise<FormSubmission[]> {
  await ensureStorageDir();
  
  try {
    const data = await fs.readFile(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save a new submission
export async function saveSubmission(submission: Omit<FormSubmission, 'id' | 'timestamp'>): Promise<FormSubmission> {
  await ensureStorageDir();
  
  const submissions = await loadSubmissions();
  const newSubmission: FormSubmission = {
    ...submission,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  
  submissions.push(newSubmission);
  
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));
  
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

// Generate a simple ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
