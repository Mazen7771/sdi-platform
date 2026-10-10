import React, { useState } from 'react';
import { DoctorMember, Course, NewsItem, AuditLogEntry, Language, IdAllocation, PrecreatedId, ResourceItem } from '../types';
import { exportDoctorsPDF, exportCoursesPDF, exportConsolidatedReportPDF } from '../utils/pdfExport';
import { RealtimeDashboardCharts } from './RealtimeDashboardCharts';
import { load4000Ids, activateId, deactivateId, renewSubscription, simulateExpiration, getSubscriptionInfo, ID_POOL_SIZE } from '../data/idStore';

interface AdminConsoleProps {
  lang: Language;
  onCloseAdmin: () => void;
  onLogoutAdmin?: () => void;
  doctors: DoctorMember[];
  courses: Course[];
  news: NewsItem[];
  resources?: ResourceItem[];
  auditLogs: AuditLogEntry[];
  idAllocations?: IdAllocation[];
  onUpdateIdAllocation?: (updated: IdAllocation) => void;
  onAddNews: (item: NewsItem) => void;
  onDeleteNews?: (id: string) => void;
  onAddCourse: (course: Course) => void;
  onUpdateCourse?: (course: Course) => void;
  onDeleteCourse?: (id: string) => void;
  onAddDoctor: (doctor: DoctorMember) => void;
  onUpdateDoctor: (doctor: DoctorMember) => void;
  onDeleteDoctor?: (id: string) => void;
  onAddResource?: (item: ResourceItem) => void;
  onDeleteResource?: (id: string) => void;
  onAddAuditLog: (entry: AuditLogEntry) => void;
  onClearAuditLogs: () => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  lang,
  onCloseAdmin,
  onLogoutAdmin,
  doctors = [],
  courses = [],
  news = [],
  resources = [],
  auditLogs = [],
  idAllocations = [],
  onUpdateIdAllocation,
  onAddNews,
  onDeleteNews,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  onAddDoctor,
  onUpdateDoctor,
  onDeleteDoctor,
  onAddResource,
  onDeleteResource,
  onAddAuditLog,
  onClearAuditLogs,
}) => {
  const isArabic = lang === 'ar';

  // Navigation tabs in top bar
  const [activeTab, setActiveTab] = useState<'roster' | 'news' | 'courses' | 'resources' | 'ids' | 'audit' | 'help'>('roster');

  // Search & Filter States
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorFilter, setDoctorFilter] = useState<'all' | 'Specialist' | 'General' | 'Trainee'>('all');

  // Deletion modals state
  const [itemToDelete, setItemToDelete] = useState<{ type: 'doctor' | 'news' | 'course' | 'resource'; id: string; name: string } | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // New Doctor Form
  const [newDoc, setNewDoc] = useState({
    name: '',
    nameAr: '',
    imcNumber: '',
    title: '',
    titleAr: '',
    roleCategory: '',
    roleCategoryAr: '',
    specialty: '',
    specialtyAr: '',
    hospital: '',
    hospitalAr: '',
    division: 'Specialist Division' as 'Specialist Division' | 'General Division' | 'Trainee Specialist',
    photoUrl: '',
    whatsapp: '',
    email: '',
    bio: '',
    bioAr: '',
    cvPdfUrl: '',
    cvPdfName: '',
    recordingUrl: '',
  });
  const [isSavingDoc, setIsSavingDoc] = useState(false);

  // Edit Doctor Form
  const [editingDoctor, setEditingDoctor] = useState<DoctorMember | null>(null);

  // New News Form
  const [newsForm, setNewsForm] = useState({
    title: '',
    titleAr: '',
    summary: '',
    summaryAr: '',
    location: 'Dublin, Ireland',
    category: 'Official Secretariat Dispatch',
    imageUrl: '',
    pdfUrl: '',
    pdfName: '',
    recordingUrl: '',
  });
  const [isSavingNews, setIsSavingNews] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  // New Course Form
  const [courseForm, setCourseForm] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    leadFaculty: 'RCSI / RCPI Consultant Faculty',
    leadFacultyAr: 'نخبة من الاستشاريين والمدربين المعتمدين',
    cpdUnits: 4,
    cohort: 'All NCHDs & Registrars',
    cohortAr: 'كافة الأطباء المقيمين والمسجلين في إيرلندا',
    format: 'Hybrid (Virtual + In-Person)',
    formatAr: 'مدمج (حضوري وعبر الإنترنت)',
    accessType: 'members' as 'members' | 'open',
    imageUrl: '',
    recordingUrl: '',
    lessonUrl: '',
    pdfUrl: '',
    pdfName: '',
  });
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // New Resource Form
  const [resourceForm, setResourceForm] = useState({
    title: '',
    titleAr: '',
    category: 'National HSE Algorithm',
    documentRef: 'HSE-CLINICAL-DOC',
    description: '',
    descriptionAr: '',
    imageUrl: '',
    pdfUrl: '',
    pdfName: '',
    recordingUrl: '',
  });
  const [isSavingResource, setIsSavingResource] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);

  // 4000 IDs State
  const [pool4000, setPool4000] = useState<PrecreatedId[]>(() => load4000Ids());
  const [idSearch, setIdSearch] = useState('');
  const [idFilter, setIdFilter] = useState<'all' | 'issued' | 'unissued'>('all');
  const [idPage, setIdPage] = useState(1);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 4000);
  };

  // Handlers for Doctor
  const handleSaveNewDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name.trim() || !newDoc.imcNumber.trim()) {
      showToast(isArabic ? 'يرجى إدخال اسم الطبيب ورقم المجلس الطبي (IMC)' : 'Please enter Doctor Name and IMC Number');
      return;
    }

    setIsSavingDoc(true);
    const newId = `SDI-${Math.floor(1000 + Math.random() * 9000)}`;
    const created: DoctorMember = {
      id: newId,
      name: newDoc.name.trim(),
      nameAr: newDoc.nameAr.trim() || newDoc.name.trim(),
      title: newDoc.title.trim(),
      titleAr: newDoc.titleAr.trim(),
      roleCategory: newDoc.roleCategory.trim(),
      roleCategoryAr: newDoc.roleCategoryAr.trim(),
      specialty: newDoc.specialty.trim(),
      specialtyAr: newDoc.specialtyAr.trim(),
      hospital: newDoc.hospital.trim(),
      hospitalAr: newDoc.hospitalAr.trim(),
      division: newDoc.division,
      imcNumber: newDoc.imcNumber.trim(),
      standing: 'Active',
      cpdUnits: 0,
      joinedYear: new Date().getFullYear(),
      photoUrl: newDoc.photoUrl.trim() || '',
      whatsapp: newDoc.whatsapp.trim() || '',
      email: newDoc.email.trim() || '',
      bio: newDoc.bio.trim() || '',
      bioAr: newDoc.bioAr.trim() || '',
      cvPdfUrl: newDoc.cvPdfUrl.trim() || undefined,
      cvPdfName: newDoc.cvPdfName.trim() || undefined,
      recordingUrl: newDoc.recordingUrl.trim() || undefined,
    };

    onAddDoctor(created);
    onAddAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'REGISTRY_ENROLL',
      badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      message: `Enrolled Dr. ${created.name} (IMC #${created.imcNumber}) into verified roster.`,
    });

    setIsSavingDoc(false);
    setNewDoc({
      name: '',
      nameAr: '',
      imcNumber: '',
      title: '',
      titleAr: '',
      roleCategory: '',
      roleCategoryAr: '',
      specialty: '',
      specialtyAr: '',
      hospital: '',
      hospitalAr: '',
      division: 'Specialist Division',
      photoUrl: '',
      whatsapp: '',
      email: '',
      bio: '',
      bioAr: '',
      cvPdfUrl: '',
      cvPdfName: '',
      recordingUrl: '',
    });
    showToast(isArabic ? `تم إضافة الطبيب ${created.name} إلى السجل بنجاح` : `Dr. ${created.name} successfully enrolled in registry.`);
  };

  const handleUpdateExistingDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    onUpdateDoctor(editingDoctor);
    onAddAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'REGISTRY_UPDATE',
      badgeClass: 'bg-blue-50 text-blue-800 border border-blue-200',
      message: `Updated profile for Dr. ${editingDoctor.name} (ID #${editingDoctor.id}).`,
    });

    setEditingDoctor(null);
    showToast(isArabic ? `تم تحديث بيانات الطبيب بنجاح` : `Doctor profile updated.`);
  };

  // Handlers for News
  const handleSaveNewNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title.trim()) return;

    setIsSavingNews(true);
    const item: NewsItem = {
      id: `news-${Date.now()}`,
      title: newsForm.title.trim(),
      titleAr: newsForm.titleAr.trim() || newsForm.title.trim(),
      summary: newsForm.summary.trim() || 'Official announcement from SDI Secretariat.',
      summaryAr: newsForm.summaryAr.trim() || newsForm.summary.trim() || 'إعلان رسمي من الأمانة العامة لنقابة أطباء السودان بأيرلندا.',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      dateAr: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }),
      location: newsForm.location.trim() || 'Dublin, Ireland',
      locationAr: 'دبلن، جمهورية إيرلندا',
      category: newsForm.category,
      categoryAr: 'بيان رسمي من الأمانة العامة',
      details: newsForm.summary.trim() || 'Full details available from Secretariat.',
      detailsAr: newsForm.summaryAr.trim() || 'كافة التفاصيل متاحة لدى الأمانة العامة.',
      actionText: isArabic ? 'قراءة البيان' : 'Read Notice',
      actionTextAr: 'قراءة البيان والتفاصيل',
      imageUrl: newsForm.imageUrl.trim() || undefined,
      pdfUrl: newsForm.pdfUrl.trim() || undefined,
      pdfName: newsForm.pdfName.trim() || undefined,
      recordingUrl: newsForm.recordingUrl.trim() || undefined,
    };

    onAddNews(item);
    onAddAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'NEWS_PUBLISH',
      badgeClass: 'bg-blue-50 text-blue-800 border border-blue-200',
      message: `Published news bulletin: "${item.title}".`,
    });

    setIsSavingNews(false);
    setNewsForm({
      title: '',
      titleAr: '',
      summary: '',
      summaryAr: '',
      location: 'Dublin, Ireland',
      category: 'Official Secretariat Dispatch',
      imageUrl: '',
      pdfUrl: '',
      pdfName: '',
      recordingUrl: '',
    });
    showToast(isArabic ? `تم نشر البيان بنجاح` : `News bulletin published.`);
  };

  const handleUpdateExistingNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;
    onAddNews(editingNews);
    onAddAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'NEWS_UPDATE',
      badgeClass: 'bg-blue-50 text-blue-800 border border-blue-200',
      message: `Updated bulletin: "${editingNews.title}".`,
    });
    setEditingNews(null);
    showToast(isArabic ? 'تم تحديث البيان بنجاح' : 'Bulletin updated.');
  };

  // Handlers for Courses
  const handleSaveNewCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;

    setIsSavingCourse(true);
    const course: Course = {
      id: `crs-${Date.now()}`,
      title: courseForm.title.trim(),
      titleAr: courseForm.titleAr.trim() || courseForm.title.trim(),
      description: courseForm.description.trim() || 'Accredited clinical education program for physicians in Ireland.',
      descriptionAr: courseForm.descriptionAr.trim() || courseForm.description.trim() || 'برنامج تعليمي وتدريبي معتمد للأطباء في إيرلندا.',
      cpdUnits: courseForm.cpdUnits || 4,
      leadFaculty: courseForm.leadFaculty,
      leadFacultyAr: courseForm.leadFacultyAr || 'نخبة من الاستشاريين والمدربين المعتمدين',
      cohort: courseForm.cohort,
      cohortAr: courseForm.cohortAr || 'كافة الأطباء المقيمين والمسجلين في إيرلندا',
      format: courseForm.format || 'Hybrid (Virtual + In-Person)',
      formatAr: courseForm.formatAr || 'مدمج (حضوري وعبر الإنترنت)',
      accessType: courseForm.accessType,
      syllabus: ['Clinical Assessment', 'Irish Healthcare Guidelines', 'Examination Protocols'],
      syllabusAr: ['التقييم السريري', 'بروتوكولات النظام الصحي الإيرلندي', 'محاكاة الامتحانات الملكية'],
      imageUrl: courseForm.imageUrl.trim() || undefined,
      recordingUrl: courseForm.recordingUrl.trim() || undefined,
      lessonUrl: courseForm.lessonUrl.trim() || undefined,
      pdfUrl: courseForm.pdfUrl.trim() || undefined,
      pdfName: courseForm.pdfName.trim() || undefined,
    };

    onAddCourse(course);
    onAddAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'COURSE_CREATE',
      badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
      message: `Created course: "${course.title}" (${course.cpdUnits} CPD units).`,
    });

    setIsSavingCourse(false);
    setCourseForm({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      leadFaculty: 'RCSI / RCPI Consultant Faculty',
      leadFacultyAr: 'نخبة من الاستشاريين والمدربين المعتمدين',
      cpdUnits: 4,
      cohort: 'All NCHDs & Registrars',
      cohortAr: 'كافة الأطباء المقيمين والمسجلين في إيرلندا',
      format: 'Hybrid (Virtual + In-Person)',
      formatAr: 'مدمج (حضوري وعبر الإنترنت)',
      accessType: 'members',
      imageUrl: '',
      recordingUrl: '',
      lessonUrl: '',
      pdfUrl: '',
      pdfName: '',
    });
    showToast(isArabic ? `تم إضافة الدورة التدريبية بنجاح` : `Course added successfully.`);
  };

  const handleUpdateExistingCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !onUpdateCourse) return;

    onUpdateCourse(editingCourse);
    onAddAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'COURSE_UPDATE',
      badgeClass: 'bg-blue-50 text-blue-800 border border-blue-200',
      message: `Updated course: "${editingCourse.title}".`,
    });

    setEditingCourse(null);
    showToast(isArabic ? `تم تحديث الدورة التدريبية بنجاح` : `Course updated successfully.`);
  };

  // Handlers for Resource
  const handleSaveNewResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceForm.title.trim() || !onAddResource) return;

    setIsSavingResource(true);
    const item: ResourceItem = {
      id: `res-${Date.now()}`,
      title: resourceForm.title.trim(),
      titleAr: resourceForm.titleAr.trim() || resourceForm.title.trim(),
      category: resourceForm.category,
      categoryAr: 'خوارزمية ووثيقة سريرية معتمدة',
      code: resourceForm.documentRef.trim() || `SDI-DOC-${Date.now().toString().slice(-4)}`,
      description: resourceForm.description.trim() || 'Clinical document and protocol summary.',
      descriptionAr: resourceForm.descriptionAr.trim() || 'وثيقة وإرشادات سريرية معتمدة تم توثيقها رسمياً.',
      fileUrl: resourceForm.pdfUrl.trim() || '#',
      imageUrl: resourceForm.imageUrl.trim() || undefined,
      pdfUrl: resourceForm.pdfUrl.trim() || undefined,
      pdfName: resourceForm.pdfName.trim() || undefined,
      recordingUrl: resourceForm.recordingUrl.trim() || undefined,
    };

    onAddResource(item);
    onAddAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'RESOURCE_UPLOAD',
      badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200',
      message: `Uploaded document/protocol: "${item.title}".`,
    });

    setIsSavingResource(false);
    setResourceForm({
      title: '',
      titleAr: '',
      category: 'National HSE Algorithm',
      documentRef: 'HSE-CLINICAL-DOC',
      description: '',
      descriptionAr: '',
      imageUrl: '',
      pdfUrl: '',
      pdfName: '',
      recordingUrl: '',
    });
    showToast(isArabic ? `تم إضافة اللائحة السريرية بنجاح` : `Clinical guideline added successfully.`);
  };

  const handleUpdateExistingResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource || !onAddResource) return;

    onAddResource(editingResource);
    onAddAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'RESOURCE_UPDATE',
      badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200',
      message: `Updated guideline/resource: "${editingResource.title}".`,
    });

    setEditingResource(null);
    showToast(isArabic ? 'تم تحديث الوثيقة السريرية بنجاح' : 'Clinical guideline updated successfully.');
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'doctor' && onDeleteDoctor) {
      onDeleteDoctor(itemToDelete.id);
      showToast(isArabic ? `تم حذف الطبيب ${itemToDelete.name}` : `Doctor ${itemToDelete.name} deleted.`);
    } else if (itemToDelete.type === 'news' && onDeleteNews) {
      onDeleteNews(itemToDelete.id);
      showToast(isArabic ? `تم حذف البيان` : `News item deleted.`);
    } else if (itemToDelete.type === 'course' && onDeleteCourse) {
      onDeleteCourse(itemToDelete.id);
      showToast(isArabic ? `تم حذف الدورة` : `Course deleted.`);
    } else if (itemToDelete.type === 'resource' && onDeleteResource) {
      onDeleteResource(itemToDelete.id);
      showToast(isArabic ? `تم حذف اللائحة` : `Resource deleted.`);
    }

    onAddAuditLog({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'ITEM_PURGE',
      badgeClass: 'bg-rose-50 text-rose-800 border border-rose-200',
      message: `Permanently deleted ${itemToDelete.type}: "${itemToDelete.name}".`,
    });

    setItemToDelete(null);
  };

  // Filtered Doctors
  const filteredDoctors = doctors.filter((doc) => {
    const q = doctorSearch.trim().toLowerCase();
    const matchesQ =
      !q ||
      doc.name.toLowerCase().includes(q) ||
      (doc.nameAr && doc.nameAr.includes(q)) ||
      doc.imcNumber.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.hospital.toLowerCase().includes(q);

    if (!matchesQ) return false;
    if (doctorFilter === 'Specialist') return doc.division === 'Specialist Division';
    if (doctorFilter === 'General') return doc.division === 'General Division';
    if (doctorFilter === 'Trainee') return doc.division === 'Trainee Specialist';
    return true;
  });

  // Filtered IDs
  const filteredIds = pool4000.filter((idItem) => {
    const q = idSearch.trim().toLowerCase();
    const matchesQ = !q || idItem.id.toLowerCase().includes(q) || (idItem.notes && idItem.notes.toLowerCase().includes(q));
    if (!matchesQ) return false;
    if (idFilter === 'issued') return idItem.isIssued;
    if (idFilter === 'unissued') return !idItem.isIssued;
    return true;
  });

  const idsPerPage = 25;
  const paginatedIds = filteredIds.slice((idPage - 1) * idsPerPage, idPage * idsPerPage);
  const totalIdPages = Math.ceil(filteredIds.length / idsPerPage) || 1;

  // Toggle ID activation
  const handleToggleId = (idItem: PrecreatedId) => {
    const nextPool = idItem.isActivated ? deactivateId(idItem.id) : activateId(idItem.id);
    setPool4000(nextPool);
    showToast(isArabic ? `تم تحديث حالة المعرف #${idItem.id}` : `ID #${idItem.id} status updated.`);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans pb-24 selection:bg-[#0f172a] selection:text-white">
      {/* Top Console Navigation Bar */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-white/95 border-b border-slate-200/80 backdrop-blur-sm shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-xs">
              <img src="/sdi-logo.jpg" alt="SDI Crest" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-bold text-base text-[#0f172a] leading-tight">
                  {isArabic ? 'أمانة أطباء السودان بأيرلندا' : 'SDI Secretariat Admin'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#15803d] text-white">
                  {isArabic ? 'لوحة التحكم' : 'PORTAL'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 hidden sm:block">
                Sudanese Doctors in Ireland • Official Management
              </span>
            </div>
          </div>

          {/* Quick Tabs in Header (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bubble-glass border border-slate-200/80 text-xs">
            <button
              onClick={() => setActiveTab('roster')}
              className={`bubble-selection-pill text-xs ${activeTab === 'roster' ? 'bubble-selection-pill--active' : 'bubble-selection-pill--inactive'}`}
            >
              {isArabic ? 'سجل الأطباء' : 'Doctors Roster'} ({doctors.length})
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`bubble-selection-pill text-xs ${activeTab === 'news' ? 'bubble-selection-pill--active' : 'bubble-selection-pill--inactive'}`}
            >
              {isArabic ? 'البيانات والأخبار' : 'News'} ({news.length})
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`bubble-selection-pill text-xs ${activeTab === 'courses' ? 'bubble-selection-pill--active' : 'bubble-selection-pill--inactive'}`}
            >
              {isArabic ? 'البرامج والتدريب' : 'Courses'} ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`bubble-selection-pill text-xs ${activeTab === 'resources' ? 'bubble-selection-pill--active' : 'bubble-selection-pill--inactive'}`}
            >
              {isArabic ? 'اللوائح' : 'Guidelines'} ({resources.length})
            </button>
            <button
              onClick={() => setActiveTab('ids')}
              className={`bubble-selection-pill text-xs ${activeTab === 'ids' ? 'bubble-selection-pill--active' : 'bubble-selection-pill--inactive'}`}
            >
              {isArabic ? 'المعرفات' : 'IDs Pool'} ({pool4000.filter((i) => i.isIssued).length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`bubble-selection-pill text-xs ${activeTab === 'audit' ? 'bubble-selection-pill--active' : 'bubble-selection-pill--inactive'}`}
            >
              {isArabic ? 'سجل التدقيق' : 'Audit Logs'} ({auditLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`bubble-selection-pill text-xs ${activeTab === 'help' ? 'bubble-selection-pill--active' : 'bubble-selection-pill--inactive'}`}
            >
              {isArabic ? 'دليل الإدارة' : 'Admin Guide'}
            </button>
          </nav>

          {/* Exit & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* PDF Export Menu */}
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-rose-600">picture_as_pdf</span>
                <span className="hidden sm:inline">{isArabic ? 'تصدير PDF' : 'Export PDF'}</span>
              </button>
              <div className="absolute right-0 mt-1 w-56 p-2 rounded-2xl bg-white border border-slate-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                  onClick={() => exportDoctorsPDF(doctors, lang)}
                  className="w-full text-left rtl:text-right px-3 py-2 rounded-xl text-xs hover:bg-slate-50 font-medium text-slate-800 block"
                >
                  {isArabic ? 'تقرير سجل الأطباء' : 'Doctors Roster PDF'}
                </button>
                <button
                  onClick={() => exportCoursesPDF(courses, lang)}
                  className="w-full text-left rtl:text-right px-3 py-2 rounded-xl text-xs hover:bg-slate-50 font-medium text-slate-800 block"
                >
                  {isArabic ? 'كتالوج الدورات المعتمدة' : 'Courses Catalog PDF'}
                </button>
                <button
                  onClick={() => exportConsolidatedReportPDF(doctors, courses, lang)}
                  className="w-full text-left rtl:text-right px-3 py-2 rounded-xl text-xs hover:bg-slate-50 font-medium text-slate-800 block border-t border-slate-100"
                >
                  {isArabic ? 'التقرير الشامل المدمج' : 'Consolidated Audit PDF'}
                </button>
              </div>
            </div>

            {/* Exit to Public Website Button */}
            <button
              type="button"
              onClick={onCloseAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-[#0f172a] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span className="hidden sm:inline">{isArabic ? 'العودة للموقع' : 'Exit to Public'}</span>
            </button>

            {onLogoutAdmin && (
              <button
                type="button"
                onClick={onLogoutAdmin}
                className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 flex items-center justify-center transition-all"
                title={isArabic ? 'قفل لوحة الإدارة' : 'Lock Admin Console'}
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Navigation Tabs */}
        <div className="lg:hidden px-4 pb-2 pt-1 border-t border-slate-200/80 overflow-x-auto no-scrollbar flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('roster')}
            className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'roster' ? 'bg-[#15803d] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {isArabic ? 'الأطباء' : 'Doctors'} ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'news' ? 'bg-[#15803d] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {isArabic ? 'الأخبار' : 'News'} ({news.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'courses' ? 'bg-[#15803d] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {isArabic ? 'البرامج' : 'Courses'} ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'resources' ? 'bg-[#15803d] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {isArabic ? 'اللوائح' : 'Guidelines'} ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('ids')}
            className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'ids' ? 'bg-[#15803d] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {isArabic ? 'المعرفات' : 'IDs Pool'}
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'audit' ? 'bg-[#15803d] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {isArabic ? 'التدقيق' : 'Audit'} ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'help' ? 'bg-[#15803d] text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {isArabic ? 'دليل الإدارة' : 'Guide'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Toast Notification */}
        {actionToast && (
          <div className="p-4 rounded-2xl bg-[#15803d] text-white text-xs font-bold flex items-center justify-between shadow-xl animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>{actionToast}</span>
            </div>
            <button onClick={() => setActionToast(null)} className="text-white hover:opacity-80">
              ✕
            </button>
          </div>
        )}

        {/* Real-time Measured Charts & Live Database Summary */}
        <RealtimeDashboardCharts
          lang={lang}
          doctors={doctors}
          courses={courses}
          news={news}
          resources={resources}
          idAllocations={idAllocations}
          auditLogs={auditLogs}
        />

        {/* ========================================================
            TAB 1: CLINICIANS & DOCTORS ROSTER
            ======================================================== */}
        {activeTab === 'roster' && (
          <div className="space-y-6">
            {/* Top Action & Search Bar */}
            <div className="bubble-glass rounded-[2rem] p-6 bg-white/90 border border-white/95 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-headline font-bold text-[#0f172a] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#15803d]">medical_services</span>
                  <span>{isArabic ? 'إدارة سجل الأطباء المعتمدين' : 'Verified Doctors Master Roster'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {isArabic
                    ? 'بحث وتعديل وإضافة الأطباء الممارسين في جمهورية إيرلندا'
                    : 'Search, review, enroll, or remove registered clinicians practicing across Ireland'}
                </p>
              </div>

              {/* Search & Division Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  placeholder={isArabic ? 'بحث بالاسم، رقم IMC، أو المستشفى...' : 'Search by name, IMC #, hospital...'}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-[#15803d] w-64"
                />
                <select
                  value={doctorFilter}
                  onChange={(e) => setDoctorFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden font-medium"
                >
                  <option value="all">{isArabic ? 'كافة السجلات' : 'All Divisions'}</option>
                  <option value="Specialist">{isArabic ? 'السجل التخصصي' : 'Specialist Division'}</option>
                  <option value="General">{isArabic ? 'السجل العام' : 'General Division'}</option>
                  <option value="Trainee">{isArabic ? 'التدريب التخصصي' : 'Trainee Specialist'}</option>
                </select>
              </div>
            </div>

            {/* Doctors Table */}
            <div className="bubble-glass rounded-[2rem] overflow-hidden bg-white/90 border border-white/95 shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right text-xs">
                  <thead className="bg-slate-50/90 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">{isArabic ? 'اسم الطبيب' : 'Doctor Name'}</th>
                      <th className="py-3 px-4">{isArabic ? 'المجلس الطبي (IMC)' : 'IMC Number'}</th>
                      <th className="py-3 px-4">{isArabic ? 'التخصص والمستشفى' : 'Specialty & Hospital'}</th>
                      <th className="py-3 px-4">{isArabic ? 'السجل' : 'Division'}</th>
                      <th className="py-3 px-4 text-center">{isArabic ? 'إجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDoctors.length > 0 ? (
                      filteredDoctors.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">#{doc.id}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                <img
                                  src={doc.photoUrl || '/dr-al-samoual-awad.jpg'}
                                  alt={doc.name}
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-[#0f172a]">{isArabic && doc.nameAr ? doc.nameAr : doc.name}</div>
                                <div className="text-[11px] text-slate-500">{doc.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#15803d]">
                            {doc.imcNumber}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">{doc.specialty}</div>
                            <div className="text-[11px] text-slate-500">{doc.hospital}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                              {doc.division}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setNewDoc({
                                    name: '',
                                    nameAr: '',
                                    imcNumber: '',
                                    title: doc.title || '',
                                    titleAr: doc.titleAr || '',
                                    roleCategory: doc.roleCategory || '',
                                    roleCategoryAr: doc.roleCategoryAr || '',
                                    specialty: doc.specialty || '',
                                    specialtyAr: doc.specialtyAr || '',
                                    hospital: doc.hospital || '',
                                    hospitalAr: doc.hospitalAr || '',
                                    division: (doc.division as any) || 'Specialist Division',
                                    photoUrl: '',
                                    whatsapp: doc.whatsapp || '',
                                    email: '',
                                    bio: doc.bio || '',
                                    bioAr: doc.bioAr || '',
                                    cvPdfUrl: '',
                                    cvPdfName: '',
                                    recordingUrl: doc.recordingUrl || '',
                                  });
                                  showToast(isArabic ? 'تم نسخ نموذج الطبيب، يمكنك الآن إدخال الاسم ورقم IMC ورفع الصورة' : 'Clinician template loaded! Enter name, IMC, and upload photo below.');
                                  const el = document.getElementById('enroll-doctor-form');
                                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title={isArabic ? 'إضافة طبيب مماثل بهذا النموذج' : 'Add Similar Clinician'}
                              >
                                <span className="material-symbols-outlined text-[16px]">person_add</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingDoctor(doc)}
                                className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                title={isArabic ? 'تعديل البيانات' : 'Edit'}
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setItemToDelete({ type: 'doctor', id: doc.id, name: doc.name })}
                                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                                title={isArabic ? 'حذف من السجل' : 'Delete'}
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                            <span className="material-symbols-outlined text-2xl">person_search</span>
                          </div>
                          <p className="font-bold text-sm text-slate-700">
                            {isArabic ? 'لا توجد بيانات أطباء مسجلة حالياً' : 'No doctor records found'}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            {isArabic
                              ? 'يمكنك تسجيل أول طبيب معتمد الآن عبر النموذج أدناه.'
                              : 'You can enroll the first verified clinician using the form below.'}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enroll New Clinician Form */}
            <div id="enroll-doctor-form" className="bubble-glass rounded-[2rem] p-6 lg:p-8 bg-white/90 border border-white/95 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <h4 className="text-base font-headline font-bold text-[#0f172a] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#15803d]">person_add</span>
                  <span>{isArabic ? 'تسجيل طبيب أو قيادي معتمد جديد في السجل' : 'Enroll Verified Clinician into Registry'}</span>
                </h4>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                    {isArabic ? 'يكتب الطبيب كافة بياناته بنفسه دون أي ألقاب مفروضة مسبقاً' : 'All clinician details are written directly with no preset designations'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewDoc({
                        name: '',
                        nameAr: '',
                        imcNumber: '',
                        title: '',
                        titleAr: '',
                        roleCategory: '',
                        roleCategoryAr: '',
                        specialty: '',
                        specialtyAr: '',
                        hospital: '',
                        hospitalAr: '',
                        division: 'Specialist Division',
                        photoUrl: '',
                        whatsapp: '',
                        email: '',
                        bio: '',
                        bioAr: '',
                        cvPdfUrl: '',
                        cvPdfName: '',
                        recordingUrl: '',
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    {isArabic ? 'تفريغ الحقول' : 'Clear Fields'}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveNewDoctor} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'الاسم بالإنجليزية *' : 'Doctor Full Name (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    placeholder="e.g. Dr. Ahmed Ibrahim"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'الاسم بالعربية' : 'Doctor Name (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={newDoc.nameAr}
                    onChange={(e) => setNewDoc({ ...newDoc, nameAr: e.target.value })}
                    placeholder="د. أحمد إبراهيم"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'رقم المجلس الطبي (IMC) *' : 'Irish Medical Council (IMC) # *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newDoc.imcNumber}
                    onChange={(e) => setNewDoc({ ...newDoc, imcNumber: e.target.value })}
                    placeholder="e.g. 418290"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'المسمى الوظيفي' : 'Professional Title'}
                  </label>
                  <input
                    type="text"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    placeholder={isArabic ? 'اكتب المسمى الوظيفي' : 'Professional Title'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'الكادر / الرتبة الطبية' : 'Cadre / Role Category'}
                  </label>
                  <input
                    type="text"
                    value={newDoc.roleCategory}
                    onChange={(e) => setNewDoc({ ...newDoc, roleCategory: e.target.value })}
                    placeholder={isArabic ? 'الكادر الطبي (استشاري / أخصائي / مقيم...)' : 'e.g. Consultant, Registrar, SHO, GP...'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'التخصص السريري' : 'Clinical Specialty'}
                  </label>
                  <input
                    type="text"
                    value={newDoc.specialty}
                    onChange={(e) => setNewDoc({ ...newDoc, specialty: e.target.value })}
                    placeholder={isArabic ? 'التخصص السريري' : 'Clinical Specialty'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'سجل المجلس الطبي' : 'IMC Division'}
                  </label>
                  <select
                    value={newDoc.division}
                    onChange={(e) => setNewDoc({ ...newDoc, division: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden"
                  >
                    <option value="">{isArabic ? 'اختر الشعبة (اختياري)' : 'Select Division'}</option>
                    <option value="Specialist Division">Specialist Division</option>
                    <option value="General Division">General Division</option>
                    <option value="Trainee Specialist">Trainee Specialist</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'المستشفى والارتباط الأكاديمي' : 'Hospital / Academic Trust Affiliation'}
                  </label>
                  <input
                    type="text"
                    value={newDoc.hospital}
                    onChange={(e) => setNewDoc({ ...newDoc, hospital: e.target.value })}
                    placeholder={isArabic ? 'اسم المستشفى أو المركز' : 'Hospital or Clinical Trust'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'رقم الواتساب للتواصل المباشر' : 'WhatsApp Contact Number'}
                  </label>
                  <input
                    type="text"
                    value={newDoc.whatsapp}
                    onChange={(e) => setNewDoc({ ...newDoc, whatsapp: e.target.value })}
                    placeholder="+353..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'البريد الإلكتروني المباشر' : 'Direct Email Address'}
                  </label>
                  <input
                    type="email"
                    value={newDoc.email}
                    onChange={(e) => setNewDoc({ ...newDoc, email: e.target.value })}
                    placeholder="doctor@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'الصورة الشخصية (رفع مباشر)' : 'Profile Photo (Direct Upload)'}
                  </label>
                  <div className="flex items-center gap-2">
                    {newDoc.photoUrl && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs">
                        <img
                          src={newDoc.photoUrl}
                          alt="Preview"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      value={newDoc.photoUrl}
                      onChange={(e) => setNewDoc({ ...newDoc, photoUrl: e.target.value })}
                      placeholder="Photo URL or upload"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                    />
                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                      <span className="material-symbols-outlined text-[15px]">upload</span>
                      <span>{isArabic ? 'اختر ملف' : 'Upload'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = async () => {
                            const dataUrl = reader.result as string;
                            const res = await fetch('/api/upload-doctor-photo', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ dataUrl, filename: file.name }),
                            });
                            const data = await res.json();
                            if (data.url) {
                              setNewDoc({ ...newDoc, photoUrl: data.url });
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'وثيقة الاعتماد / السيرة الذاتية (PDF)' : 'Credentials / CV Document (PDF)'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newDoc.cvPdfUrl}
                      onChange={(e) => setNewDoc({ ...newDoc, cvPdfUrl: e.target.value })}
                      placeholder="https://... or upload PDF"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                    />
                    <label className="cursor-pointer px-3 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                      <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                      <span>{isArabic ? 'رفع PDF' : 'Upload PDF'}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = async () => {
                            const dataUrl = reader.result as string;
                            const res = await fetch('/api/upload-pdf', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ dataUrl, filename: file.name, section: 'doctor' }),
                            });
                            const data = await res.json();
                            if (data.url) {
                              setNewDoc({ ...newDoc, cvPdfUrl: data.url, cvPdfName: data.name || file.name });
                              showToast(isArabic ? 'تم رفع وثيقة الـ PDF بنجاح' : 'PDF document uploaded successfully.');
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                  {newDoc.cvPdfName && (
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-emerald-800">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span className="truncate max-w-xs">{newDoc.cvPdfName}</span>
                      <button
                        type="button"
                        onClick={() => setNewDoc({ ...newDoc, cvPdfUrl: '', cvPdfName: '' })}
                        className="text-rose-600 hover:underline ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Doctor Introduction / Lecture Video Link */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'رابط تسجيل الفيديو / الكلمة التعريفية أو المحاضرة' : 'Doctor Introduction Video / Lecture Recording Link'}
                  </label>
                  <input
                    type="url"
                    value={newDoc.recordingUrl}
                    onChange={(e) => setNewDoc({ ...newDoc, recordingUrl: e.target.value })}
                    placeholder="https://youtube.com/... or Vimeo/Zoom/Drive video link"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'نبذة تعريفية مهنية عن الطبيب' : 'Professional Biography / Summary'}
                  </label>
                  <textarea
                    rows={2}
                    value={newDoc.bio}
                    onChange={(e) => setNewDoc({ ...newDoc, bio: e.target.value })}
                    placeholder="Brief sentences highlighting medical dedication, clinical qualifications, and specialty experience..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-3 flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingDoc}
                    className="px-6 py-2.5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold shadow-md transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">check</span>
                    <span>{isArabic ? 'حفظ واعتماد الطبيب في السجل' : 'Enroll Verified Clinician'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: NEWS & OFFICIAL BULLETINS
            ======================================================== */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            {/* Publish News Form */}
            <div className="bubble-glass rounded-[2rem] p-6 lg:p-8 bg-white/90 border border-white/95 shadow-md space-y-4">
              <h3 className="text-base font-headline font-bold text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">campaign</span>
                <span>{isArabic ? 'نشر بيان رسمي أو إعلان جديد' : 'Publish Official Bulletin or Announcement'}</span>
              </h3>

              <form onSubmit={handleSaveNewNews} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'عنوان البيان (الإنجليزية) *' : 'Headline (English) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newsForm.title}
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                      placeholder="e.g. Annual General Meeting (AGM) 2026 Announcement"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'عنوان البيان (العربية)' : 'Headline (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={newsForm.titleAr}
                      onChange={(e) => setNewsForm({ ...newsForm, titleAr: e.target.value })}
                      placeholder="إعلان انعقاد الجمعية العمومية السنوية 2026"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'ملخص البيان (الإنجليزية)' : 'Summary Brief (English)'}
                    </label>
                    <textarea
                      rows={3}
                      value={newsForm.summary}
                      onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                      placeholder="Official communication from the Executive Secretariat..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'ملخص البيان (العربية)' : 'Summary Brief (Arabic)'}
                    </label>
                    <textarea
                      rows={3}
                      value={newsForm.summaryAr}
                      onChange={(e) => setNewsForm({ ...newsForm, summaryAr: e.target.value })}
                      placeholder="بيان صادر عن الأمانة العامة لنقابة أطباء السودان بأيرلندا..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  {/* News Picture Upload */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'صورة أو بانر البيان (رفع مباشر)' : 'Dispatch Image / Banner (Upload)'}
                    </label>
                    <div className="flex items-center gap-2">
                      {newsForm.imageUrl && (
                        <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                          <img src={newsForm.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input
                        type="text"
                        value={newsForm.imageUrl}
                        onChange={(e) => setNewsForm({ ...newsForm, imageUrl: e.target.value })}
                        placeholder="https://... or upload"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden text-xs font-mono"
                      />
                      <label className="cursor-pointer px-2.5 py-2 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-[15px]">image</span>
                        <span>{isArabic ? 'صورة' : 'Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async () => {
                              const dataUrl = reader.result as string;
                              const res = await fetch('/api/upload-image', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ dataUrl, filename: file.name, section: 'news' }),
                              });
                              const data = await res.json();
                              if (data.url) {
                                setNewsForm({ ...newsForm, imageUrl: data.url });
                                showToast(isArabic ? 'تم رفع صورة البيان بنجاح' : 'Image uploaded.');
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* News Circular PDF */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'وثيقة القرار الرسمي (PDF)' : 'Official Decree Circular (PDF)'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newsForm.pdfUrl}
                        onChange={(e) => setNewsForm({ ...newsForm, pdfUrl: e.target.value })}
                        placeholder="https://... or upload PDF"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden text-xs font-mono"
                      />
                      <label className="cursor-pointer px-2.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                        <span>PDF</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async () => {
                              const dataUrl = reader.result as string;
                              const res = await fetch('/api/upload-pdf', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ dataUrl, filename: file.name, section: 'news' }),
                              });
                              const data = await res.json();
                              if (data.url) {
                                setNewsForm({ ...newsForm, pdfUrl: data.url, pdfName: data.name || file.name });
                                showToast(isArabic ? 'تم رفع ملف الـ PDF بنجاح' : 'PDF decree uploaded.');
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                    {newsForm.pdfName && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-emerald-800">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        <span className="truncate max-w-[140px]">{newsForm.pdfName}</span>
                        <button type="button" onClick={() => setNewsForm({ ...newsForm, pdfUrl: '', pdfName: '' })} className="text-rose-600 ml-1">✕</button>
                      </div>
                    )}
                  </div>

                  {/* Video / Speech Link */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'رابط تسجيل الفيديو / الكلمة' : 'Video / Speech Recording Link'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={newsForm.recordingUrl}
                        onChange={(e) => setNewsForm({ ...newsForm, recordingUrl: e.target.value })}
                        placeholder="https://youtube.com/... or Zoom/Drive"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingNews}
                    className="px-6 py-2.5 rounded-xl bg-[#0f172a] hover:bg-black text-white font-bold shadow-md transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">send</span>
                    <span>{isArabic ? 'نشر البيان على الموقع' : 'Publish to Website'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Published Bulletins List */}
            <div className="bubble-glass rounded-[2rem] p-6 bg-white/90 border border-white/95 shadow-md space-y-4">
              <h4 className="text-sm font-headline font-bold text-[#0f172a]">
                {isArabic ? `البيانات المنشورة حالياً (${news.length})` : `Active Published Dispatches (${news.length})`}
              </h4>

              <div className="space-y-3">
                {news.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {item.date}
                        </span>
                        <span className="text-[10px] text-slate-400">• {item.location}</span>
                      </div>
                      <h5 className="font-bold text-[#0f172a] text-sm">
                        {isArabic && item.titleAr ? item.titleAr : item.title}
                      </h5>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {isArabic && item.summaryAr ? item.summaryAr : item.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingNews(item)}
                        className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title={isArabic ? 'تعديل البيان' : 'Edit Bulletin'}
                      >
                        <span className="material-symbols-outlined text-[17px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete({ type: 'news', id: item.id, name: item.title })}
                        className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                        title={isArabic ? 'حذف البيان' : 'Delete'}
                      >
                        <span className="material-symbols-outlined text-[17px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: COURSES & CPD
            ======================================================== */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Add Course Form */}
            <div className="bubble-glass rounded-[2rem] p-6 lg:p-8 bg-white/90 border border-white/95 shadow-md space-y-4">
              <h3 className="text-base font-headline font-bold text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#15803d]">school</span>
                <span>{isArabic ? 'إضافة دورة تدريبية أو محاضرة معتمدة' : 'Add Accredited CPD Masterclass'}</span>
              </h3>

              <form onSubmit={handleSaveNewCourse} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'عنوان الدورة (الإنجليزية) *' : 'Course Title (English) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      placeholder="e.g. MRCPI Clinical Exam Masterclass"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'عنوان الدورة (العربية)' : 'Course Title (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={courseForm.titleAr}
                      onChange={(e) => setCourseForm({ ...courseForm, titleAr: e.target.value })}
                      placeholder="دورة التحضير لامتحان الكلية الملكية للأطباء (MRCPI)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'ساعات التطوير المعتمدة (CPD)' : 'Accredited CPD Units'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={courseForm.cpdUnits}
                      onChange={(e) => setCourseForm({ ...courseForm, cpdUnits: parseInt(e.target.value) || 4 })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'المحاضرون والكلية' : 'Lead Faculty'}
                    </label>
                    <input
                      type="text"
                      value={courseForm.leadFaculty}
                      onChange={(e) => setCourseForm({ ...courseForm, leadFaculty: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'الفئة المستهدفة' : 'Target Cohort'}
                    </label>
                    <input
                      type="text"
                      value={courseForm.cohort}
                      onChange={(e) => setCourseForm({ ...courseForm, cohort: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                    />
                  </div>
                </div>

                {/* Course Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'وصف الدورة (الإنجليزية)' : 'Description (English)'}
                    </label>
                    <textarea
                      rows={2}
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      placeholder="Comprehensive clinical simulation, curriculum stations, and accreditation..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'وصف الدورة (العربية)' : 'Description (Arabic)'}
                    </label>
                    <textarea
                      rows={2}
                      value={courseForm.descriptionAr}
                      onChange={(e) => setCourseForm({ ...courseForm, descriptionAr: e.target.value })}
                      placeholder="محاكاة سريرية شاملة وتدريب على المحطات السريرية المعتمدة..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden text-xs"
                    />
                  </div>
                </div>

                {/* Media, Picture, Recording, Lesson Link & PDF Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                  {/* Course Thumbnail / Banner Image */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'صورة الدورة / البوستر (رفع مباشر)' : 'Course Poster / Banner (Image)'}
                    </label>
                    <div className="flex items-center gap-2">
                      {courseForm.imageUrl && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs">
                          <img
                            src={courseForm.imageUrl}
                            alt="Course Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <input
                        type="text"
                        value={courseForm.imageUrl}
                        onChange={(e) => setCourseForm({ ...courseForm, imageUrl: e.target.value })}
                        placeholder="https://... or upload"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden text-xs font-mono"
                      />
                      <label className="cursor-pointer px-2.5 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-[15px]">upload</span>
                        <span>{isArabic ? 'صورة' : 'Img'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async () => {
                              const dataUrl = reader.result as string;
                              const res = await fetch('/api/upload-image', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ dataUrl, filename: file.name, section: 'course' }),
                              });
                              const data = await res.json();
                              if (data.url) {
                                setCourseForm({ ...courseForm, imageUrl: data.url });
                                showToast(isArabic ? 'تم رفع صورة الدورة بنجاح' : 'Course poster uploaded.');
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Recording Link */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'رابط تسجيل المحاضرة (فيديو/يوتيوب/زووم)' : 'Lecture Recording Link (Video/Stream)'}
                    </label>
                    <input
                      type="url"
                      value={courseForm.recordingUrl}
                      onChange={(e) => setCourseForm({ ...courseForm, recordingUrl: e.target.value })}
                      placeholder="https://youtube.com/... or Zoom/Drive"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden text-xs font-mono"
                    />
                  </div>

                  {/* Live Lesson Link */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'رابط الدرس المباشر (زووم/تيمز/ميت)' : 'Live Lesson Link (Zoom/Teams/Meet)'}
                    </label>
                    <input
                      type="url"
                      value={courseForm.lessonUrl}
                      onChange={(e) => setCourseForm({ ...courseForm, lessonUrl: e.target.value })}
                      placeholder="https://zoom.us/j/... or Google Meet"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden text-xs font-mono"
                    />
                  </div>

                  {/* Course PDF Document */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'مذكرة الدورة والمنهج (PDF)' : 'Course Handbook / Syllabus (PDF)'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={courseForm.pdfUrl}
                        onChange={(e) => setCourseForm({ ...courseForm, pdfUrl: e.target.value })}
                        placeholder="https://... or upload PDF"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden text-xs font-mono"
                      />
                      <label className="cursor-pointer px-2.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                        <span>PDF</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async () => {
                              const dataUrl = reader.result as string;
                              const res = await fetch('/api/upload-pdf', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ dataUrl, filename: file.name, section: 'course' }),
                              });
                              const data = await res.json();
                              if (data.url) {
                                setCourseForm({ ...courseForm, pdfUrl: data.url, pdfName: data.name || file.name });
                                showToast(isArabic ? 'تم رفع ملف مذكرة الدورة بنجاح' : 'Course PDF handbook uploaded.');
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                    {courseForm.pdfName && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-emerald-800">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        <span className="truncate max-w-[140px]">{courseForm.pdfName}</span>
                        <button type="button" onClick={() => setCourseForm({ ...courseForm, pdfUrl: '', pdfName: '' })} className="text-rose-600 ml-1">✕</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingCourse}
                    className="px-6 py-2.5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold shadow-md transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    <span>{isArabic ? 'إضافة الدورة' : 'Add Course'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Courses List */}
            <div className="bubble-glass rounded-[2rem] p-6 bg-white/90 border border-white/95 shadow-md space-y-4">
              <h4 className="text-sm font-headline font-bold text-[#0f172a]">
                {isArabic ? `البرامج المسجلة (${courses.length})` : `Registered Courses (${courses.length})`}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <div key={course.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#15803d] border border-emerald-200">
                          {course.cpdUnits} CPD Credits
                        </span>
                        <span className="text-[10px] text-slate-500">• {course.cohort}</span>
                        {course.recordingUrl && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">play_circle</span>
                            <span>{isArabic ? 'تسجيل' : 'Recording'}</span>
                          </span>
                        )}
                        {course.lessonUrl && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">videocam</span>
                            <span>{isArabic ? 'مباشر' : 'Live'}</span>
                          </span>
                        )}
                        {course.pdfUrl && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">picture_as_pdf</span>
                            <span>PDF</span>
                          </span>
                        )}
                      </div>
                      <h5 className="font-bold text-[#0f172a] text-sm leading-snug truncate">
                        {isArabic && course.titleAr ? course.titleAr : course.title}
                      </h5>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {isArabic && course.descriptionAr ? course.descriptionAr : course.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingCourse(course)}
                        className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title={isArabic ? 'تعديل الدورة' : 'Edit Course'}
                      >
                        <span className="material-symbols-outlined text-[17px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete({ type: 'course', id: course.id, name: course.title })}
                        className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                        title={isArabic ? 'حذف' : 'Delete'}
                      >
                        <span className="material-symbols-outlined text-[17px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: CLINICAL GUIDELINES & RESOURCES
            ======================================================== */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            {/* Upload Resource Form */}
            <div className="bubble-glass rounded-[2rem] p-6 lg:p-8 bg-white/90 border border-white/95 shadow-md space-y-4">
              <h3 className="text-base font-headline font-bold text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">upload_file</span>
                <span>{isArabic ? 'إضافة لائحة سريرية أو بروتوكول جديد' : 'Upload Clinical Guideline or Algorithm'}</span>
              </h3>

              <form onSubmit={handleSaveNewResource} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'عنوان اللائحة (الإنجليزية) *' : 'Guideline Title (English) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={resourceForm.title}
                      onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                      placeholder="e.g. National Sepsis 3.0 Clinical Algorithm"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'عنوان اللائحة (العربية)' : 'Guideline Title (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={resourceForm.titleAr}
                      onChange={(e) => setResourceForm({ ...resourceForm, titleAr: e.target.value })}
                      placeholder="الخوارزمية الوطنية المعتمدة لعلاج الإنتان 3.0"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'التصنيف' : 'Category'}
                    </label>
                    <select
                      value={resourceForm.category}
                      onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden"
                    >
                      <option value="National HSE Algorithm">National HSE Algorithm</option>
                      <option value="Irish Medical Council Guidelines">Irish Medical Council Guidelines</option>
                      <option value="Antimicrobial Stewardship">Antimicrobial Stewardship</option>
                      <option value="Postgraduate Training">Postgraduate Training</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'رقم أو كود الوثيقة / التسجيل' : 'Document Reference / Recording Code'}
                    </label>
                    <input
                      type="text"
                      value={resourceForm.documentRef}
                      onChange={(e) => setResourceForm({ ...resourceForm, documentRef: e.target.value })}
                      placeholder="e.g. HSE-ALGO-2026 or REC-CLINICAL-01"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'معلومات الوثيقة أو التسجيل وملخص المحتوى' : 'Document Content / Recording Summary'}
                  </label>
                  <textarea
                    rows={3}
                    value={resourceForm.description}
                    onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                    placeholder="Enter document summary, recording notes, clinical protocols, or operating instructions directly (no links required)..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>

                {/* Picture, PDF Upload & Walkthrough Recording Link */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  {/* Guideline Diagram / Infographic Picture */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'صورة المخطط السريري / الإنفوجرافيك' : 'Clinical Diagram / Infographic (Image)'}
                    </label>
                    <div className="flex items-center gap-2">
                      {resourceForm.imageUrl && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs">
                          <img
                            src={resourceForm.imageUrl}
                            alt="Diagram Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <input
                        type="text"
                        value={resourceForm.imageUrl}
                        onChange={(e) => setResourceForm({ ...resourceForm, imageUrl: e.target.value })}
                        placeholder="https://... or upload"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden text-xs font-mono"
                      />
                      <label className="cursor-pointer px-2.5 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-[15px]">upload</span>
                        <span>{isArabic ? 'صورة' : 'Img'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async () => {
                              const dataUrl = reader.result as string;
                              const res = await fetch('/api/upload-image', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ dataUrl, filename: file.name, section: 'resource' }),
                              });
                              const data = await res.json();
                              if (data.url) {
                                setResourceForm({ ...resourceForm, imageUrl: data.url });
                                showToast(isArabic ? 'تم رفع صورة المخطط السريري بنجاح' : 'Clinical diagram uploaded.');
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Protocol PDF Document */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'ملف اللائحة أو البروتوكول (PDF)' : 'Guideline / Algorithm Document (PDF)'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={resourceForm.pdfUrl}
                        onChange={(e) => setResourceForm({ ...resourceForm, pdfUrl: e.target.value })}
                        placeholder="https://... or upload PDF"
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden text-xs font-mono"
                      />
                      <label className="cursor-pointer px-2.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                        <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                        <span>PDF</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = async () => {
                              const dataUrl = reader.result as string;
                              const res = await fetch('/api/upload-pdf', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ dataUrl, filename: file.name, section: 'resource' }),
                              });
                              const data = await res.json();
                              if (data.url) {
                                setResourceForm({ ...resourceForm, pdfUrl: data.url, pdfName: data.name || file.name });
                                showToast(isArabic ? 'تم رفع ملف الـ PDF بنجاح' : 'Protocol PDF uploaded.');
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </label>
                    </div>
                    {resourceForm.pdfName && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-emerald-800">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        <span className="truncate max-w-[140px]">{resourceForm.pdfName}</span>
                        <button type="button" onClick={() => setResourceForm({ ...resourceForm, pdfUrl: '', pdfName: '' })} className="text-rose-600 ml-1">✕</button>
                      </div>
                    )}
                  </div>

                  {/* Walkthrough Recording Link */}
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      {isArabic ? 'رابط التسجيل التوضيحي (فيديو/صوت)' : 'Clinical Walkthrough Recording Link'}
                    </label>
                    <input
                      type="url"
                      value={resourceForm.recordingUrl}
                      onChange={(e) => setResourceForm({ ...resourceForm, recordingUrl: e.target.value })}
                      placeholder="https://youtube.com/... or Zoom/Drive walkthrough"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingResource}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">check</span>
                    <span>{isArabic ? 'حفظ اللائحة' : 'Save Guideline'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Resources List */}
            <div className="bubble-glass rounded-[2rem] p-6 bg-white/90 border border-white/95 shadow-md space-y-4">
              <h4 className="text-sm font-headline font-bold text-[#0f172a]">
                {isArabic ? `اللوائح المحفوظة (${resources.length})` : `Saved Guidelines (${resources.length})`}
              </h4>

              <div className="space-y-3">
                {resources.map((res) => (
                  <div key={res.id} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                        <span className="material-symbols-outlined text-xl">description</span>
                      </div>
                      <div>
                        <h5 className="font-bold text-[#0f172a] text-xs sm:text-sm">
                          {isArabic && res.titleAr ? res.titleAr : res.title}
                        </h5>
                        <p className="text-[11px] text-slate-500">
                          {res.category} • {res.code}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={res.pdfUrl || res.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                      >
                        {isArabic ? 'فتح' : 'Open'}
                      </a>
                      <button
                        type="button"
                        onClick={() => setEditingResource(res)}
                        className="p-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title={isArabic ? 'تعديل' : 'Edit'}
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setItemToDelete({ type: 'resource', id: res.id, name: res.title })}
                        className="p-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                        title={isArabic ? 'حذف' : 'Delete'}
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: MEMBERSHIP IDS POOL
            ======================================================== */}
        {activeTab === 'ids' && (
          <div className="space-y-6">
            <div className="bubble-glass rounded-[2rem] p-6 bg-white/90 border border-white/95 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-headline font-bold text-[#0f172a] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#15803d]">badge</span>
                  <span>{isArabic ? 'إدارة سجل معرفات العضوية' : 'Membership ID Keystore Registry'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {isArabic
                    ? 'إدارة معرفات العضوية والتحكم في تفعيل أو تقييد صلاحيات الدخول للأطباء'
                    : 'Search, review and toggle membership activations across the pool'}
                </p>
              </div>

              {/* ID Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={idSearch}
                  onChange={(e) => {
                    setIdSearch(e.target.value);
                    setIdPage(1);
                  }}
                  placeholder={isArabic ? 'بحث برقم المعرف...' : 'Search ID (e.g. SDI-0012)...'}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-[#15803d] w-56"
                />
                <select
                  value={idFilter}
                  onChange={(e) => {
                    setIdFilter(e.target.value as any);
                    setIdPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden"
                >
                  <option value="all">{isArabic ? 'الكل' : 'All IDs'}</option>
                  <option value="issued">{isArabic ? 'المسحوبة فقط' : 'Issued Only'}</option>
                  <option value="unissued">{isArabic ? 'غير المسحوبة' : 'Unissued'}</option>
                </select>
              </div>
            </div>

            {/* IDs Table */}
            <div className="bubble-glass rounded-[2rem] overflow-hidden bg-white/90 border border-white/95 shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">{isArabic ? 'معرف العضوية' : 'Member ID'}</th>
                      <th className="py-3 px-4">{isArabic ? 'الحالة' : 'Status'}</th>
                      <th className="py-3 px-4">{isArabic ? 'تاريخ السحب' : 'Issued Date'}</th>
                      <th className="py-3 px-4">{isArabic ? 'الصلاحيات' : 'Privileges'}</th>
                      <th className="py-3 px-4 text-center">{isArabic ? 'تغيير الحالة' : 'Toggle'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {paginatedIds.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-[#0f172a]">#{item.id}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.isIssued
                                ? item.isActivated
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.isIssued ? (item.isActivated ? 'ACTIVE' : 'RESTRICTED') : 'AVAILABLE'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {item.issuedAt ? new Date(item.issuedAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {item.isActivated ? 'Full Access' : 'Bulletins Only'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.isIssued ? (
                            <button
                              type="button"
                              onClick={() => handleToggleId(item)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                item.isActivated
                                  ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                              }`}
                            >
                              {item.isActivated ? (isArabic ? 'تقييد' : 'Restrict') : (isArabic ? 'تفعيل' : 'Activate')}
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {isArabic
                    ? `صفحة ${idPage} من ${totalIdPages} (${filteredIds.length} معرف)`
                    : `Page ${idPage} of ${totalIdPages} (${filteredIds.length} IDs)`}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={idPage <= 1}
                    onClick={() => setIdPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded-lg bg-white border border-slate-200 disabled:opacity-40 font-bold"
                  >
                    ←
                  </button>
                  <button
                    disabled={idPage >= totalIdPages}
                    onClick={() => setIdPage((p) => Math.min(totalIdPages, p + 1))}
                    className="px-3 py-1 rounded-lg bg-white border border-slate-200 disabled:opacity-40 font-bold"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: AUDIT LOGS & SESSION TRAIL
            ======================================================== */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bubble-glass rounded-[2rem] p-6 bg-white/90 border border-white/95 shadow-md flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-headline font-bold text-[#0f172a] flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">history</span>
                  <span>{isArabic ? 'سجل العمليات والتدقيق الإداري' : 'Secretariat Operations Audit Trail'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {isArabic ? 'تسجيل دقيق لكافة الإجراءات المنفذة خلال الجلسة' : 'Accurate audit trail of all management actions performed'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClearAuditLogs}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                {isArabic ? 'مسح السجلات القديمة' : 'Clear Logs'}
              </button>
            </div>

            <div className="bubble-glass rounded-[2rem] p-6 bg-white/90 border border-white/95 shadow-md space-y-3 font-mono text-xs">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.badgeClass}`}>
                        {log.type}
                      </span>
                      <span className="text-slate-800 font-medium">{log.message}</span>
                    </div>
                    <span className="text-slate-400 text-[11px] self-end sm:self-auto">{log.timestamp}</span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400">
                  {isArabic ? 'لا توجد سجلات تدقيق حالياً' : 'No audit events recorded yet.'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: ACTIONABLE ADMIN INSTRUCTIONS & MANUAL
            ======================================================== */}
        {activeTab === 'help' && (
          <div className="space-y-6">
            <div className="bubble-glass rounded-[2rem] p-6 sm:p-8 bg-white/95 border border-white/95 shadow-md space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#15803d]"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isArabic ? 'دليل الإجراءات السريعة للمشرف' : 'Administrative Action Protocols'}
                </span>
              </div>
              <h3 className="text-xl font-headline font-bold text-[#0f172a]">
                {isArabic ? 'كيف تدير موقع نقابة أطباء السودان بأيرلندا (خطوة بخطوة)' : 'How to Administer the SDI Platform (Step-by-Step)'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                {isArabic
                  ? 'بصفتك المشرف الوحيد المخول، إليك الإجراءات الدقيقة المتاحة لتنفيذها في كل جزء دون الحاجة إلى قراءات طويلة. كل إجراء يتطلب خطوات فعلية محددة.'
                  : 'As the authorized Administrator, here are the direct operational protocols for each section of the platform. Follow these exact action steps to manage members, courses, news, and 4,000 ID credentials.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1 */}
              <div className="bubble-glass rounded-[2rem] p-6 bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white font-mono">01. IDs Pool</span>
                  <span className="text-emerald-700">{isArabic ? 'تفعيل اشتراك عام كامل' : '1-Year Subscription'}</span>
                </div>
                <h4 className="font-bold text-base text-slate-900">
                  {isArabic ? 'تفعيل اشتراك طبيب بالمعرف' : 'Elevate / Activate Member ID'}
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 font-mono">
                  <li>{isArabic ? 'افتح تبويب "المعرفات" (IDs Pool) من القائمة العلوية.' : 'Click "IDs Pool" from the top navigation.'}</li>
                  <li>{isArabic ? 'اكتب رقم معرف الطبيب (مثال: SDI-0012) في شريط البحث.' : 'Type the doctor’s ID (e.g. SDI-0012) in the search bar.'}</li>
                  <li>{isArabic ? 'اضغط زر "تفعيل / ترقية (سنة)" الأخضر لمنحه صلاحية الوصول لكافة أقسام الموقع لمدة 365 يوماً.' : 'Click the green "Elevate / Activate" button to unlock full platform access for 365 days.'}</li>
                  <li>{isArabic ? 'عند انتهاء العام، يمكنك الضغط على "تجديد +1 عام" لتمديد عضويته.' : 'When the term expires, click "Renew +1 Year" to extend active standing.'}</li>
                </ol>
              </div>

              {/* Box 2 */}
              <div className="bubble-glass rounded-[2rem] p-6 bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="px-2.5 py-1 rounded-full bg-[#15803d] text-white font-mono">02. Roster</span>
                  <span className="text-slate-700">{isArabic ? 'إدارة مركزية' : 'Central Registry'}</span>
                </div>
                <h4 className="font-bold text-base text-slate-900">
                  {isArabic ? 'إدراج وتوثيق طبيب بالسجل' : 'Enroll Verified Physician'}
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 font-mono">
                  <li>{isArabic ? 'افتح تبويب "الأطباء" (Doctors Roster).' : 'Click "Doctors Roster" tab.'}</li>
                  <li>{isArabic ? 'املأ نموذج "إضافة طبيب جديد": الاسم، رقم الـ IMC، التخصص، والمستشفى.' : 'Fill the "Enroll New Physician" form: Name, IMC number, specialty, hospital.'}</li>
                  <li>{isArabic ? 'اضغط "إضافة الطبيب إلى السجل" ليظهر فوراً في دليل الأطباء.' : 'Click "Add Clinician" to instantly publish to the verified directory.'}</li>
                  <li>{isArabic ? 'لتعديل أو حذف أي طبيب، استخدم زري (تعديل) أو (حذف) بجانب اسم الطبيب.' : 'Use the Edit or Delete buttons next to any doctor row to update credentials.'}</li>
                </ol>
              </div>

              {/* Box 3 */}
              <div className="bubble-glass rounded-[2rem] p-6 bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="px-2.5 py-1 rounded-full bg-blue-700 text-white font-mono">03. News</span>
                  <span className="text-blue-800">{isArabic ? 'بث فوري' : 'Instant Broadcast'}</span>
                </div>
                <h4 className="font-bold text-base text-slate-900">
                  {isArabic ? 'نشر بيان رسمي من الأمانة' : 'Publish Secretariat Bulletin'}
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 font-mono">
                  <li>{isArabic ? 'افتح تبويب "البيانات والأخبار" (News).' : 'Select the "News" tab.'}</li>
                  <li>{isArabic ? 'أدخل عنوان البيان بالإنجليزية أو العربية، وحدد التصنيف والملخص.' : 'Enter Bulletin Title, Category, and Summary.'}</li>
                  <li>{isArabic ? 'اضغط "نشر البيان" ليظهر في الصفحة الرئيسية وصفحة الأخبار مباشرة.' : 'Click "Publish Bulletin" to broadcast immediately across the site.'}</li>
                  <li>{isArabic ? 'لحذف أي بيان، انقر على أيقونة سلة المهملات الحمراء بجوار البيان.' : 'Click the red trash icon to permanently remove outdated dispatches.'}</li>
                </ol>
              </div>

              {/* Box 4 */}
              <div className="bubble-glass rounded-[2rem] p-6 bg-white border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="px-2.5 py-1 rounded-full bg-purple-700 text-white font-mono">04. Export</span>
                  <span className="text-purple-800">{isArabic ? 'تقارير PDF' : 'PDF Audit'}</span>
                </div>
                <h4 className="font-bold text-base text-slate-900">
                  {isArabic ? 'تصدير التقارير الرسمية المطبوعة' : 'Generate Official PDF Reports'}
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-600 space-y-1.5 font-mono">
                  <li>{isArabic ? 'انقر على زر "تصدير PDF" في شريط رأس لوحة التحكم بالأعلى.' : 'Hover over "Export PDF" in the top console navigation bar.'}</li>
                  <li>{isArabic ? 'اختر "تقرير سجل الأطباء" أو "كتالوج الدورات المعتمدة" أو "التقرير الشامل".' : 'Select "Doctors Roster PDF", "Courses Catalog", or "Consolidated Audit".'}</li>
                  <li>{isArabic ? 'يبدأ التنزيل الفوري لوثيقة رسمية منسقة للطباعة والتدقيق لدى المجلس الطبي.' : 'The formatted document downloads immediately for IMC audit or archive.'}</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          DELETE CONFIRMATION MODAL
          ======================================================== */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bubble-glass w-full max-w-md rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 bg-white border border-white/95 shadow-2xl text-slate-900 space-y-4 max-h-[92vh] max-h-[92dvh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200 shrink-0">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-base text-[#0f172a]">
                  {isArabic ? 'تأكيد الحذف النهائي' : 'Confirm Permanent Deletion'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isArabic ? 'هل أنت متأكد من رغبتك في حذف هذا العنصر؟' : 'Are you sure you want to permanently delete this item?'}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 break-words">
              {itemToDelete.name}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                {isArabic ? 'حذف نهائي' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT DOCTOR MODAL
          ======================================================== */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bubble-glass w-full max-w-lg rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 bg-white border border-white/95 shadow-2xl text-slate-900 space-y-4 max-h-[92vh] max-h-[92dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-base text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">edit</span>
                <span>{isArabic ? 'تعديل بيانات الطبيب' : 'Edit Clinician Record'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateExistingDoctor} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'الاسم بالإنجليزية' : 'Full Name (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={editingDoctor.name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'الاسم بالعربية' : 'Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={editingDoctor.nameAr || ''}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, nameAr: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'رقم المجلس الطبي' : 'IMC Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editingDoctor.imcNumber}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, imcNumber: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'السجل' : 'Division'}
                  </label>
                  <select
                    value={editingDoctor.division}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, division: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden"
                  >
                    <option value="Specialist Division">Specialist Division</option>
                    <option value="General Division">General Division</option>
                    <option value="Trainee Specialist">Trainee Specialist</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'التخصص السريري' : 'Specialty'}
                </label>
                <input
                  type="text"
                  value={editingDoctor.specialty}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'المستشفى' : 'Hospital'}
                </label>
                <input
                  type="text"
                  value={editingDoctor.hospital}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, hospital: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'رقم الواتساب' : 'WhatsApp Number'}
                  </label>
                  <input
                    type="text"
                    value={editingDoctor.whatsapp || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, whatsapp: e.target.value })}
                    placeholder="+353 89 251 5586"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'البريد الإلكتروني' : 'Direct Email'}
                  </label>
                  <input
                    type="email"
                    value={editingDoctor.email || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, email: e.target.value })}
                    placeholder="doctor@gmail.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'الصورة الشخصية (رفع مباشر)' : 'Profile Photo (Direct Upload)'}
                </label>
                <div className="flex items-center gap-2">
                  {editingDoctor.photoUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs">
                      <img
                        src={editingDoctor.photoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}
                  <input
                    type="text"
                    value={editingDoctor.photoUrl || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, photoUrl: e.target.value })}
                    placeholder="/dr-al-samoual-awad.jpg"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-[15px]">upload</span>
                    <span>{isArabic ? 'اختر ملف' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = async () => {
                          const dataUrl = reader.result as string;
                          const res = await fetch('/api/upload-doctor-photo', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              dataUrl,
                              filename: file.name,
                              doctorId: editingDoctor.id,
                            }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            setEditingDoctor({ ...editingDoctor, photoUrl: data.url });
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* CV / Credentials PDF Upload */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'وثيقة السيرة الذاتية والاعتماد (PDF)' : 'Credentials / CV Document (PDF)'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingDoctor.cvPdfUrl || ''}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, cvPdfUrl: e.target.value })}
                    placeholder="https://... or upload PDF"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                    <span>PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = async () => {
                          const dataUrl = reader.result as string;
                          const res = await fetch('/api/upload-pdf', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ dataUrl, filename: file.name, section: 'doctor' }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            setEditingDoctor({ ...editingDoctor, cvPdfUrl: data.url, cvPdfName: data.name || file.name });
                            showToast(isArabic ? 'تم رفع ملف الـ PDF بنجاح' : 'PDF document uploaded.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
                {editingDoctor.cvPdfName && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-emerald-800">
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    <span className="truncate max-w-xs">{editingDoctor.cvPdfName}</span>
                    <button
                      type="button"
                      onClick={() => setEditingDoctor({ ...editingDoctor, cvPdfUrl: '', cvPdfName: '' })}
                      className="text-rose-600 ml-1"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Video Recording Link */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'رابط تسجيل الفيديو / الكلمة التعريفية أو المحاضرة' : 'Doctor Introduction Video / Lecture Link'}
                </label>
                <input
                  type="url"
                  value={editingDoctor.recordingUrl || ''}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, recordingUrl: e.target.value })}
                  placeholder="https://youtube.com/... or Vimeo/Zoom/Drive link"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'النبذة المهنية' : 'Professional Biography'}
                </label>
                <textarea
                  rows={2}
                  value={editingDoctor.bio || ''}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold shadow-md transition-colors"
                >
                  {isArabic ? 'تحديث البيانات' : 'Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT COURSE MODAL
          ======================================================== */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bubble-glass w-full max-w-lg rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 bg-white border border-white/95 shadow-2xl text-slate-900 space-y-4 max-h-[92vh] max-h-[92dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-base text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">edit</span>
                <span>{isArabic ? 'تعديل الدورة التدريبية' : 'Edit Course / Masterclass'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateExistingCourse} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'عنوان الدورة (الإنجليزية)' : 'Course Title (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={editingCourse.title}
                  onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'عنوان الدورة (العربية)' : 'Course Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={editingCourse.titleAr || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, titleAr: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'ساعات التطوير (CPD)' : 'CPD Units'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={editingCourse.cpdUnits}
                    onChange={(e) => setEditingCourse({ ...editingCourse, cpdUnits: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'صلاحية الوصول' : 'Access Type'}
                  </label>
                  <select
                    value={editingCourse.accessType}
                    onChange={(e) => setEditingCourse({ ...editingCourse, accessType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden"
                  >
                    <option value="members">Members Only</option>
                    <option value="open">Open Access</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'صورة الغلاف / البانر' : 'Course Banner / Thumbnail Image'}
                </label>
                <div className="flex items-center gap-2">
                  {editingCourse.imageUrl && (
                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img src={editingCourse.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={editingCourse.imageUrl || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, imageUrl: e.target.value })}
                    placeholder="https://... or upload"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-[15px]">upload</span>
                    <span>{isArabic ? 'رفع' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = async () => {
                          const dataUrl = reader.result as string;
                          const res = await fetch('/api/upload-image', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ dataUrl, filename: file.name, section: 'course' }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            setEditingCourse({ ...editingCourse, imageUrl: data.url });
                            showToast(isArabic ? 'تم رفع صورة الدورة بنجاح' : 'Course banner uploaded.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'ملف المحاضرة أو الدليل (PDF)' : 'Course Handbook / Slides (PDF)'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingCourse.pdfUrl || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, pdfUrl: e.target.value })}
                    placeholder="https://... or upload PDF"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                    <span>PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = async () => {
                          const dataUrl = reader.result as string;
                          const res = await fetch('/api/upload-course-pdf', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ dataUrl, filename: file.name }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            setEditingCourse({ ...editingCourse, pdfUrl: data.url, pdfName: data.name || file.name });
                            showToast(isArabic ? 'تم رفع مستند الـ PDF' : 'Course PDF uploaded.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'رابط تسجيل المحاضرة (YouTube / Vimeo / Video)' : 'Full Lecture Recording URL'}
                </label>
                <input
                  type="url"
                  value={editingCourse.recordingUrl || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, recordingUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... or Vimeo"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'رابط البث أو الغرفة الافتراضية المباشرة (Zoom / Teams)' : 'Live Virtual Classroom URL'}
                </label>
                <input
                  type="url"
                  value={editingCourse.lessonUrl || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, lessonUrl: e.target.value })}
                  placeholder="https://zoom.us/j/... or Google Meet"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={editingCourse.description}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold shadow-md transition-colors"
                >
                  {isArabic ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT NEWS MODAL
          ======================================================== */}
      {editingNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bubble-glass w-full max-w-lg rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 bg-white border border-white/95 shadow-2xl text-slate-900 space-y-4 max-h-[92vh] max-h-[92dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-base text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">edit</span>
                <span>{isArabic ? 'تعديل البيان الصحفي أو الإعلان' : 'Edit News Bulletin'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingNews(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateExistingNews} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'عنوان البيان (الإنجليزية)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={editingNews.title}
                  onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'عنوان البيان (العربية)' : 'Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={editingNews.titleAr || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, titleAr: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'الملخص' : 'Summary'}
                </label>
                <textarea
                  rows={2}
                  value={editingNews.summary}
                  onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'التفاصيل الكاملة' : 'Full Details'}
                </label>
                <textarea
                  rows={3}
                  value={editingNews.details}
                  onChange={(e) => setEditingNews({ ...editingNews, details: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'صورة الغلاف / البانر' : 'Bulletin Image Banner'}
                </label>
                <div className="flex items-center gap-2">
                  {editingNews.imageUrl && (
                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img src={editingNews.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={editingNews.imageUrl || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, imageUrl: e.target.value })}
                    placeholder="https://... or upload"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-[15px]">upload</span>
                    <span>{isArabic ? 'رفع' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = async () => {
                          const dataUrl = reader.result as string;
                          const res = await fetch('/api/upload-image', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ dataUrl, filename: file.name, section: 'news' }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            setEditingNews({ ...editingNews, imageUrl: data.url });
                            showToast(isArabic ? 'تم رفع صورة البيان' : 'News image uploaded.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'المرسوم أو البيان الرسمي (PDF)' : 'Official Decree Document (PDF)'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingNews.pdfUrl || ''}
                    onChange={(e) => setEditingNews({ ...editingNews, pdfUrl: e.target.value })}
                    placeholder="https://... or upload PDF"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                    <span>PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = async () => {
                          const dataUrl = reader.result as string;
                          const res = await fetch('/api/upload-pdf', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ dataUrl, filename: file.name, section: 'news' }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            setEditingNews({ ...editingNews, pdfUrl: data.url, pdfName: data.name || file.name });
                            showToast(isArabic ? 'تم رفع ملف الـ PDF' : 'News PDF uploaded.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'رابط التسجيل المرئي أو الصوتي' : 'Video/Audio Briefing Link'}
                </label>
                <input
                  type="url"
                  value={editingNews.recordingUrl || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, recordingUrl: e.target.value })}
                  placeholder="https://youtube.com/... or Vimeo"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingNews(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold shadow-md transition-colors"
                >
                  {isArabic ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          EDIT RESOURCE MODAL
          ======================================================== */}
      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bubble-glass w-full max-w-lg rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 bg-white border border-white/95 shadow-2xl text-slate-900 space-y-4 max-h-[92vh] max-h-[92dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-bold text-base text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">edit</span>
                <span>{isArabic ? 'تعديل الوثيقة السريرية' : 'Edit Clinical Guideline'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingResource(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateExistingResource} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'عنوان الوثيقة (الإنجليزية)' : 'Document Title (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={editingResource.title}
                  onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'عنوان الوثيقة (العربية)' : 'Document Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={editingResource.titleAr || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, titleAr: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={editingResource.category}
                    onChange={(e) => setEditingResource({ ...editingResource, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden"
                  >
                    <option value="National HSE Algorithm">National HSE Algorithm</option>
                    <option value="Medicolegal Guidance">Medicolegal Guidance</option>
                    <option value="Clinical Audit Protocol">Clinical Audit Protocol</option>
                    <option value="Prescribing & Formulary">Prescribing & Formulary</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isArabic ? 'الرمز المرجعي' : 'Reference Code'}
                  </label>
                  <input
                    type="text"
                    value={editingResource.code}
                    onChange={(e) => setEditingResource({ ...editingResource, code: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'مخطط بياني أو صورة توضيحية' : 'Flowchart / Infographic Image'}
                </label>
                <div className="flex items-center gap-2">
                  {editingResource.imageUrl && (
                    <div className="w-12 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img src={editingResource.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={editingResource.imageUrl || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, imageUrl: e.target.value })}
                    placeholder="https://... or upload"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-[15px]">upload</span>
                    <span>{isArabic ? 'رفع' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = async () => {
                          const dataUrl = reader.result as string;
                          const res = await fetch('/api/upload-image', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ dataUrl, filename: file.name, section: 'resource' }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            setEditingResource({ ...editingResource, imageUrl: data.url });
                            showToast(isArabic ? 'تم رفع صورة المخطط السريري' : 'Infographic image uploaded.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'وثيقة البروتوكول (PDF)' : 'Guideline Document (PDF)'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingResource.pdfUrl || ''}
                    onChange={(e) => setEditingResource({ ...editingResource, pdfUrl: e.target.value })}
                    placeholder="https://... or upload PDF"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                  />
                  <label className="cursor-pointer px-3 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-2xs">
                    <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                    <span>PDF</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = async () => {
                          const dataUrl = reader.result as string;
                          const res = await fetch('/api/upload-pdf', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ dataUrl, filename: file.name, section: 'resource' }),
                          });
                          const data = await res.json();
                          if (data.url) {
                            setEditingResource({ ...editingResource, pdfUrl: data.url, pdfName: data.name || file.name, fileUrl: data.url });
                            showToast(isArabic ? 'تم رفع ملف الـ PDF' : 'Guideline PDF uploaded.');
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'رابط الشرح المرئي أو المحاضرة' : 'Clinical Walkthrough Recording URL'}
                </label>
                <input
                  type="url"
                  value={editingResource.recordingUrl || ''}
                  onChange={(e) => setEditingResource({ ...editingResource, recordingUrl: e.target.value })}
                  placeholder="https://youtube.com/... or Drive"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d] text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {isArabic ? 'الوصف' : 'Description'}
                </label>
                <textarea
                  rows={2}
                  value={editingResource.description}
                  onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-[#15803d]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold shadow-md transition-colors"
                >
                  {isArabic ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
