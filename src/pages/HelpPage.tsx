import React from 'react';
import { Language, AppPage } from '../types';

interface HelpPageProps {
  lang: Language;
  onNavigate: (page: AppPage) => void;
  onOpenCreateAccount: () => void;
  onRequestAdmin?: () => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({
  lang,
  onNavigate,
  onOpenCreateAccount,
}) => {
  const isArabic = lang === 'ar';

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-10">
      {/* Header Banner */}
      <div className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 md:p-12 border border-slate-200/80 shadow-md bg-white/95 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#15803d]">
          <span className="w-2 h-2 rounded-full bg-[#15803d]"></span>
          <span>{isArabic ? 'دليل إرشادي واستخدام المنصة' : 'Member & Clinician Guide'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-headline text-[#0f172a]">
          {isArabic ? 'دليل الاستخدام والإرشادات للأطباء والزوار' : 'Physician & Visitor Operations Guide'}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-3xl">
          {isArabic
            ? 'خطوات عملية واضحة ومباشرة لكل قسم من أقسام المنصة. يوضح هذا الدليل كيفية استخدام الخدمات النقابية، وحجز وتفعيل معرف العضوية (ID)، والوصول للدورات والبيانات وسجل الأطباء والتواصل المباشر.'
            : 'Clear, direct action steps for every section of the platform. This guide outlines how practicing physicians and visitors interact with union services, manage accredited ID credentials, access courses and guidelines, and communicate directly with doctors.'}
        </p>
      </div>

      {/* =========================================================================
          USER / PHYSICIAN ACTION GUIDE (EXCLUSIVELY FOR USERS)
          ========================================================================= */}
      <div className="space-y-6 sm:space-y-8 animate-fadeIn">
        {/* Executive Notice on Registration Policy */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-[#0f172a]">
            <span className="material-symbols-outlined text-[#15803d] text-lg">verified_user</span>
            <span>
              {isArabic
                ? 'سياسة التسجيل الرسمية: إدارة الأمانة العامة'
                : 'Centralized Secretariat Registration Policy'}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            {isArabic
              ? 'تطبق نقابة أطباء السودان بأيرلندا (SDI) معايير حوكمة صارمة لحماية مصداقية السجل الطبي. يتم تخصيص معرف عضوي رسمي لكل طبيب عبر النظام، ويخضع لاعتماد الأمانة العامة قبل تفعيل الصلاحيات الكاملة.'
              : 'The Sudanese Doctors in Ireland (SDI) enforces strict institutional governance. Member credential IDs are assigned through the central register and elevated upon executive verification.'}
          </p>
        </div>

        {/* 4 Action Steps for Users */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Step 1: Claiming Single ID */}
          <div className="bubble-glass rounded-2xl p-4 sm:p-6 md:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all bg-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#0f172a] text-white font-bold text-xs flex items-center justify-center font-mono">
                01
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                {isArabic ? 'الخطوة الأولى' : 'Step 1'}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#0f172a]">
              {isArabic ? 'حجز وتثبيت معرف العضوية (ID)' : 'Obtain Your Credential ID'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isArabic
                ? 'يحصل كل طبيب على معرف رسمي فريد من مصفوفة المعرفات النقابية (SDI-0001 إلى SDI-4000). يُسمح بحساب واحد فقط لكل طبيب لمنع التكرار.'
                : 'Every doctor receives a unique membership credential (SDI-0001 to SDI-4000). A single-account rule is enforced to ensure integrity.'}
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1.5">
              <div className="font-bold text-slate-800">{isArabic ? 'الخطوة العملية:' : 'Action to take:'}</div>
              <div className="text-slate-600">
                {isArabic
                  ? 'اضغط على زر "حساب وبطاقة العضوية" أعلى الصفحة، ثم اضغط "حجز معرف رسمي".'
                  : 'Click "Member Credential ID" in the header, then click "Claim Official ID".'}
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenCreateAccount}
              className="c-btn c-btn--dark w-full py-2.5 rounded-xl font-bold text-xs shadow-xs justify-center"
            >
              <span>{isArabic ? 'فتح نافذة العضوية ←' : 'Open Membership Modal →'}</span>
              <div className="c-btn__arrow-box">
                <span className="c-btn__arrow c-btn__arrow--main">→</span>
                <span className="c-btn__arrow c-btn__arrow--slide">→</span>
              </div>
            </button>
          </div>

          {/* Step 2: Accessing News Bulletin */}
          <div className="bubble-glass rounded-2xl p-4 sm:p-6 md:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all bg-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#0f172a] text-white font-bold text-xs flex items-center justify-center font-mono">
                02
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                {isArabic ? 'متاح للجميع' : 'Public Access'}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#0f172a]">
              {isArabic ? 'متابعة البيانات والأخبار النقابية' : 'Follow Official Dispatches'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isArabic
                ? 'صفحة الأخبار مفتوحة ومتاحة لجميع الأعضاء والزوار لمتابعة المستجدات النقابية، بيانات الأمانة العامة، والإعلانات الطبية والمهنية في إيرلندا.'
                : 'The official bulletin is accessible to all clinicians and visitors to stay updated with union notices, healthcare updates, and AGM calls.'}
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1.5">
              <div className="font-bold text-slate-800">{isArabic ? 'الخطوة العملية:' : 'Action to take:'}</div>
              <div className="text-slate-600">
                {isArabic
                  ? 'انتقل إلى تبويب "الأخبار" لقراءة كافة القرارات، البيانات، ومواعيد الجمعيات العمومية.'
                  : 'Navigate to "News" tab to read full text bulletins, resolutions, and general announcements.'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('news')}
              className="c-btn c-btn--teal w-full py-2.5 rounded-xl font-bold text-xs shadow-xs justify-center"
            >
              <span>{isArabic ? 'الانتقال إلى صفحة الأخبار ←' : 'Browse News Bulletin →'}</span>
              <div className="c-btn__arrow-box">
                <span className="c-btn__arrow c-btn__arrow--main">→</span>
                <span className="c-btn__arrow c-btn__arrow--slide">→</span>
              </div>
            </button>
          </div>

          {/* Step 3: Accredited Courses and Library */}
          <div className="bubble-glass rounded-2xl p-4 sm:p-6 md:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all bg-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#0f172a] text-white font-bold text-xs flex items-center justify-center font-mono">
                03
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#15803d] text-[10px] font-bold border border-emerald-200">
                {isArabic ? 'للأعضاء المعتمدين' : 'Activated Members'}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#0f172a]">
              {isArabic ? 'الدورات التدريبية واللوائح السريرية' : 'Accredited CPD Courses & Clinical Guidelines'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isArabic
                ? 'بعد اعتماد المعرف من الأمانة العامة، يُمنح الطبيب اشتراكاً كاملاً لمدة عام (365 يوماً) يتيح له التسجيل في دورات الـ CPD والاطلاع على الخوارزميات الطبية.'
                : 'Once your ID is elevated by the Secretariat, you receive a full 1-year active term giving full access to Royal College CPD courses and HSE clinical algorithms.'}
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1.5">
              <div className="font-bold text-slate-800">{isArabic ? 'الخطوة العملية:' : 'Action to take:'}</div>
              <div className="text-slate-600">
                {isArabic
                  ? 'تصفح تبويب "الدورات" أو "المكتبة" للاطلاع على البرامج الأكاديمية واللوائح الإيرلندية المعتمدة.'
                  : 'Browse the "Courses" or "Resources" catalog to view masterclasses, workshop dates, and clinical protocols.'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="c-btn c-btn--dark w-full py-2.5 rounded-xl font-bold text-xs shadow-xs justify-center"
            >
              <span>{isArabic ? 'استعراض الدورات المعتمدة ←' : 'Browse Courses Catalog →'}</span>
              <div className="c-btn__arrow-box">
                <span className="c-btn__arrow c-btn__arrow--main">→</span>
                <span className="c-btn__arrow c-btn__arrow--slide">→</span>
              </div>
            </button>
          </div>

          {/* Step 4: Verification and Contacting Secretariat */}
          <div className="bubble-glass rounded-2xl p-4 sm:p-6 md:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all bg-white space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-8 h-8 rounded-xl bg-[#0f172a] text-white font-bold text-xs flex items-center justify-center font-mono">
                04
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                {isArabic ? 'تواصل مباشر' : 'Direct Inquiry'}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#0f172a]">
              {isArabic ? 'التواصل المباشر مع الأطباء والأمانة' : 'Direct Doctor & Secretariat Communication'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isArabic
                ? 'يمكنك التواصل مباشرة وفورياً مع أي طبيب أو مع الأمانة العامة دون أي استمارات وسيطة عبر الواتساب أو البريد الإلكتروني.'
                : 'Reach any accredited physician or Secretariat office directly through verified WhatsApp or direct email without web forms.'}
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1.5">
              <div className="font-bold text-slate-800">{isArabic ? 'الخطوة العملية:' : 'Action to take:'}</div>
              <div className="text-slate-600">
                {isArabic
                  ? 'انتقل إلى صفحة "التواصل" لاختيار الطبيب أو المشرف والتواصل معه مباشرة بنقرة واحدة عبر الواتساب أو البريد الإلكتروني.'
                  : 'Navigate to "Contact" to choose any verified doctor or Secretariat officer and reach them directly via one-click WhatsApp or direct Email.'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="c-btn c-btn--teal w-full py-2.5 rounded-xl font-bold text-xs shadow-xs justify-center"
            >
              <span>{isArabic ? 'عرض قائمة التواصل المباشر ←' : 'Open Direct Contact Directory →'}</span>
              <div className="c-btn__arrow-box">
                <span className="c-btn__arrow c-btn__arrow--main">→</span>
                <span className="c-btn__arrow c-btn__arrow--slide">→</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
