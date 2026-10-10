import React from 'react';
import { Language, AppPage } from '../types';
import { getCurrentSessionId, load4000Ids } from '../data/idStore';

interface RestrictedAccessNoticeProps {
  lang: Language;
  targetPage: AppPage;
  onNavigateToNews: () => void;
  onOpenCreateAccount: () => void;
  onRequestAdmin: () => void;
}

export const RestrictedAccessNotice: React.FC<RestrictedAccessNoticeProps> = ({
  lang,
  targetPage,
  onNavigateToNews,
  onOpenCreateAccount,
  onRequestAdmin,
}) => {
  const currentId = getCurrentSessionId();
  const pool = load4000Ids();
  const idRecord = currentId ? pool.find((i) => i.id === currentId) : null;

  const pageNames: Record<AppPage, { en: string; ar: string }> = {
    home: { en: 'Home', ar: 'الرئيسية' },
    news: { en: 'News & Dispatches', ar: 'الأخبار والبيانات' },
    courses: { en: 'Clinical Masterclasses & MRCPI Prep', ar: 'الدورات والتأهيل السريري' },
    doctors: { en: 'Specialist Directory & Doctor Network', ar: 'دليل الأطباء والشبكة التخصصية' },
    conferences: { en: 'Annual Symposia & Conferences', ar: 'المؤتمرات والملتقيات السنوية' },
    resources: { en: 'HSE Clinical Guidelines & Library', ar: 'المكتبة واللوائح الطبية' },
    about: { en: 'Institutional Governance', ar: 'عن الرابطة والهيكل التنفيذي' },
    contact: { en: 'Secretariat Contact', ar: 'التواصل والشراكات' },
    help: { en: 'Actionable Help Guide', ar: 'دليل الإرشادات والخطوات العملية' },
  };

  const pageTitle = pageNames[targetPage] ? pageNames[targetPage][lang] : targetPage;

  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-16 scroll-reveal" data-reveal="true">
      <div className="w-full max-w-2xl bubble-glass rounded-[2.5rem] p-8 sm:p-12 border border-white/90 text-center space-y-6 shadow-2xl relative reveal-group" data-stagger-children="true">
        {/* Floating Lock Icon with Bubble styling */}
        <div className="w-16 h-16 rounded-3xl bubble-glass flex items-center justify-center mx-auto text-amber-700 shadow-md border border-amber-300/80 reveal-item">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>

        <div className="space-y-2 reveal-item">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bubble-glass-pill text-amber-900 border border-amber-300 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>
              {lang === 'ar' ? 'صلاحية مقيدة • تتطلب اعتماد الإدارة' : 'Privilege Restricted • Awaiting Admin Activation'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 tracking-tight">
            {lang === 'ar' ? `صفحة ${pageTitle} محمية` : `${pageTitle} is Locked`}
          </h2>

          <p className="text-sm text-slate-600 font-mono max-w-lg mx-auto leading-relaxed">
            {lang === 'ar'
              ? currentId
                ? `معرفك (${currentId}) مسجل بنجاح، لكنه حالياً مقيّد بصفحة الأخبار فقط حتى يقوم المشرف باعتماد وتفعيل صلاحيتك من لوحة إدارة المعرفات (IDs Dashboard).`
                : 'هذه الصفحة مخصصة للأعضاء ذوي المعرفات المفعلة. حسابات المستخدمين الجديدة تقتصر تلقائياً على صفحة الأخبار فقط حتى تفعيلها من قبل الإدارة.'
              : currentId
              ? `Your issued ID (${currentId}) is active on your device, but is restricted to the News section until an Administrator elevates your credentials in the IDs Dashboard.`
              : 'This section is reserved for accredited Sudanese Doctors in Ireland members. Newly issued accounts remain restricted to News until activated by Administration.'}
          </p>
        </div>

        {/* Current ID status pill */}
        {currentId && (
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bubble-glass-pill border border-slate-300 text-xs font-mono reveal-item">
            <span className="text-slate-500 font-bold">{lang === 'ar' ? 'معرفك الحالي:' : 'Your ID:'}</span>
            <span className="font-bold text-slate-900 bg-white/90 px-3 py-1 rounded-full border border-slate-300">
              {currentId}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold border border-amber-200">
              {idRecord?.isActivated
                ? lang === 'ar' ? 'مفعل' : 'Active'
                : lang === 'ar' ? 'قيد انتظار تفعيل المشرف' : 'Pending Admin Activation'}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 reveal-item">
          <button
            type="button"
            onClick={onNavigateToNews}
            className="c-btn c-btn--teal w-full sm:w-auto px-6 py-3"
          >
            <span>{lang === 'ar' ? 'الانتقال إلى صفحة الأخبار (متاحة)' : 'View News Bulletin (Accessible)'}</span>
            <div className="c-btn__arrow-box">
              <span className="c-btn__arrow c-btn__arrow--main">→</span>
              <span className="c-btn__arrow c-btn__arrow--slide">→</span>
            </div>
          </button>

          {!currentId ? (
            <button
              type="button"
              onClick={onOpenCreateAccount}
              className="c-btn c-btn--dark w-full sm:w-auto px-6 py-3"
            >
              <span>{lang === 'ar' ? 'سحب معرف حساب جديد' : 'Claim a Credential ID'}</span>
              <div className="c-btn__arrow-box">
                <span className="c-btn__arrow c-btn__arrow--main">→</span>
                <span className="c-btn__arrow c-btn__arrow--slide">→</span>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenCreateAccount}
              className="px-5 py-3 rounded-full bubble-glass-pill hover:bg-white text-slate-800 font-mono text-xs font-bold border border-slate-300 transition-colors shadow-xs"
            >
              {lang === 'ar' ? 'فحص حالة التفعيل أو تبديل المعرف' : 'Check Activation or Switch ID'}
            </button>
          )}

          <button
            type="button"
            onClick={onRequestAdmin}
            className="text-xs font-mono text-slate-400 hover:text-slate-700 underline px-3 py-2"
          >
            {lang === 'ar' ? 'دخول لوحة المشرف' : 'Admin Console'}
          </button>
        </div>
      </div>
    </section>
  );
};
