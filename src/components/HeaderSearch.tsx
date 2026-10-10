import React, { useState, useEffect, useRef } from 'react';
import { DoctorMember, Course, NewsItem, Language } from '../types';

interface HeaderSearchProps {
  lang: Language;
  doctors: DoctorMember[];
  courses: Course[];
  news: NewsItem[];
  compact?: boolean;
  onSelectDoctor: (doctor: DoctorMember) => void;
  onSelectCourse: (course: Course) => void;
  onSelectNews: (news: NewsItem) => void;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  lang,
  doctors,
  courses,
  news,
  compact = false,
  onSelectDoctor,
  onSelectCourse,
  onSelectNews,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'doctors' | 'courses' | 'news'>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const cleanQ = query.trim().toLowerCase();

  const filteredDoctors = cleanQ
    ? doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(cleanQ) ||
          (d.nameAr && d.nameAr.toLowerCase().includes(cleanQ)) ||
          d.id.toLowerCase().includes(cleanQ) ||
          d.imcNumber.toLowerCase().includes(cleanQ) ||
          d.specialty.toLowerCase().includes(cleanQ) ||
          (d.specialtyAr && d.specialtyAr.toLowerCase().includes(cleanQ)) ||
          d.hospital.toLowerCase().includes(cleanQ) ||
          (d.hospitalAr && d.hospitalAr.toLowerCase().includes(cleanQ))
      )
    : [];

  const filteredCourses = cleanQ
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(cleanQ) ||
          (c.titleAr && c.titleAr.toLowerCase().includes(cleanQ)) ||
          c.description.toLowerCase().includes(cleanQ) ||
          (c.descriptionAr && c.descriptionAr.toLowerCase().includes(cleanQ)) ||
          c.leadFaculty.toLowerCase().includes(cleanQ) ||
          c.cohort.toLowerCase().includes(cleanQ) ||
          (c.syllabus && c.syllabus.some((s) => s.toLowerCase().includes(cleanQ)))
      )
    : [];

  const filteredNews = cleanQ
    ? news.filter(
        (n) =>
          n.title.toLowerCase().includes(cleanQ) ||
          (n.titleAr && n.titleAr.toLowerCase().includes(cleanQ)) ||
          n.summary.toLowerCase().includes(cleanQ) ||
          (n.summaryAr && n.summaryAr.toLowerCase().includes(cleanQ)) ||
          (n.category && n.category.toLowerCase().includes(cleanQ)) ||
          (n.location && n.location.toLowerCase().includes(cleanQ))
      )
    : [];

  const totalResults = filteredDoctors.length + filteredCourses.length + filteredNews.length;

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSelectDoc = (doc: DoctorMember) => {
    onSelectDoctor(doc);
    setIsOpen(false);
  };

  const handleSelectCourseItem = (c: Course) => {
    onSelectCourse(c);
    setIsOpen(false);
  };

  const handleSelectNewsItem = (n: NewsItem) => {
    onSelectNews(n);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Header Search Trigger */}
      {compact ? (
        <button
          type="button"
          onClick={handleOpen}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bubble-glass-pill text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-emerald-500 bg-white/80 transition-all cursor-pointer shadow-2xs group shrink-0"
          title={lang === 'ar' ? 'البحث السريع (Ctrl+K)' : 'Quick Search (⌘K)'}
          aria-label="Quick Search"
        >
          <span className="material-symbols-outlined text-[17px] text-slate-500 group-hover:text-slate-900 transition-colors">
            search
          </span>
          <span className="text-xs font-mono text-slate-600 group-hover:text-slate-900 hidden 2xl:inline select-none">
            {lang === 'ar' ? 'بحث' : 'Search'}
          </span>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
            ⌘K
          </span>
        </button>
      ) : (
        <div
          onClick={handleOpen}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/90 cursor-pointer transition-all shadow-2xs group w-44 sm:w-56 md:w-64"
        >
          <span className="material-symbols-outlined text-[17px] text-slate-500 group-hover:text-slate-900 transition-colors">
            search
          </span>
          <span className="text-xs font-mono text-slate-500 group-hover:text-slate-700 truncate select-none">
            {lang === 'ar' ? 'بحث أطباء، دورات، أخبار...' : 'Search registry, CPD, news...'}
          </span>
          <span className="hidden sm:inline-block ml-auto text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
            ⌘K
          </span>
        </div>
      )}

      {/* Floating Optical Glass Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 sm:left-auto right-0 sm:-right-12 md:right-0 w-[92vw] sm:w-[480px] md:w-[540px] max-w-[calc(100vw-1.5rem)] optical-glass rounded-2xl p-3 sm:p-4 bg-white/95 border border-slate-200 shadow-2xl z-50 animate-fadeIn text-slate-900 max-h-[82vh] max-h-[82dvh] flex flex-col">
          <span className="crosshair-corner crosshair-tl"></span>
          <span className="crosshair-corner crosshair-tr"></span>
          <span className="crosshair-corner crosshair-bl"></span>
          <span className="crosshair-corner crosshair-br"></span>

          {/* Search Input Bar */}
          <div className="relative mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-500 text-lg absolute left-3">search</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                lang === 'ar'
                  ? 'ابحث بالاسم، رقم IMC، التخصص، الدورة أو الخبر...'
                  : 'Type physician name, IMC#, specialty, course, or news...'
              }
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono focus:bg-white focus:border-slate-900 focus:outline-none transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-800 text-xs font-mono"
              >
                ✕
              </button>
            )}
          </div>

          {/* Preset Quick Chips */}
          {!cleanQ && (
            <div className="py-2 border-b border-slate-100 text-xs space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                {lang === 'ar' ? 'مقترحات بحث شائعة:' : 'Quick Suggested Searches:'}
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {['Cardiology', 'MRCPI', 'Emergency', '10452', 'General Assembly', 'POCUS'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                  >
                    #{item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter Tabs */}
          {cleanQ && (
            <div className="flex items-center gap-1 pb-2.5 border-b border-slate-100 text-[11px] font-mono">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {lang === 'ar' ? 'الكل' : 'All'} ({totalResults})
              </button>
              <button
                onClick={() => setActiveCategory('doctors')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeCategory === 'doctors'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {lang === 'ar' ? 'الأطباء' : 'Doctors'} ({filteredDoctors.length})
              </button>
              <button
                onClick={() => setActiveCategory('courses')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeCategory === 'courses'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {lang === 'ar' ? 'الدورات' : 'Courses'} ({filteredCourses.length})
              </button>
              <button
                onClick={() => setActiveCategory('news')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeCategory === 'news'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {lang === 'ar' ? 'الأخبار' : 'News'} ({filteredNews.length})
              </button>
            </div>
          )}

          {/* Scrollable Results Container */}
          <div className="overflow-y-auto flex-1 space-y-4 pt-3 pr-1 text-xs">
            {cleanQ && totalResults === 0 && (
              <div className="text-center py-8 text-slate-500 font-mono text-xs">
                <span className="material-symbols-outlined text-2xl text-slate-400 mb-1 block">search_off</span>
                {lang === 'ar' ? 'لم يتم العثور على نتائج مطابقة.' : 'No matching records found across registry or curriculum.'}
              </div>
            )}

            {/* Doctors Section */}
            {(activeCategory === 'all' || activeCategory === 'doctors') && filteredDoctors.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  <span className="material-symbols-outlined text-[14px]">stethoscope</span>
                  <span>{lang === 'ar' ? 'الأطباء والممارسون الصحيون' : 'Verified Physicians & Registrars'}</span>
                </div>
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDoc(doc)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {doc.id.slice(-2)}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-slate-900 truncate group-hover:text-black">
                          {lang === 'ar' && doc.nameAr ? doc.nameAr : doc.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate font-mono">
                          {lang === 'ar' && doc.specialtyAr ? doc.specialtyAr : doc.specialty} • {doc.hospital}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold block">
                        IMC #{doc.imcNumber}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">#{doc.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Courses Section */}
            {(activeCategory === 'all' || activeCategory === 'courses') && filteredCourses.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  <span className="material-symbols-outlined text-[14px]">school</span>
                  <span>{lang === 'ar' ? 'الدورات والمحاضرات السريرية' : 'CPD Courses & Clinical Masterclasses'}</span>
                </div>
                {filteredCourses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCourseItem(c)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate group-hover:text-black">
                        {lang === 'ar' ? c.titleAr : c.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {lang === 'ar' ? c.leadFacultyAr : c.leadFaculty} • {c.format}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-900 font-bold shrink-0">
                      {c.cpdUnits} CPD
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* News & Meetings Section */}
            {(activeCategory === 'all' || activeCategory === 'news') && filteredNews.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  <span className="material-symbols-outlined text-[14px]">newspaper</span>
                  <span>{lang === 'ar' ? 'الأخبار والإعلانات والاجتماعات' : 'Announcements & Meetings'}</span>
                </div>
                {filteredNews.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleSelectNewsItem(n)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 cursor-pointer transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate group-hover:text-black">
                        {lang === 'ar' ? n.titleAr : n.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {lang === 'ar' ? n.dateAr : n.date} • {lang === 'ar' ? n.locationAr : n.location}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                      {lang === 'ar' ? n.categoryAr : n.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>{lang === 'ar' ? 'اضغط ESC للإغلاق' : 'Press ESC to close'}</span>
            <span className="text-slate-600 font-medium">SDI Live Registry Mesh</span>
          </div>
        </div>
      )}
    </div>
  );
};
