import { db } from './index.ts';
import {
  coursesTable,
  newsTable,
  doctorsTable,
  auditLogsTable,
  idAllocationsTable,
  resourcesTable,
} from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { DOCTOR_REGISTRY, COURSES, NEWS_ITEMS, INITIAL_AUDIT_LOGS } from '../data.ts';
import { INITIAL_ID_ALLOCATIONS } from '../data/idAllocations.ts';
import { INITIAL_RESOURCES } from '../data/resources.ts';
import { Course, NewsItem, DoctorMember, AuditLogEntry, IdAllocation, ResourceItem } from '../types.ts';

// -------------------------------------------------------------
// ID Allocations Management
// -------------------------------------------------------------
export async function getAllIdAllocations(): Promise<IdAllocation[]> {
  try {
    const rows = await db.select().from(idAllocationsTable);
    if (rows.length === 0) {
      const seedData = INITIAL_ID_ALLOCATIONS.map((item) => ({
        credentialId: item.id,
        status: item.status,
        allocatedAt: item.allocatedAt || null,
        activatedAt: item.activatedAt || null,
        expiresAt: item.expiresAt || null,
        isExpired: item.isExpired || false,
        isActivated: item.isActivated || false,
        applicantName: item.applicantName || null,
        applicantEmail: item.applicantEmail || null,
        imcNumber: item.imcNumber || null,
        roleCategory: item.roleCategory || null,
        hospitalTrust: item.hospitalTrust || null,
        tier: item.tier || null,
        paymentStatus: item.paymentStatus || null,
      }));
      await db.insert(idAllocationsTable).values(seedData).onConflictDoNothing();
      const freshRows = await db.select().from(idAllocationsTable);
      return freshRows.map(mapIdAllocationRow);
    }
    return rows.map(mapIdAllocationRow);
  } catch (error) {
    console.error('Failed to get ID allocations from Cloud SQL:', error);
    throw new Error('Failed to retrieve ID allocations from database.', { cause: error });
  }
}

function mapIdAllocationRow(r: any): IdAllocation {
  return {
    id: r.credentialId,
    status: r.status as IdAllocation['status'],
    allocatedAt: r.allocatedAt || undefined,
    activatedAt: r.activatedAt || undefined,
    expiresAt: r.expiresAt || undefined,
    isExpired: r.isExpired,
    isActivated: r.isActivated,
    applicantName: r.applicantName || undefined,
    applicantEmail: r.applicantEmail || undefined,
    imcNumber: r.imcNumber || undefined,
    roleCategory: r.roleCategory || undefined,
    hospitalTrust: r.hospitalTrust || undefined,
    tier: r.tier as IdAllocation['tier'],
    paymentStatus: r.paymentStatus as IdAllocation['paymentStatus'],
  };
}

export async function upsertIdAllocation(item: IdAllocation) {
  try {
    const result = await db.insert(idAllocationsTable)
      .values({
        credentialId: item.id,
        status: item.status,
        allocatedAt: item.allocatedAt || null,
        activatedAt: item.activatedAt || null,
        expiresAt: item.expiresAt || null,
        isExpired: item.isExpired || false,
        isActivated: item.isActivated || false,
        applicantName: item.applicantName || null,
        applicantEmail: item.applicantEmail || null,
        imcNumber: item.imcNumber || null,
        roleCategory: item.roleCategory || null,
        hospitalTrust: item.hospitalTrust || null,
        tier: item.tier || null,
        paymentStatus: item.paymentStatus || null,
      })
      .onConflictDoUpdate({
        target: idAllocationsTable.credentialId,
        set: {
          status: item.status,
          allocatedAt: item.allocatedAt || null,
          activatedAt: item.activatedAt || null,
          expiresAt: item.expiresAt || null,
          isExpired: item.isExpired || false,
          isActivated: item.isActivated || false,
          applicantName: item.applicantName || null,
          applicantEmail: item.applicantEmail || null,
          imcNumber: item.imcNumber || null,
          roleCategory: item.roleCategory || null,
          hospitalTrust: item.hospitalTrust || null,
          tier: item.tier || null,
          paymentStatus: item.paymentStatus || null,
        },
      })
      .returning();
    return mapIdAllocationRow(result[0]);
  } catch (error) {
    console.error('Failed to upsert ID allocation:', error);
    throw new Error('Failed to update ID allocation in database.', { cause: error });
  }
}

