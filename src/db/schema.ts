import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table authenticated via Firebase Auth
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  credentialId: text('credential_id'), // Linked sovereign SDI ID
  role: text('role').default('member'), // 'member' | 'admin'
  createdAt: timestamp('created_at').defaultNow(),
});

// 4,000 Sovereign ID Allocations Pool & Lifecycle
export const idAllocationsTable = pgTable('id_allocations', {
  id: serial('id').primaryKey(),
  credentialId: text('credential_id').notNull().unique(), // SDI-0001 to SDI-4000
  status: text('status').default('Unissued').notNull(),
  allocatedAt: text('allocated_at'),
  activatedAt: text('activated_at'),
  expiresAt: text('expires_at'),
  isExpired: boolean('is_expired').default(false).notNull(),
  isActivated: boolean('is_activated').default(false).notNull(),
  applicantName: text('applicant_name'),
  applicantEmail: text('applicant_email'),
  imcNumber: text('imc_number'),
  roleCategory: text('role_category'),
  hospitalTrust: text('hospital_trust'),
  tier: text('tier'),
  paymentStatus: text('payment_status'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Doctors Registry
export const doctorsTable = pgTable('doctors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameAr: text('name_ar'),
  title: text('title').notNull(),
  titleAr: text('title_ar'),
  roleCategory: text('role_category').default('Specialist').notNull(),
  roleCategoryAr: text('role_category_ar'),
  specialty: text('specialty').notNull(),
  specialtyAr: text('specialty_ar'),
  hospital: text('hospital').notNull(),
  hospitalAr: text('hospital_ar'),
  division: text('division').notNull(),
  standing: text('standing').notNull(),
  standingAr: text('standing_ar'),
  imcNumber: text('imc_number').notNull(),
  cpdUnits: integer('cpd_units').default(0).notNull(),
  joinedYear: integer('joined_year').default(2026).notNull(),
  photoUrl: text('photo_url'),
  email: text('email'),
  whatsapp: text('whatsapp'),
  bio: text('bio'),
  bioAr: text('bio_ar'),
  cvPdfUrl: text('cv_pdf_url'),
  cvPdfName: text('cv_pdf_name'),
  recordingUrl: text('recording_url'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Clinical Masterclasses & Courses
export const coursesTable = pgTable('courses', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  titleAr: text('title_ar'),
  description: text('description').notNull(),
  descriptionAr: text('description_ar'),
  format: text('format').notNull(),
  formatAr: text('format_ar'),
  cpdUnits: integer('cpd_units').default(0).notNull(),
  cohort: text('cohort').notNull(),
  cohortAr: text('cohort_ar'),
  leadFaculty: text('lead_faculty').notNull(),
  leadFacultyAr: text('lead_faculty_ar'),
  accessType: text('access_type').default('members').notNull(),
  syllabus: text('syllabus').notNull(), // JSON string array
  syllabusAr: text('syllabus_ar'),
  imageUrl: text('image_url'),
  recordingUrl: text('recording_url'),
  lessonUrl: text('lesson_url'),
  pdfUrl: text('pdf_url'),
  pdfName: text('pdf_name'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Official Executive Bulletins & News
export const newsTable = pgTable('news', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  titleAr: text('title_ar'),
  summary: text('summary').notNull(),
  summaryAr: text('summary_ar'),
  details: text('details').notNull(),
  detailsAr: text('details_ar'),
  date: text('date').notNull(),
  dateAr: text('date_ar'),
  category: text('category').notNull(),
  categoryAr: text('category_ar'),
  location: text('location').notNull(),
  locationAr: text('location_ar'),
  actionText: text('action_text'),
  actionTextAr: text('action_text_ar'),
  imageUrl: text('image_url'),
  pdfUrl: text('pdf_url'),
  pdfName: text('pdf_name'),
  recordingUrl: text('recording_url'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Cryptographic Secretariat Audit Logs
export const auditLogsTable = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  type: text('type').notNull(),
  badgeClass: text('badge_class').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Clinical Guidelines, Documents & Circulars Vault
export const resourcesTable = pgTable('resources', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  categoryAr: text('category_ar'),
  title: text('title').notNull(),
  titleAr: text('title_ar'),
  description: text('description').notNull(),
  descriptionAr: text('description_ar'),
  code: text('code').notNull(),
  fileUrl: text('file_url'),
  imageUrl: text('image_url'),
  pdfUrl: text('pdf_url'),
  pdfName: text('pdf_name'),
  recordingUrl: text('recording_url'),
  updatedAt: timestamp('updated_at').defaultNow(),
});
