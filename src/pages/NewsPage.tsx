import React, { useState } from 'react';
import { Language, NewsItem } from '../types';

interface NewsPageProps {
  lang: Language;
  news: NewsItem[];
  onSelectNews: (item: NewsItem) => void;
  currentId: string | null;
  isActivated: boolean;
}

export const NewsPage: React.FC<NewsPageProps> = ({
  lang,
  news,
  onSelectNews,
  currentId,
  isActivated,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { key: 'all', en: 'All Dispatches', ar: 'كافة البيانات' },
    { key: 'Convention Centre', en: 'Convention Centre', ar: 'مركز المؤتمرات' },
    { key: 'Applications Active', en: 'Mentorship Scheme', ar: 'برنامج الإرشاد' },
    { key: 'Instant Export', en: 'Regulatory Vault', ar: 'السجل والتنظيم' },
  ];

  const filteredNews = news.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      (item.titleAr && item.titleAr.includes(query)) ||
      item.summary.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Top Page Header */}
      <div className="space-y-4 border-b border-slate-200 pb-8 scroll-reveal reveal-group" data-reveal="true" data-stagger-children="true">
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs sm:text-sm font-bold text-[#15803d]">
          <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse"></span>
          <span>{lang === 'ar' ? 'الأخبار والبيانات الرسمية' : 'Official News & Announcements'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="reveal-item">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline text-slate-900 tracking-tight">
              {lang === 'ar' ? 'الأخبار والبيانات الرسمية' : 'News & Regulatory Dispatches'}
            </h1>
            <p className="text-sm font-mono text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'البيانات الصادرة عن الأمانة العامة لرابطة الأطباء السودانيين في إيرلندا، قرارات الجمعية العمومية، وتنبيهات اللوائح الطبية للمجلس الطبي ووزارة الصحة.'
                : 'Authoritative dispatches from the SDI Executive Secretariat, Annual General Meeting declarations, and Irish Medical Council compliance updates.'}
            </p>
          </div>

          {/* User Status Bar */}
          {currentId && (
            <div className="p-4 rounded-3xl bubble-glass border border-white/90 shadow-sm text-xs font-mono reveal-item">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">
                {lang === 'ar' ? 'معرفك النشط' : 'Active Credential'}
              </span>
              <span className="font-bold text-slate-900 text-sm">{currentId}</span>
              <span className={`block mt-0.5 text-[10px] font-bold ${
                isActivated ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {isActivated 
                  ? (lang === 'ar' ? '✓ مفعل بكامل الصلاحيات' : '✓ Full Access Activated') 
                  : (lang === 'ar' ? '• مقتصر على الأخبار فقط' : '• Restricted to News')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 scroll-reveal" data-reveal="true">
        {/* Category Pills with Bubble Glass styling */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`bubble-selection-pill whitespace-nowrap ${
                selectedCategory === cat.key
                  ? 'bubble-selection-pill--active'
                  : 'bubble-selection-pill--inactive'
              }`}
            >
              {lang === 'ar' ? cat.ar : cat.en}
            </button>
          ))}
        </div>

        {/* Search Input with Bubble Glass */}
        <div className="relative w-full sm:w-auto sm:min-w-[260px] max-w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث في البيانات...' : 'Search bulletins...'}
            className="bubble-glass-input w-full px-5 py-2.5 text-xs font-mono text-slate-900 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-slate-400 hover:text-black text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* News Grid (Sequential Scroll Reveal) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 reveal-group" data-stagger-children="true">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            onClick={() => onSelectNews(item)}
            className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 border border-white/90 hover:border-emerald-600 transition-all flex flex-col justify-between cursor-pointer group shadow-md hover:shadow-2xl reveal-item"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span className="px-3 py-1 rounded-full bubble-glass-pill text-slate-800 font-bold border border-slate-200">
                  {lang === 'ar' ? item.categoryAr || item.category : item.category}
                </span>
                <span>{lang === 'ar' ? item.dateAr || item.date : item.date}</span>
              </div>

              {/* News Banner Image if uploaded */}
              {item.imageUrl && (
                <div className="w-full h-36 rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}

              {/* Media Tags */}
              {(item.recordingUrl || item.pdfUrl) && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {item.recordingUrl && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold font-mono">
                      <span className="material-symbols-outlined text-[13px]">play_circle</span>
                      <span>{lang === 'ar' ? 'تسجيل مرئي' : 'Recording'}</span>
                    </span>
                  )}
                  {item.pdfUrl && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold font-mono">
                      <span className="material-symbols-outlined text-[13px]">picture_as_pdf</span>
                      <span>PDF</span>
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-headline text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug">
                  {lang === 'ar' ? item.titleAr || item.title : item.title}
                </h3>
                <p className="text-xs font-mono text-slate-600 leading-relaxed line-clamp-3">
                  {lang === 'ar' ? item.summaryAr || item.summary : item.summary}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/80 mt-6 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">{lang === 'ar' ? item.locationAr || item.location : item.location}</span>
              <span className="font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-1">
                <span>{lang === 'ar' ? item.actionTextAr || 'قراءة التفاصيل' : item.actionText || 'Read Brief'}</span>
                <span>→</span>
              </span>
            </div>
          </article>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="bubble-glass rounded-[2.5rem] p-12 text-center text-slate-500 font-mono text-xs border border-white/80">
          {lang === 'ar' ? 'لا توجد نتائج مطابقة لبحثك.' : 'No bulletins match your query.'}
        </div>
      )}
    </div>
  );
};