// -------------------------------------------------------------
// Courses Management (Read, Write, Cloud Delete)
// -------------------------------------------------------------
export async function getCourses(): Promise<Course[]> {
  try {
    const rows = await db.select().from(coursesTable);
    if (rows.length === 0) {
      const seedData = COURSES.map((c) => ({
        id: c.id,
        title: c.title,
        titleAr: c.titleAr || null,
        description: c.description,
        descriptionAr: c.descriptionAr || null,
        format: c.format,
        formatAr: c.formatAr || null,
        cpdUnits: c.cpdUnits,
        cohort: c.cohort,
        cohortAr: c.cohortAr || null,
        leadFaculty: c.leadFaculty,
        leadFacultyAr: c.leadFacultyAr || null,
        accessType: c.accessType,
        syllabus: JSON.stringify(c.syllabus),
        syllabusAr: c.syllabusAr ? JSON.stringify(c.syllabusAr) : null,
      }));
      await db.insert(coursesTable).values(seedData).onConflictDoNothing();
      const freshRows = await db.select().from(coursesTable);
      return freshRows.map(mapCourseRow);
    }
    return rows.map(mapCourseRow);
  } catch (error) {
    console.error('Failed to get courses from Cloud SQL:', error);
    throw new Error('Failed to retrieve courses from database.', { cause: error });
  }
}

function mapCourseRow(r: any): Course {
  return {
    id: r.id,
    title: r.title,
    titleAr: r.titleAr || undefined,
    description: r.description,
    descriptionAr: r.descriptionAr || undefined,
    format: r.format,
    formatAr: r.formatAr || undefined,
    cpdUnits: r.cpdUnits,
    cohort: r.cohort,
    cohortAr: r.cohortAr || undefined,
    leadFaculty: r.leadFaculty,
    leadFacultyAr: r.leadFacultyAr || undefined,
    accessType: r.accessType as 'members' | 'open',
    syllabus: typeof r.syllabus === 'string' ? JSON.parse(r.syllabus) : r.syllabus,
    syllabusAr: r.syllabusAr ? (typeof r.syllabusAr === 'string' ? JSON.parse(r.syllabusAr) : r.syllabusAr) : undefined,
    imageUrl: r.imageUrl || undefined,
    recordingUrl: r.recordingUrl || undefined,
    lessonUrl: r.lessonUrl || undefined,
    pdfUrl: r.pdfUrl || undefined,
    pdfName: r.pdfName || undefined,
  };
}

export async function upsertCourse(course: Course) {
  try {
    const result = await db.insert(coursesTable)
      .values({
        id: course.id,
        title: course.title,
        titleAr: course.titleAr || null,
        description: course.description,
        descriptionAr: course.descriptionAr || null,
        format: course.format,
        formatAr: course.formatAr || null,
        cpdUnits: course.cpdUnits,
        cohort: course.cohort,
        cohortAr: course.cohortAr || null,
        leadFaculty: course.leadFaculty,
        leadFacultyAr: course.leadFacultyAr || null,
        accessType: course.accessType,
        syllabus: JSON.stringify(course.syllabus),
        syllabusAr: course.syllabusAr ? JSON.stringify(course.syllabusAr) : null,
        imageUrl: course.imageUrl || null,
        recordingUrl: course.recordingUrl || null,
        lessonUrl: course.lessonUrl || null,
        pdfUrl: course.pdfUrl || null,
        pdfName: course.pdfName || null,
      })
      .onConflictDoUpdate({
        target: coursesTable.id,
        set: {
          title: course.title,
          titleAr: course.titleAr || null,
          description: course.description,
          descriptionAr: course.descriptionAr || null,
          format: course.format,
          formatAr: course.formatAr || null,
          cpdUnits: course.cpdUnits,
          cohort: course.cohort,
          cohortAr: course.cohortAr || null,
          leadFaculty: course.leadFaculty,
          leadFacultyAr: course.leadFacultyAr || null,
          accessType: course.accessType,
          syllabus: JSON.stringify(course.syllabus),
          syllabusAr: course.syllabusAr ? JSON.stringify(course.syllabusAr) : null,
          imageUrl: course.imageUrl || null,
          recordingUrl: course.recordingUrl || null,
          lessonUrl: course.lessonUrl || null,
          pdfUrl: course.pdfUrl || null,
          pdfName: course.pdfName || null,
        },
      })
      .returning();
    return mapCourseRow(result[0]);
  } catch (error) {
    console.error('Failed to upsert course:', error);
    throw new Error('Failed to save course to database.', { cause: error });
  }
}

