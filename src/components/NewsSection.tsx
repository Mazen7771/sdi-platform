import React from 'react';
import { NewsItem, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { NEWS_ITEMS } from '../data';

interface NewsSectionProps {
  lang: Language;
  news?: NewsItem[];
  onSelectNews: (news: NewsItem) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ lang, news = NEWS_ITEMS, onSelectNews }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="w-full py-20 relative bg-white" id="section-news">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-700 uppercase tracking-widest font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              <span>{t.newsTag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-slate-900 tracking-tight">
              {t.newsHeading}
            </h2>
            <div className="w-16 h-[2px] bg-slate-300 mt-2"></div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
            {t.newsSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {news.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onSelectNews(item)}
              className="optical-glass rounded-3xl p-6 relative flex flex-col justify-between hover:border-slate-400 transition-all group bg-white border border-slate-200 shadow-sm cursor-pointer"
            >
              {idx === 0 && <span className="crosshair-corner crosshair-tl"></span>}
              {idx === 2 && <span className="crosshair-corner crosshair-tr"></span>}

              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-700 font-semibold mb-3">
                  <span className="material-symbols-outlined text-[14px]">
                    {idx === 0 ? 'calendar_month' : idx === 1 ? 'school' : 'verified'}
                  </span>
                  <span>{lang === 'ar' ? item.dateAr : item.date} • {lang === 'ar' ? item.locationAr : item.location}</span>
                </div>

                <h3 className="text-lg font-headline font-bold text-slate-900 group-hover:text-black transition-colors mb-3">
                  {lang === 'ar' ? item.titleAr : item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {lang === 'ar' ? item.summaryAr : item.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">
                  {lang === 'ar' ? item.categoryAr : item.category}
                </span>
                <span className="text-slate-900 hover:text-black flex items-center gap-1 font-bold">
                  <span>{lang === 'ar' ? item.actionTextAr : item.actionText}</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
