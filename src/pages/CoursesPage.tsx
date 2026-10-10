import React, { useState } from 'react';
import { Language, Course, AppPage } from '../types';
import { RestrictedAccessNotice } from '../components/RestrictedAccessNotice';

interface CoursesPageProps {
  lang: Language;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  isActivated: boolean;
  onNavigate: (page: AppPage) => void;
  onOpenCreateAccount: () => void;
  onRequestAdmin: () => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  lang,
  courses,
  onSelectCourse,
  isActivated,
  onNavigate,
  onOpenCreateAccount,
  onRequestAdmin,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'members' | 'open'>('all');

  // If user is not activated by admin, render the restriction notice
  if (!isActivated) {
    return (
      <RestrictedAccessNotice
        lang={lang}
        targetPage="courses"
        onNavigateToNews={() => onNavigate('news')}
        onOpenCreateAccount={onOpenCreateAccount}
        onRequestAdmin={onRequestAdmin}
      />
    );
  }

  const filteredCourses = courses.filter((c) => {
    if (selectedFilter === 'all') return true;
    return c.accessType === selectedFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="space-y-4 border-b border-slate-200 pb-8 scroll-reveal reveal-group" data-reveal="true" data-stagger-children="true">
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs sm:text-sm font-bold text-[#15803d]">
          <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse"></span>
          <span>{lang === 'ar' ? 'البرامج والتدريب الطبي' : 'Clinical Education & Training'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="reveal-item">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline text-slate-900 tracking-tight">
              {lang === 'ar' ? 'الدورات والتأهيل السريري' : 'Clinical Masterclasses & CPD'}
            </h1>
            <p className="text-sm font-mono text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'برامج سريرية متقدمة تشمل محاكاة امتحانات الكلية الملكية للأطباء (MRCPI)، التعريف للأطباء غير الاستشاريين الجدد (NCHD)، وساعات التطوير المهني السنوية.'
                : 'Accredited clinical preparation for MRCPI bedside examinations, HSE junior doctor orientations, and annual Royal College aligned CPD series.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 reveal-item">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`bubble-selection-pill ${
                selectedFilter === 'all'
                  ? 'bubble-selection-pill--active'
                  : 'bubble-selection-pill--inactive'
              }`}
            >
              {lang === 'ar' ? 'الكل' : 'All Modules'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('members')}
              className={`bubble-selection-pill ${
                selectedFilter === 'members'
                  ? 'bubble-selection-pill--active'
                  : 'bubble-selection-pill--inactive'
              }`}
            >
              {lang === 'ar' ? 'للأعضاء' : 'Members'}
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('open')}
              className={`bubble-selection-pill ${
                selectedFilter === 'open'
                  ? 'bubble-selection-pill--active'
                  : 'bubble-selection-pill--inactive'
              }`}
            >
              {lang === 'ar' ? 'مفتوح' : 'Open'}
            </button>
          </div>
        </div>
      </div>

      {/* Courses Cards Grid (Sequential Scroll Reveal) */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bubble-glass rounded-3xl border border-slate-200 p-8 space-y-2">
          <span className="material-symbols-outlined text-4xl text-slate-400">school</span>
          <p className="text-sm font-mono text-slate-600 font-bold">
            {lang === 'ar' ? 'لا توجد دورات مطابقة لهذا التصنيف حالياً.' : 'No courses found in this category currently.'}
          </p>
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className="text-xs text-emerald-700 font-bold underline cursor-pointer"
          >
            {lang === 'ar' ? 'عرض جميع الدورات' : 'View all modules'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 reveal-group" data-stagger-children="true">
          {filteredCourses.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectCourse(c)}
              className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 border border-white/90 hover:border-emerald-600 transition-all flex flex-col justify-between cursor-pointer group shadow-md hover:shadow-2xl reveal-item"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-3 py-1 rounded-full bubble-glass-pill text-emerald-800 font-bold border border-emerald-300">
                    +{c.cpdUnits} {lang === 'ar' ? 'نقطة معتمدة' : 'CPD Points'}
                  </span>
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    {c.accessType === 'members' ? (lang === 'ar' ? 'خاص بالأعضاء' : 'Members Only') : (lang === 'ar' ? 'وصول مفتوح' : 'Open Access')}
                  </span>
                </div>

                {/* Course Banner Thumbnail if uploaded */}
                {c.imageUrl && (
                  <div className="w-full h-36 rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100">
                    <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}

                {/* Media & Materials Tags */}
                {(c.recordingUrl || c.lessonUrl || c.pdfUrl) && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {c.recordingUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold font-mono">
                        <span className="material-symbols-outlined text-[13px]">play_circle</span>
                        <span>{lang === 'ar' ? 'تسجيل' : 'Recording'}</span>
                      </span>
                    )}
                    {c.lessonUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold font-mono">
                        <span className="material-symbols-outlined text-[13px]">videocam</span>
                        <span>{lang === 'ar' ? 'درس مباشر' : 'Live'}</span>
                      </span>
                    )}
                    {c.pdfUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold font-mono">
                        <span className="material-symbols-outlined text-[13px]">picture_as_pdf</span>
                        <span>PDF</span>
                      </span>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-headline text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                    {lang === 'ar' ? c.titleAr || c.title : c.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-600 leading-relaxed line-clamp-3">
                    {lang === 'ar' ? c.descriptionAr || c.description : c.description}
                  </p>
                </div>

                {/* Syllabus Preview */}
                <div className="p-4 rounded-2xl bubble-glass-pill border border-slate-200/80 space-y-1.5 text-xs font-mono">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {lang === 'ar' ? 'المحطات والوحدات التدريبية' : 'Key Stations Included'}
                  </span>
                  <div className="text-slate-700 line-clamp-2">
                    {lang === 'ar' && c.syllabusAr ? c.syllabusAr.slice(0, 2).join(' • ') : c.syllabus.slice(0, 2).join(' • ')}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200/80 mt-6 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">
                  {lang === 'ar' ? c.cohortAr || c.cohort : c.cohort}
                </span>
                <span className="font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                  <span>{lang === 'ar' ? 'عرض المنهج والجدول' : 'View Syllabus'}</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
