import React, { useState } from 'react';
import { Language, AppPage, ResourceItem } from '../types';
import { RestrictedAccessNotice } from '../components/RestrictedAccessNotice';
import { INITIAL_RESOURCES } from '../data/resources';

interface ResourcesPageProps {
  lang: Language;
  isActivated: boolean;
  resources?: ResourceItem[];
  onNavigate: (page: AppPage) => void;
  onOpenCreateAccount: () => void;
  onRequestAdmin: () => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({
  lang,
  isActivated,
  resources = INITIAL_RESOURCES,
  onNavigate,
  onOpenCreateAccount,
  onRequestAdmin,
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!isActivated) {
    return (
      <RestrictedAccessNotice
        lang={lang}
        targetPage="resources"
        onNavigateToNews={() => onNavigate('news')}
        onOpenCreateAccount={onOpenCreateAccount}
        onRequestAdmin={onRequestAdmin}
      />
    );
  }

  const displayResources = resources && resources.length > 0 ? resources : INITIAL_RESOURCES;

  const handleDownload = (e: React.MouseEvent, res: ResourceItem) => {
    if (!res.fileUrl || res.fileUrl === '#') {
      e.preventDefault();
      setDownloadingId(res.id);
      setTimeout(() => {
        setDownloadingId(null);
      }, 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="space-y-4 border-b border-slate-200 pb-8 scroll-reveal reveal-group" data-reveal="true" data-stagger-children="true">
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs sm:text-sm font-bold text-[#15803d]">
          <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse"></span>
          <span>{lang === 'ar' ? 'المكتبة واللوائح السريرية' : 'Clinical Library & Guidelines'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="reveal-item">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-headline text-slate-900 tracking-tight">
              {lang === 'ar' ? 'المكتبة واللوائح الطبية' : 'Clinical Guidelines & Vault'}
            </h1>
            <p className="text-sm font-mono text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'مرجع اللوائح والبروتوكولات السريرية المعتمدة في المستشفيات الإيرلندية ونماذج تدقيق المجلس الطبي.'
                : 'Verified repository of national Irish clinical guidelines, medicolegal compliance blueprints, and IMC audit tools.'}
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 bg-white/70 px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
            {lang === 'ar' ? `إجمالي الوثائق المعتمدة: ${displayResources.length}` : `Accredited Documents: ${displayResources.length}`}
          </div>
        </div>
      </div>

      {/* Guidelines Grid (Sequential Scroll Reveal) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 reveal-group" data-stagger-children="true">
        {displayResources.map((res) => (
          <div
            key={res.id}
            className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 border border-white/90 hover:border-emerald-600 transition-all shadow-md hover:shadow-2xl space-y-4 reveal-item flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-3 py-1 rounded-full bubble-glass-pill text-slate-800 font-bold border border-slate-200">
                  {lang === 'ar' ? (res.categoryAr || res.category) : res.category}
                </span>
                <span className="text-slate-400 font-bold">{res.code}</span>
              </div>

              {/* Infographic / Flowchart Image if uploaded */}
              {res.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs max-h-48">
                  <img
                    src={res.imageUrl}
                    alt={res.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h3 className="text-lg font-bold font-headline text-slate-900">
                {lang === 'ar' ? (res.titleAr || res.title) : res.title}
              </h3>

              <p className="text-xs font-mono text-slate-600 leading-relaxed">
                {lang === 'ar' ? (res.descriptionAr || res.description) : res.description}
              </p>

              {/* Walkthrough Video Link if attached */}
              {res.recordingUrl && (
                <a
                  href={res.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold font-mono hover:bg-rose-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px] text-rose-600">play_circle</span>
                  <span>{lang === 'ar' ? 'مشاهدة الشرح التوضيحي' : 'Watch Clinical Walkthrough'}</span>
                  <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Official HSE Document</span>
              </span>
              {res.pdfUrl ? (
                <a
                  href={res.pdfUrl}
                  download={res.pdfName || `${res.code}-Guideline.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bubble-glass-pill font-bold text-[11px] shadow-xs cursor-pointer transition-all flex items-center gap-1 text-emerald-800 hover:bg-emerald-600 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span>
                  <span>{lang === 'ar' ? 'تحميل الوثيقة (PDF) ↓' : 'Download Document (PDF) ↓'}</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleDownload(e, res)}
                  className={`px-3.5 py-1.5 rounded-full bubble-glass-pill font-bold text-[11px] shadow-xs cursor-pointer transition-all flex items-center gap-1 ${
                    downloadingId === res.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-900 hover:bg-emerald-600 hover:text-white'
                  }`}
                >
                  <span>
                    {downloadingId === res.id
                      ? (lang === 'ar' ? '✓ تم التنزيل' : '✓ Downloaded')
                      : (lang === 'ar' ? 'تحميل الوثيقة ↓' : 'Download Document ↓')}
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
