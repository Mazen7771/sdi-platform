/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Language, AppPage, Course, NewsItem, DoctorMember, AuditLogEntry, IdAllocation, PrecreatedId } from './types';
import { DOCTOR_REGISTRY, COURSES, NEWS_ITEMS, INITIAL_AUDIT_LOGS } from './data';
import { INITIAL_ID_ALLOCATIONS } from './data/idAllocations';
import { getCurrentSessionId, checkIsActivated, load4000Ids } from './data/idStore';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CreateAccountModal } from './components/CreateAccountModal';
import { CourseModal } from './components/CourseModal';
import { NewsModal } from './components/NewsModal';
import { DoctorProfileModal } from './components/DoctorProfileModal';
import { AdminConsole } from './components/AdminConsole';
import { AdminAuthModal, ADMIN_AUTH_KEY } from './components/AdminAuthModal';
import { useScrollRevealEngine } from './components/ScrollReveal';
import {
  fetchNews,
  fetchCourses,
  fetchDoctors,
  fetchAuditLogs,
  fetchIdAllocations,
  fetchResources,
  saveNews,
  deleteNewsFromCloud,
  saveCourse,
  deleteCourseFromCloud,
  saveDoctor,
  deleteDoctorFromCloud,
  saveResource,
  deleteResourceFromCloud,
  logAuditEntry,
  clearAuditLogsFromCloud,
  syncIdAllocation,
} from './utils/api';
import { INITIAL_RESOURCES } from './data/resources';
import { ResourceItem } from './types';

// Dedicated Pages
import { HomePage } from './pages/HomePage';
import { NewsPage } from './pages/NewsPage';
import { CoursesPage } from './pages/CoursesPage';
import { DoctorsPage } from './pages/DoctorsPage';
import { ConferencesPage } from './pages/ConferencesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { HelpPage } from './pages/HelpPage';

