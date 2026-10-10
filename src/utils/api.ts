import { Course, NewsItem, DoctorMember, AuditLogEntry, IdAllocation, ResourceItem } from '../types';
import { auth } from '../lib/firebase';

// Helper to get Firebase ID token if user is signed in
async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      return { Authorization: `Bearer ${token}` };
    }
  } catch {
    // Continue unauthenticated
  }
  return {};
}

// -------------------------------------------------------------
// ID Allocations (4,000 Keystore)
// -------------------------------------------------------------
export async function fetchIdAllocations(): Promise<IdAllocation[] | null> {
  try {
    const res = await fetch('/api/ids');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Falling back to local ID store:', err);
    return null;
  }
}

export async function syncIdAllocation(allocation: IdAllocation): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch('/api/ids/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(allocation),
    });
  } catch (err) {
    console.warn('Failed to sync ID allocation to Cloud SQL:', err);
  }
}

// -------------------------------------------------------------
// Courses (Read, Write, Delete)
// -------------------------------------------------------------
export async function fetchCourses(): Promise<Course[] | null> {
  try {
    const res = await fetch('/api/courses');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Falling back to local courses:', err);
    return null;
  }
}

export async function saveCourse(course: Course): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(course),
    });
  } catch (err) {
    console.warn('Failed to save course to Cloud SQL:', err);
  }
}

export async function deleteCourseFromCloud(id: string): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch(`/api/courses/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        ...headers,
      },
    });
  } catch (err) {
    console.error('Failed to delete course from Cloud SQL:', err);
  }
}

// -------------------------------------------------------------
// News (Read, Write, Delete)
// -------------------------------------------------------------
export async function fetchNews(): Promise<NewsItem[] | null> {
  try {
    const res = await fetch('/api/news');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Falling back to local news:', err);
    return null;
  }
}

export async function saveNews(item: NewsItem): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch('/api/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(item),
    });
  } catch (err) {
    console.warn('Failed to save news to Cloud SQL:', err);
  }
}

export async function deleteNewsFromCloud(id: string): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch(`/api/news/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        ...headers,
      },
    });
  } catch (err) {
    console.error('Failed to delete news from Cloud SQL:', err);
  }
}

// -------------------------------------------------------------
// Doctors (Read, Write, Delete)
// -------------------------------------------------------------
export async function fetchDoctors(): Promise<DoctorMember[] | null> {
  try {
    const res = await fetch('/api/doctors');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Falling back to local doctors:', err);
    return null;
  }
}

export async function saveDoctor(doc: DoctorMember): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch('/api/doctors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(doc),
    });
  } catch (err) {
    console.warn('Failed to save doctor to Cloud SQL:', err);
  }
}

export async function deleteDoctorFromCloud(id: string): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch(`/api/doctors/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        ...headers,
      },
    });
  } catch (err) {
    console.error('Failed to delete doctor from Cloud SQL:', err);
  }
}

// -------------------------------------------------------------
// Resources, Documents & Circulars (Read, Write, Delete)
// -------------------------------------------------------------
export async function fetchResources(): Promise<ResourceItem[] | null> {
  try {
    const res = await fetch('/api/resources');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Falling back to local resources:', err);
    return null;
  }
}

export async function saveResource(resource: ResourceItem): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch('/api/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(resource),
    });
  } catch (err) {
    console.warn('Failed to save resource to Cloud SQL:', err);
  }
}

export async function deleteResourceFromCloud(id: string): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch(`/api/resources/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        ...headers,
      },
    });
  } catch (err) {
    console.error('Failed to delete resource from Cloud SQL:', err);
  }
}

// -------------------------------------------------------------
// Audit Logs (Read, Write, Clear)
// -------------------------------------------------------------
export async function fetchAuditLogs(): Promise<AuditLogEntry[] | null> {
  try {
    const res = await fetch('/api/audit-logs');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Falling back to local audit logs:', err);
    return null;
  }
}

export async function logAuditEntry(log: AuditLogEntry): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch('/api/audit-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(log),
    });
  } catch (err) {
    console.warn('Failed to log audit entry to Cloud SQL:', err);
  }
}

export async function clearAuditLogsFromCloud(): Promise<void> {
  try {
    const headers = await getAuthHeader();
    await fetch('/api/audit-logs', {
      method: 'DELETE',
      headers: {
        ...headers,
      },
    });
  } catch (err) {
    console.error('Failed to clear audit logs from Cloud SQL:', err);
  }
}