export async function deleteCourse(id: string): Promise<boolean> {
  try {
    const res = await db.delete(coursesTable).where(eq(coursesTable.id, id)).returning();
    return res.length > 0;
  } catch (error) {
    console.error('Failed to delete course from Cloud SQL:', error);
    throw new Error('Failed to delete course from database.', { cause: error });
  }
}

// -------------------------------------------------------------
// News Management (Read, Write, Cloud Delete)
// -------------------------------------------------------------
export async function getNews(): Promise<NewsItem[]> {
  try {
    const rows = await db.select().from(newsTable);
    if (rows.length === 0) {
      const seedData = NEWS_ITEMS.map((n) => ({
        id: n.id,
        title: n.title,
        titleAr: n.titleAr || null,
        summary: n.summary,
        summaryAr: n.summaryAr || null,
        details: n.details,
        detailsAr: n.detailsAr || null,
        date: n.date,
        dateAr: n.dateAr || null,
        category: n.category,
        categoryAr: n.categoryAr || null,
        location: n.location,
        locationAr: n.locationAr || null,
        actionText: n.actionText || null,
        actionTextAr: n.actionTextAr || null,
      }));
      await db.insert(newsTable).values(seedData).onConflictDoNothing();
      const freshRows = await db.select().from(newsTable);
      return freshRows.map(mapNewsRow);
    }
    return rows.map(mapNewsRow);
  } catch (error) {
    console.error('Failed to get news from Cloud SQL:', error);
    throw new Error('Failed to retrieve news from database.', { cause: error });
  }
}

function mapNewsRow(r: any): NewsItem {
  return {
    id: r.id,
    title: r.title,
    titleAr: r.titleAr || undefined,
    summary: r.summary,
    summaryAr: r.summaryAr || undefined,
    details: r.details,
    detailsAr: r.detailsAr || undefined,
    date: r.date,
    dateAr: r.dateAr || undefined,
    category: r.category,
    categoryAr: r.categoryAr || undefined,
    location: r.location,
    locationAr: r.locationAr || undefined,
    actionText: r.actionText || undefined,
    actionTextAr: r.actionTextAr || undefined,
    imageUrl: r.imageUrl || undefined,
    pdfUrl: r.pdfUrl || undefined,
    pdfName: r.pdfName || undefined,
    recordingUrl: r.recordingUrl || undefined,
  };
}