const STORAGE_KEYS = {
  NEWS: 'sdi_registry_news_v2',
  COURSES: 'sdi_registry_courses_v2',
  DOCTORS: 'sdi_registry_doctors_v2',
  LOGS: 'sdi_registry_audit_logs_v2',
  IDS: 'sdi_registry_id_allocations_v2',
  RESOURCES: 'sdi_registry_resources_v2',
};

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [isAdminView, setIsAdminView] = useState(false);
  const [adminAuthModalOpen, setAdminAuthModalOpen] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);

  // Active Session ID from the 4,000 IDs pool
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => getCurrentSessionId());
  const [isActivated, setIsActivated] = useState<boolean>(() => checkIsActivated(currentSessionId));

  // Detail Modals state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorMember | null>(null);

  // Synchronize active ID status
  const refreshSessionStatus = () => {
    const id = getCurrentSessionId();
    setCurrentSessionId(id);
    setIsActivated(checkIsActivated(id));
  };

  useEffect(() => {
    refreshSessionStatus();
  }, [currentPage, isAdminView]);

  // Universal presentation scroll reveal engine: texts appear sequentially as user scrolls down
  useScrollRevealEngine([currentPage, isAdminView]);

  // Dynamic shared entities with localStorage persistence
  const [news, setNews] = useState<NewsItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      return saved ? JSON.parse(saved) : NEWS_ITEMS;
    } catch {
      return NEWS_ITEMS;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
      return saved ? JSON.parse(saved) : COURSES;
    } catch {
      return COURSES;
    }
  });

  const [doctors, setDoctors] = useState<DoctorMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      return saved ? JSON.parse(saved) : DOCTOR_REGISTRY;
    } catch {
      return DOCTOR_REGISTRY;
    }
  });

  const [resources, setResources] = useState<ResourceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [idAllocations, setIdAllocations] = useState<IdAllocation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.IDS);
      return saved ? JSON.parse(saved) : INITIAL_ID_ALLOCATIONS;
    } catch {
      return INITIAL_ID_ALLOCATIONS;
    }
  });

  // Global broadcast toast for admin action awareness
  const [broadcastToast, setBroadcastToast] = useState<{
    message: string;
    type: 'news' | 'course' | 'member';
  } | null>(null);

  // Initial Cloud SQL Database Synchronization
  useEffect(() => {
    async function loadCloudSqlData() {
      try {
        const [sqlNews, sqlCourses, sqlDoctors, sqlLogs, sqlIds, sqlResources] = await Promise.all([
          fetchNews(),
          fetchCourses(),
          fetchDoctors(),
          fetchAuditLogs(),
          fetchIdAllocations(),
          fetchResources(),
        ]);
        if (sqlNews && sqlNews.length > 0) setNews(sqlNews);
        if (sqlCourses && sqlCourses.length > 0) setCourses(sqlCourses);
        if (sqlDoctors && sqlDoctors.length > 0) setDoctors(sqlDoctors);
        if (sqlLogs && sqlLogs.length > 0) setAuditLogs(sqlLogs);
        if (sqlIds && sqlIds.length > 0) setIdAllocations(sqlIds);
        if (sqlResources && sqlResources.length > 0) setResources(sqlResources);
      } catch (err) {
        console.warn('Initial Cloud SQL sync skipped:', err);
      }
    }
    loadCloudSqlData();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
    } catch (e) {
      console.error('Failed to sync news to localStorage', e);
    }
  }, [news]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to sync courses to localStorage', e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    } catch (e) {
      console.error('Failed to sync doctors to localStorage', e);
    }
  }, [doctors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
    } catch (e) {
      console.error('Failed to sync resources to localStorage', e);
    }
  }, [resources]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
    } catch (e) {
      console.error('Failed to sync audit logs to localStorage', e);
    }
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.IDS, JSON.stringify(idAllocations));
    } catch (e) {
      console.error('Failed to sync ID allocations to localStorage', e);
    }
  }, [idAllocations]);

  // Sync HTML language & direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (lang === 'ar') {
      document.body.style.fontFamily = "'Noto Sans Arabic', 'Inter', sans-serif";
    } else {
      document.body.style.fontFamily = "'Inter', sans-serif";
    }
  }, [lang]);

  // Handlers for Admin actions that propagate to users & Cloud SQL
  const handleAddNews = (newItem: NewsItem) => {
    setNews((prev) => {
      const exists = prev.some((n) => n.id === newItem.id);
      return exists ? prev.map((n) => (n.id === newItem.id ? newItem : n)) : [newItem, ...prev];
    });
    saveNews(newItem);
    setBroadcastToast({
      message: lang === 'ar' ? `تم نشر الخبر بنجاح في قاعدة البيانات: "${newItem.titleAr || newItem.title}"` : `Published news article to Cloud SQL: "${newItem.title}"`,
      type: 'news'
    });
    setTimeout(() => setBroadcastToast(null), 5000);
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => {
      const exists = prev.some((c) => c.id === newCourse.id);
      return exists ? prev.map((c) => (c.id === newCourse.id ? newCourse : c)) : [newCourse, ...prev];
    });
    saveCourse(newCourse);
    setBroadcastToast({
      message: lang === 'ar' ? `تم إضافة درس/اجتماع جديد في قاعدة البيانات: "${newCourse.titleAr || newCourse.title}"` : `Added lecture/masterclass to Cloud SQL: "${newCourse.title}"`,
      type: 'course'
    });
    setTimeout(() => setBroadcastToast(null), 5000);
  };

  const handleAddDoctor = (newDoc: DoctorMember) => {
    setDoctors((prev) => {
      const exists = prev.some((d) => d.id === newDoc.id);
      return exists ? prev.map((d) => (d.id === newDoc.id ? newDoc : d)) : [newDoc, ...prev];
    });
    saveDoctor(newDoc);
    setBroadcastToast({
      message: lang === 'ar' ? `تم اعتماد الطبيب في السجل وقاعدة البيانات: "${newDoc.nameAr || newDoc.name}"` : `Clinician accredited to Cloud SQL registry: "${newDoc.name}"`,
      type: 'member'
    });
    setTimeout(() => setBroadcastToast(null), 5000);
  };

  const handleDeleteNews = (newsId: string) => {
    setNews((prev) => prev.filter((item) => item.id !== newsId));
    deleteNewsFromCloud(newsId);
    setBroadcastToast({
      message: lang === 'ar' ? 'تم حذف الخبر/البيان نهائياً من قاعدة البيانات السحابية' : 'News bulletin deleted permanently from Cloud SQL',
      type: 'news'
    });
    setTimeout(() => setBroadcastToast(null), 4000);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    deleteCourseFromCloud(courseId);
    setBroadcastToast({
      message: lang === 'ar' ? 'تم حذف الدورة/المحاضرة نهائياً من قاعدة البيانات السحابية' : 'Course deleted permanently from Cloud SQL',
      type: 'course'
    });
    setTimeout(() => setBroadcastToast(null), 4000);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    saveCourse(updatedCourse);
    setBroadcastToast({
      message: lang === 'ar' ? `تم تحديث بيانات الدورة: "${updatedCourse.titleAr || updatedCourse.title}"` : `Course updated: "${updatedCourse.title}"`,
      type: 'course'
    });
    setTimeout(() => setBroadcastToast(null), 4000);
  };

  const handleUpdateDoctor = (updatedDoc: DoctorMember) => {
    setDoctors((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
    saveDoctor(updatedDoc);
    setBroadcastToast({
      message: lang === 'ar' ? `تم تحديث ملف الطبيب: "${updatedDoc.nameAr || updatedDoc.name}"` : `Doctor profile updated in Cloud SQL: "${updatedDoc.name}"`,
      type: 'member'
    });
    setTimeout(() => setBroadcastToast(null), 4000);
  };

  const handleDeleteDoctor = (docId: string) => {
    setDoctors((prev) => prev.filter((d) => d.id !== docId));
    deleteDoctorFromCloud(docId);
    setBroadcastToast({
      message: lang === 'ar' ? 'تم حذف الطبيب نهائياً من السجل وقاعدة البيانات السحابية' : 'Clinician removed from Cloud SQL registry',
      type: 'member'
    });
    setTimeout(() => setBroadcastToast(null), 4000);
  };

  const handleAddResource = (newRes: ResourceItem) => {
    setResources((prev) => {
      const exists = prev.some((r) => r.id === newRes.id);
      return exists ? prev.map((r) => (r.id === newRes.id ? newRes : r)) : [newRes, ...prev];
    });
    saveResource(newRes);
    setBroadcastToast({
      message: lang === 'ar' ? `تم رفع وحفظ الوثيقة في قاعدة البيانات: "${newRes.titleAr || newRes.title}"` : `Document saved to Cloud SQL: "${newRes.title}"`,
      type: 'course'
    });
    setTimeout(() => setBroadcastToast(null), 5000);
  };

  const handleDeleteResource = (resId: string) => {
    setResources((prev) => prev.filter((r) => r.id !== resId));
    deleteResourceFromCloud(resId);
    setBroadcastToast({
      message: lang === 'ar' ? 'تم حذف الوثيقة نهائياً من قاعدة البيانات السحابية' : 'Document deleted permanently from Cloud SQL',
      type: 'course'
    });
    setTimeout(() => setBroadcastToast(null), 4000);
  };

  const handleAddAuditLog = (entry: AuditLogEntry) => {
    setAuditLogs((prev) => [entry, ...prev]);
    logAuditEntry(entry);
  };

  const handleClearAuditLogs = () => {
    setAuditLogs([]);
    clearAuditLogsFromCloud();
  };

  // Admin Access Protection Handlers
  const handleRequestAdminAccess = () => {
    const isAuthed = sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    if (isAuthed) {
      setIsAdminView(true);
    } else {
      setAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setAdminAuthModalOpen(false);
    setIsAdminView(true);
  };

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setIsAdminView(false);
    refreshSessionStatus();
    setBroadcastToast({
      message: lang === 'ar' ? 'تم قفل لوحة تحكم الإدارة وتأمين الجلسة بنجاح.' : 'Admin console locked and session secured successfully.',
      type: 'news'
    });
    setTimeout(() => setBroadcastToast(null), 4000);
  };

  const handleUpdateIdAllocation = (updated: IdAllocation) => {
    setIdAllocations((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    syncIdAllocation(updated);
    refreshSessionStatus();
  };

  const handleAccountCreated = (assigned: PrecreatedId) => {
    setCurrentSessionId(assigned.id);
    setIsActivated(assigned.isActivated);
    syncIdAllocation({
      id: assigned.id,
      status: assigned.isActivated ? 'Accredited' : 'Under Review',
      allocatedAt: assigned.issuedAt,
      activatedAt: assigned.activatedAt,
      expiresAt: assigned.expiresAt,
      isExpired: assigned.isExpired,
      isActivated: assigned.isActivated,
      applicantName: `Credential Holder ${assigned.id}`,
      tier: assigned.isActivated ? 'Executive Fellow' : 'General Tier',
      paymentStatus: assigned.isActivated ? 'Reconciled & Paid' : 'Awaiting Bank Transfer',
    });
    refreshSessionStatus();
  };

  return (
    <div className={`min-h-screen bg-[#fafaf9] text-slate-900 relative selection:bg-slate-900 selection:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}>
      {/* Subtle Architectural Precision Grid */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:5rem_5rem]"></div>

      {/* High-Performance Static Water Ambient Canvas (0 CPU/GPU Cost) */}
      <div className="fixed inset-0 pointer-events-none -z-10 water-ambient-canvas"></div>

      {/* Real-time Broadcast Toast */}
      {broadcastToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4">
          <div className="optical-glass px-4 py-3 rounded-2xl border border-emerald-500/40 shadow-xl flex items-center justify-between gap-3 bg-emerald-50/95 text-emerald-950 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
              <span>{broadcastToast.message}</span>
            </div>
            <button
              onClick={() => setBroadcastToast(null)}
              className="text-emerald-700 hover:text-emerald-950 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Quick Admin Quick Bar indicator when browsing public site */}
      {!isAdminView && (
        <aside aria-label="SDI Quick Switcher" className="fixed bottom-4 right-4 z-40">
          <button
            onClick={handleRequestAdminAccess}
            className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-slate-900 text-white font-mono text-xs font-semibold shadow-2xl hover:bg-black hover:scale-105 transition-all border border-slate-700"
            title="Open SDI Secretariat Administration Console (Password Protected: 18990sdi@)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="material-symbols-outlined text-[16px] text-emerald-400">admin_panel_settings</span>
            <span className="hidden sm:inline">{lang === 'ar' ? 'لوحة تحكم المشرف' : 'Admin Console'}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] text-slate-300 font-mono">
              Protected
            </span>
          </button>
        </aside>
      )}

      {/* IF ADMIN CONSOLE IS ACTIVE */}
      {isAdminView ? (
        <AdminConsole
          lang={lang}
          onCloseAdmin={() => {
            setIsAdminView(false);
            refreshSessionStatus();
          }}
          onLogoutAdmin={handleLogoutAdmin}
          doctors={doctors}
          courses={courses}
          news={news}
          resources={resources}
          auditLogs={auditLogs}
          idAllocations={idAllocations}
          onUpdateIdAllocation={handleUpdateIdAllocation}
          onAddNews={handleAddNews}
          onDeleteNews={handleDeleteNews}
          onAddCourse={handleAddCourse}
          onUpdateCourse={handleUpdateCourse}
          onDeleteCourse={handleDeleteCourse}
          onAddDoctor={handleAddDoctor}
          onUpdateDoctor={handleUpdateDoctor}
          onDeleteDoctor={handleDeleteDoctor}
          onAddResource={handleAddResource}
          onDeleteResource={handleDeleteResource}
          onAddAuditLog={handleAddAuditLog}
          onClearAuditLogs={handleClearAuditLogs}
        />
      ) : (
        /* PUBLIC MULTI-PAGE APPLICATION */
        <>
          {/* BRIGHT AVENUE STYLE PRECISION HEADER */}
          <Header
            lang={lang}
            onToggleLang={setLang}
            currentPage={currentPage}
            onNavigate={(page) => setCurrentPage(page)}
            onOpenCreateAccount={() => setCreateAccountModalOpen(true)}
            onOpenAdmin={handleRequestAdminAccess}
            doctors={doctors}
            courses={courses}
            news={news}
            onSelectDoctor={(doc) => setSelectedDoctor(doc)}
            onSelectCourse={(course) => setSelectedCourse(course)}
            onSelectNews={(item) => setSelectedNews(item)}
          />

          {/* DEDICATED SEPARATE PAGES ROUTING */}
          <main className="w-full pt-32 sm:pt-36 lg:pt-28 pb-16">
            {currentPage === 'home' && (
              <HomePage
                lang={lang}
                onNavigate={(page) => setCurrentPage(page)}
                onOpenCreateAccount={() => setCreateAccountModalOpen(true)}
                news={news}
                courses={courses}
                doctors={doctors}
                onSelectNews={(item) => setSelectedNews(item)}
                onSelectCourse={(course) => setSelectedCourse(course)}
                currentId={currentSessionId}
                isActivated={isActivated}
              />
            )}

            {currentPage === 'news' && (
              <NewsPage
                lang={lang}
                news={news}
                onSelectNews={(item) => setSelectedNews(item)}
                currentId={currentSessionId}
                isActivated={isActivated}
              />
            )}

            {currentPage === 'courses' && (
              <CoursesPage
                lang={lang}
                courses={courses}
                onSelectCourse={(course) => setSelectedCourse(course)}
                isActivated={isActivated}
                onNavigate={(page) => setCurrentPage(page)}
                onOpenCreateAccount={() => setCreateAccountModalOpen(true)}
                onRequestAdmin={handleRequestAdminAccess}
              />
            )}

            {currentPage === 'doctors' && (
              <DoctorsPage
                lang={lang}
                doctors={doctors}
                onSelectDoctor={(doc) => setSelectedDoctor(doc)}
                isActivated={isActivated}
                onNavigate={(page) => setCurrentPage(page)}
                onOpenCreateAccount={() => setCreateAccountModalOpen(true)}
                onRequestAdmin={handleRequestAdminAccess}
              />
            )}

            {currentPage === 'conferences' && (
              <ConferencesPage
                lang={lang}
                isActivated={isActivated}
                onNavigate={(page) => setCurrentPage(page)}
                onOpenCreateAccount={() => setCreateAccountModalOpen(true)}
                onRequestAdmin={handleRequestAdminAccess}
              />
            )}

            {currentPage === 'resources' && (
              <ResourcesPage
                lang={lang}
                isActivated={isActivated}
                resources={resources}
                onNavigate={(page) => setCurrentPage(page)}
                onOpenCreateAccount={() => setCreateAccountModalOpen(true)}
                onRequestAdmin={handleRequestAdminAccess}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage lang={lang} />
            )}

            {currentPage === 'contact' && (
              <ContactPage
                lang={lang}
                doctors={doctors}
              />
            )}

            {currentPage === 'help' && (
              <HelpPage
                lang={lang}
                onNavigate={(page) => setCurrentPage(page)}
                onOpenCreateAccount={() => setCreateAccountModalOpen(true)}
                onRequestAdmin={handleRequestAdminAccess}
              />
            )}
          </main>

          {/* DEDICATED BRIGHT AVENUE STYLE FOOTER */}
          <Footer
            lang={lang}
            onNavigate={(page) => setCurrentPage(page)}
            onOpenCreateAccount={() => setCreateAccountModalOpen(true)}
            onOpenAdmin={handleRequestAdminAccess}
          />
        </>
      )}

      {/* 4,000 PRECREATED ID ISSUANCE MODAL */}
      <CreateAccountModal
        isOpen={createAccountModalOpen}
        onClose={() => {
          setCreateAccountModalOpen(false);
          refreshSessionStatus();
        }}
        lang={lang}
        onAccountCreated={handleAccountCreated}
      />

      {/* ADMIN AUTH MODAL */}
      <AdminAuthModal
        isOpen={adminAuthModalOpen}
        onClose={() => setAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        lang={lang}
      />

      {/* DETAIL MODALS */}
      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        lang={lang}
      />

      <NewsModal
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
        lang={lang}
      />

      <DoctorProfileModal
        doctor={selectedDoctor}
        onClose={() => setSelectedDoctor(null)}
        lang={lang}
      />
    </div>
  );
}
