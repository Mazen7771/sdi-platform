export type Language = 'en' | 'ar';

export type AppPage = 
  | 'home' 
  | 'news' 
  | 'courses' 
  | 'doctors' 
  | 'conferences' 
  | 'resources' 
  | 'about' 
  | 'contact'
  | 'help';

export interface PrecreatedId {
  id: string; // e.g. "SDI-0001" to "SDI-4000"
  index: number;
  isIssued: boolean;
  isActivated: boolean;
  issuedAt?: string;
  activatedAt?: string;
  expiresAt?: string; // Yearly subscription expiry date (automatically deactivates after 1 year)
  isExpired?: boolean;
  assignedRole?: string;
  notes?: string;
}

export interface DoctorMember {
  id: string;
  name: string;
  nameAr?: string;
  title: string;
  titleAr?: string;
  roleCategory: string;
  roleCategoryAr?: string;
  specialty: string;
  specialtyAr?: string;
  hospital: string;
  hospitalAr?: string;
  imcNumber: string;
  standing: 'Active' | 'Under Review' | 'Fellow';
  standingAr?: string;
  cpdUnits: number;
  joinedYear: number;
  division?: 'Specialist Division' | 'General Division' | 'Trainee Specialist' | string;
  photoUrl?: string;
  email?: string;
  whatsapp?: string;
  bio?: string;
  bioAr?: string;
  cvPdfUrl?: string;     // Doctor CV / Verified Credentials Document
  cvPdfName?: string;    // Filename of uploaded CV/Credentials
  recordingUrl?: string; // Doctor Video Introduction, Clinical Speech or Lecture Link
}

export interface Course {
  id: string;
  cpdUnits: number;
  accessType: 'members' | 'open';
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  leadFaculty: string;
  leadFacultyAr: string;
  format: string;
  formatAr: string;
  cohort: string;
  cohortAr: string;
  syllabus: string[];
  syllabusAr: string[];
  imageUrl?: string;     // Course banner / thumbnail image
  recordingUrl?: string; // Recording stream link (YouTube, Zoom, Vimeo, Drive, or video URL)
  lessonUrl?: string;    // Live Virtual Classroom / Lesson link (Zoom, Google Meet, Teams)
  pdfUrl?: string;       // Attached Course Handbook / Slides / Syllabus PDF
  pdfName?: string;      // Filename of the uploaded PDF
}

export interface NewsItem {
  id: string;
  date: string;
  dateAr: string;
  location: string;
  locationAr: string;
  category: string;
  categoryAr: string;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  details: string;
  detailsAr: string;
  actionText: string;
  actionTextAr: string;
  imageUrl?: string;      // Uploaded picture / official decree banner
  pdfUrl?: string;        // Official circular or decree PDF
  pdfName?: string;       // Filename of the uploaded PDF
  recordingUrl?: string;  // Video briefing / speech / audio link
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  type: string;
  badgeClass: string;
  message: string;
}

export interface IdAllocation {
  id: string;
  status: 'Allocated' | 'Accredited' | 'Under Review' | 'Dormant' | 'Unissued' | 'Active';
  allocatedAt?: string;
  activatedAt?: string;
  expiresAt?: string;
  isExpired?: boolean;
  applicantName?: string;
  applicantEmail?: string;
  imcNumber?: string;
  roleCategory?: string;
  hospitalTrust?: string;
  tier?: 'General Tier' | 'Executive Fellow' | 'Specialist Honor';
  paymentStatus?: 'Awaiting Bank Transfer' | 'Reconciled & Paid' | 'Waived';
  isActivated?: boolean;
}

export interface ResourceItem {
  id: string;
  category: string;
  categoryAr?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  code: string;
  fileUrl?: string;
  imageUrl?: string;      // Infographic / Algorithm flowchart / Guideline image
  pdfUrl?: string;        // Attached clinical guideline / algorithm PDF
  pdfName?: string;       // Filename of uploaded PDF
  recordingUrl?: string;  // Clinical audio/video walkthrough link
}

export type ViewMode = 'public' | 'admin';