export async function upsertNews(item: NewsItem) {
  try {
    const result = await db.insert(newsTable)
      .values({
        id: item.id,
        title: item.title,
        titleAr: item.titleAr || null,
        summary: item.summary,
        summaryAr: item.summaryAr || null,
        details: item.details,
        detailsAr: item.detailsAr || null,
        date: item.date,
        dateAr: item.dateAr || null,
        category: item.category,
        categoryAr: item.categoryAr || null,
        location: item.location,
        locationAr: item.locationAr || null,
        actionText: item.actionText || null,
        actionTextAr: item.actionTextAr || null,
        imageUrl: item.imageUrl || null,
        pdfUrl: item.pdfUrl || null,
        pdfName: item.pdfName || null,
        recordingUrl: item.recordingUrl || null,
      })
      .onConflictDoUpdate({
        target: newsTable.id,
        set: {
          title: item.title,
          titleAr: item.titleAr || null,
          summary: item.summary,
          summaryAr: item.summaryAr || null,
          details: item.details,
          detailsAr: item.detailsAr || null,
          date: item.date,
          dateAr: item.dateAr || null,
          category: item.category,
          categoryAr: item.categoryAr || null,
          location: item.location,
          locationAr: item.locationAr || null,
          actionText: item.actionText || null,
          actionTextAr: item.actionTextAr || null,
          imageUrl: item.imageUrl || null,
          pdfUrl: item.pdfUrl || null,
          pdfName: item.pdfName || null,
          recordingUrl: item.recordingUrl || null,
        },
      })
      .returning();
    return mapNewsRow(result[0]);
  } catch (error) {
    console.error('Failed to upsert news dispatch:', error);
    throw new Error('Failed to save news to database.', { cause: error });
  }
}

export async function deleteNews(id: string): Promise<boolean> {
  try {
    const res = await db.delete(newsTable).where(eq(newsTable.id, id)).returning();
    return res.length > 0;
  } catch (error) {
    console.error('Failed to delete news from Cloud SQL:', error);
    throw new Error('Failed to delete news from database.', { cause: error });
  }
}

// -------------------------------------------------------------
// Doctors Roster Management (Read, Write, Cloud Delete)
// -------------------------------------------------------------
export async function getDoctors(): Promise<DoctorMember[]> {
  try {
    const rows = await db.select().from(doctorsTable);
    if (rows.length === 0) {
      const seedData = DOCTOR_REGISTRY.map((d) => ({
        id: d.id,
        name: d.name,
        nameAr: d.nameAr || null,
        title: d.title,
        titleAr: d.titleAr || null,
        roleCategory: d.roleCategory,
        roleCategoryAr: d.roleCategoryAr || null,
        specialty: d.specialty,
        specialtyAr: d.specialtyAr || null,
        hospital: d.hospital,
        hospitalAr: d.hospitalAr || null,
        division: d.division || '',
        standing: d.standing,
        standingAr: d.standingAr || null,
        imcNumber: d.imcNumber,
        cpdUnits: d.cpdUnits,
        joinedYear: d.joinedYear,
        photoUrl: d.photoUrl || null,
        email: d.email || null,
        whatsapp: d.whatsapp || null,
        bio: d.bio || null,
        bioAr: d.bioAr || null,
        cvPdfUrl: d.cvPdfUrl || null,
        cvPdfName: d.cvPdfName || null,
        recordingUrl: d.recordingUrl || null,
      }));
      await db.insert(doctorsTable).values(seedData).onConflictDoNothing();
      const freshRows = await db.select().from(doctorsTable);
      return freshRows.map(mapDoctorRow);
    }
    return rows.map(mapDoctorRow);
  } catch (error) {
    console.error('Failed to get doctors from Cloud SQL:', error);
    throw new Error('Failed to retrieve doctors registry.', { cause: error });
  }
}

function mapDoctorRow(r: any): DoctorMember {
  return {
    id: r.id,
    name: r.name,
    nameAr: r.nameAr || undefined,
    title: r.title,
    titleAr: r.titleAr || undefined,
    roleCategory: r.roleCategory,
    roleCategoryAr: r.roleCategoryAr || undefined,
    specialty: r.specialty,
    specialtyAr: r.specialtyAr || undefined,
    hospital: r.hospital,
    hospitalAr: r.hospitalAr || undefined,
    division: r.division as DoctorMember['division'],
    standing: r.standing as DoctorMember['standing'],
    standingAr: r.standingAr || undefined,
    imcNumber: r.imcNumber,
    cpdUnits: r.cpdUnits,
    joinedYear: r.joinedYear,
    photoUrl: r.photoUrl || undefined,
    email: r.email || undefined,
    whatsapp: r.whatsapp || undefined,
    bio: r.bio || undefined,
    bioAr: r.bioAr || undefined,
    cvPdfUrl: r.cvPdfUrl || undefined,
    cvPdfName: r.cvPdfName || undefined,
    recordingUrl: r.recordingUrl || undefined,
  };
}

