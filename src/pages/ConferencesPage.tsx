import React from 'react';
import { Language, AppPage } from '../types';
import { RestrictedAccessNotice } from '../components/RestrictedAccessNotice';

interface ConferencesPageProps {
  lang: Language;
  isActivated: boolean;
  onNavigate: (page: AppPage) => void;
  onOpenCreateAccount: () => void;
  onRequestAdmin: () => void;
}

export const ConferencesPage: React.FC<ConferencesPageProps> = ({
  lang,
  isActivated,
  onNavigate,
  onOpenCreateAccount,
  onRequestAdmin,
}) => {
  if (!isActivated) {
    return (
      <RestrictedAccessNotice
        lang={lang}
        targetPage="conferences"
        onNavigateToNews={() => onNavigate('news')}
        onOpenCreateAccount={onOpenCreateAccount}
        onRequestAdmin={onRequestAdmin}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-10">
      {/* Page Header */}
      <div className="space-y-4 border-b border-slate-200 pb-6 sm:pb-8 scroll-reveal reveal-group" data-reveal="true" data-stagger-children="true">
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs sm:text-sm font-bold text-[#15803d]">
          <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse"></span>
          <span>{lang === 'ar' ? 'المؤتمر السنوي والملتقيات العلمية' : 'Annual Congress & Scientific Symposia'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="reveal-item">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-headline text-slate-900 tracking-tight">
              {lang === 'ar' ? 'المؤتمر الطبي السنوي — دبلن 2026' : 'Annual Scientific Congress — Dublin 2026'}
            </h1>
            <p className="text-xs sm:text-sm font-mono text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'الملتقى الأكاديمي والسريري الأكبر للأطباء السودانيين في إيرلندا والمملكة المتحدة بمشاركة نخبة الاستشاريين والباحثين في مركز مؤتمرات دبلن (CCD).'
                : 'The premier clinical congress uniting Sudanese physicians, RCSI/RCPI faculty, and healthcare leaders at The Convention Centre Dublin.'}
            </p>
          </div>
        </div>
      </div>

      {/* Featured Congress Hero Banner */}
      <div className="bubble-glass rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-12 border border-white/90 space-y-6 shadow-xl scroll-reveal" data-reveal="true">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="px-4 py-1.5 rounded-full bg-slate-900 text-white font-mono text-xs font-bold shadow-sm">
            {lang === 'ar' ? 'نوفمبر 2026 • دبلن' : 'November 2026 • Dublin'}
          </span>
          <span className="text-xs font-mono text-emerald-800 font-bold px-3 py-1 rounded-full bubble-glass-pill border border-emerald-300">
            {lang === 'ar' ? 'معتمد 18 ساعة CPD' : 'Accredited 18 CPD Credits'}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-headline text-slate-900">
            {lang === 'ar' 
              ? 'تحديات الطب الحاد والرعاية الجراحية: آفاق التعاون الطبي الإيرلندي السوداني' 
              : 'Acute Medicine & Surgical Horizons: Irish-Sudanese Clinical Collaboration'}
          </h2>
          <p className="text-xs sm:text-sm font-mono text-slate-600 max-w-3xl leading-relaxed">
            {lang === 'ar'
              ? 'يشمل المؤتمر جلسات علمية حول أحدث تقنيات قسطرة القلب، جراحة الإصابات المعقدة، إدارة الأزمات في العناية المركزة، وبناء قوافل الإغاثة الطبية الاستشارية للسودان.'
              : 'Featuring symposia on interventional cardiology, polytrauma reconstruction, emergency ultrasound protocols, and strategic cross-border humanitarian missions.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-slate-200/80 text-xs font-mono reveal-group" data-stagger-children="true">
          <div className="p-4 rounded-2xl sm:rounded-3xl bubble-glass-pill border border-slate-200/80 shadow-xs reveal-item">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Venue</span>
            <span className="font-bold text-slate-900">The Convention Centre Dublin (CCD)</span>
            <p className="text-slate-500 mt-1">Spencer Dock, N Wall Quay, Dublin 1</p>
          </div>
          <div className="p-4 rounded-2xl sm:rounded-3xl bubble-glass-pill border border-slate-200/80 shadow-xs reveal-item">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Keynote Faculty</span>
            <span className="font-bold text-slate-900">RCSI & RCPI Consultant Panel</span>
            <p className="text-slate-500 mt-1">International visiting speakers</p>
          </div>
          <div className="p-4 rounded-2xl sm:rounded-3xl bubble-glass-pill border border-slate-200/80 shadow-xs reveal-item">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Delegate Intake</span>
            <span className="font-bold text-slate-900">Verified SDI Credentials Only</span>
            <p className="text-slate-500 mt-1">Digital badge verification at gate</p>
          </div>
        </div>
      </div>
    </div>
  );
};