export async function upsertDoctor(doc: DoctorMember) {
  try {
    const result = await db.insert(doctorsTable)
      .values({
        id: doc.id,
        name: doc.name,
        nameAr: doc.nameAr || null,
        title: doc.title,
        titleAr: doc.titleAr || null,
        roleCategory: doc.roleCategory,
        roleCategoryAr: doc.roleCategoryAr || null,
        specialty: doc.specialty,
        specialtyAr: doc.specialtyAr || null,
        hospital: doc.hospital,
        hospitalAr: doc.hospitalAr || null,
        division: doc.division || '',
        standing: doc.standing,
        standingAr: doc.standingAr || null,
        imcNumber: doc.imcNumber,
        cpdUnits: doc.cpdUnits,
        joinedYear: doc.joinedYear,
        photoUrl: doc.photoUrl || null,
        email: doc.email || null,
        whatsapp: doc.whatsapp || null,
        bio: doc.bio || null,
        bioAr: doc.bioAr || null,
        cvPdfUrl: doc.cvPdfUrl || null,
        cvPdfName: doc.cvPdfName || null,
        recordingUrl: doc.recordingUrl || null,
      })
      .onConflictDoUpdate({
        target: doctorsTable.id,
        set: {
          name: doc.name,
          nameAr: doc.nameAr || null,
          title: doc.title,
          titleAr: doc.titleAr || null,
          roleCategory: doc.roleCategory,
          roleCategoryAr: doc.roleCategoryAr || null,
          specialty: doc.specialty,
          specialtyAr: doc.specialtyAr || null,
          hospital: doc.hospital,
          hospitalAr: doc.hospitalAr || null,
          division: doc.division,
          standing: doc.standing,
          standingAr: doc.standingAr || null,
          imcNumber: doc.imcNumber,
          cpdUnits: doc.cpdUnits,
          joinedYear: doc.joinedYear,
          photoUrl: doc.photoUrl || null,
          email: doc.email || null,
          whatsapp: doc.whatsapp || null,
          bio: doc.bio || null,
          bioAr: doc.bioAr || null,
          cvPdfUrl: doc.cvPdfUrl || null,
          cvPdfName: doc.cvPdfName || null,
          recordingUrl: doc.recordingUrl || null,
        },
      })
      .returning();
    return mapDoctorRow(result[0]);
  } catch (error) {
    console.error('Failed to upsert doctor:', error);
    throw new Error('Failed to update doctor profile.', { cause: error });
  }
}

export async function deleteDoctor(id: string): Promise<boolean> {
  try {
    const res = await db.delete(doctorsTable).where(eq(doctorsTable.id, id)).returning();
    return res.length > 0;
  } catch (error) {
    console.error('Failed to delete doctor from Cloud SQL:', error);
    throw new Error('Failed to delete doctor from database.', { cause: error });
  }
}

// -------------------------------------------------------------
// Resources & Documents Vault (Read, Write, Cloud Delete)
// -------------------------------------------------------------
export async function getResources(): Promise<ResourceItem[]> {
  try {
    const rows = await db.select().from(resourcesTable);
    if (rows.length === 0) {
      const seedData = INITIAL_RESOURCES.map((r) => ({
        id: r.id,
        category: r.category,
        categoryAr: r.categoryAr || null,
        title: r.title,
        titleAr: r.titleAr || null,
        description: r.description,
        descriptionAr: r.descriptionAr || null,
        code: r.code,
        fileUrl: r.fileUrl || null,
      }));
      await db.insert(resourcesTable).values(seedData).onConflictDoNothing();
      const freshRows = await db.select().from(resourcesTable);
      return freshRows.map(mapResourceRow);
    }
    return rows.map(mapResourceRow);
  } catch (error) {
    console.error('Failed to get resources from Cloud SQL:', error);
    throw new Error('Failed to retrieve resources from database.', { cause: error });
  }
}

function mapResourceRow(r: any): ResourceItem {
  return {
    id: r.id,
    category: r.category,
    categoryAr: r.categoryAr || undefined,
    title: r.title,
    titleAr: r.titleAr || undefined,
    description: r.description,
    descriptionAr: r.descriptionAr || undefined,
    code: r.code,
    fileUrl: r.fileUrl || undefined,
    imageUrl: r.imageUrl || undefined,
    pdfUrl: r.pdfUrl || undefined,
    pdfName: r.pdfName || undefined,
    recordingUrl: r.recordingUrl || undefined,
  };
}

export async function upsertResource(res: ResourceItem) {
  try {
    const result = await db.insert(resourcesTable)
      .values({
        id: res.id,
        category: res.category,
        categoryAr: res.categoryAr || null,
        title: res.title,
        titleAr: res.titleAr || null,
        description: res.description,
        descriptionAr: res.descriptionAr || null,
        code: res.code,
        fileUrl: res.fileUrl || null,
        imageUrl: res.imageUrl || null,
        pdfUrl: res.pdfUrl || null,
        pdfName: res.pdfName || null,
        recordingUrl: res.recordingUrl || null,
      })
      .onConflictDoUpdate({
        target: resourcesTable.id,
        set: {
          category: res.category,
          categoryAr: res.categoryAr || null,
          title: res.title,
          titleAr: res.titleAr || null,
          description: res.description,
          descriptionAr: res.descriptionAr || null,
          code: res.code,
          fileUrl: res.fileUrl || null,
          imageUrl: res.imageUrl || null,
          pdfUrl: res.pdfUrl || null,
          pdfName: res.pdfName || null,
          recordingUrl: res.recordingUrl || null,
        },
      })
      .returning();
    return mapResourceRow(result[0]);
  } catch (error) {
    console.error('Failed to upsert resource:', error);
    throw new Error('Failed to save document to database.', { cause: error });
  }
}

export async function deleteResource(id: string): Promise<boolean> {
  try {
    const res = await db.delete(resourcesTable).where(eq(resourcesTable.id, id)).returning();
    return res.length > 0;
  } catch (error) {
    console.error('Failed to delete resource from Cloud SQL:', error);
    throw new Error('Failed to delete document from database.', { cause: error });
  }
}

// -------------------------------------------------------------
// Audit Logs Management
// -------------------------------------------------------------
export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const rows = await db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.createdAt));
    if (rows.length === 0) {
      const seedData = INITIAL_AUDIT_LOGS.map((l) => ({
        id: l.id,
        timestamp: l.timestamp,
        type: l.type,
        badgeClass: l.badgeClass,
        message: l.message,
      }));
      await db.insert(auditLogsTable).values(seedData).onConflictDoNothing();
      const freshRows = await db.select().from(auditLogsTable).orderBy(desc(auditLogsTable.createdAt));
      return freshRows.map((r) => ({
        id: r.id,
        timestamp: r.timestamp,
        type: r.type,
        badgeClass: r.badgeClass,
        message: r.message,
      }));
    }
    return rows.map((r) => ({
      id: r.id,
      timestamp: r.timestamp,
      type: r.type,
      badgeClass: r.badgeClass,
      message: r.message,
    }));
  } catch (error) {
    console.error('Failed to get audit logs from Cloud SQL:', error);
    throw new Error('Failed to retrieve audit trail.', { cause: error });
  }
}

export async function insertAuditLog(log: AuditLogEntry) {
  try {
    const result = await db.insert(auditLogsTable)
      .values({
        id: log.id,
        timestamp: log.timestamp,
        type: log.type,
        badgeClass: log.badgeClass,
        message: log.message,
      })
      .onConflictDoNothing()
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Failed to insert audit log:', error);
    throw new Error('Failed to record audit log.', { cause: error });
  }
}

export async function clearAuditLogs(): Promise<void> {
  try {
    await db.delete(auditLogsTable);
  } catch (error) {
    console.error('Failed to clear audit logs from Cloud SQL:', error);
    throw new Error('Failed to clear audit trail.', { cause: error });
  }
}
