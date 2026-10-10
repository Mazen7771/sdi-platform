import React, { useState } from 'react';
import { Language, NewsItem, Course, DoctorMember, AppPage } from '../types';

interface HomePageProps {
  lang: Language;
  onNavigate: (page: AppPage) => void;
  onOpenCreateAccount: () => void;
  news: NewsItem[];
  courses: Course[];
  doctors?: DoctorMember[];
  onSelectNews: (item: NewsItem) => void;
  onSelectCourse: (course: Course) => void;
  currentId: string | null;
  isActivated: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  lang,
  onNavigate,
  onOpenCreateAccount,
  news,
  courses: _courses,
  doctors = [],
  onSelectNews,
  onSelectCourse: _onSelectCourse,
  currentId,
  isActivated,
}) => {
  const isArabic = lang === 'ar';

  const defaultDoctor: DoctorMember = {
    id: 'SDI-0010',
    name: 'Dr. Al-Samoual Awad',
    nameAr: 'د. السموأل عوض',
    title: '',
    titleAr: '',
    roleCategory: '',
    roleCategoryAr: '',
    specialty: '',
    specialtyAr: '',
    hospital: '',
    hospitalAr: '',
    imcNumber: '419820',
    standing: 'Active',
    cpdUnits: 36,
    joinedYear: 2018,
    division: 'Specialist Division',
    photoUrl: '/dr-al-samoual-awad.jpg',
    whatsapp: '+353 89 251 5586',
    email: 'example@gmail.com',
    bio: '',
    bioAr: '',
  };

  const featuredDoctors = doctors.length > 0 ? doctors : [defaultDoctor];

  return (
    <div className="w-full space-y-16 sm:space-y-24 relative pb-16">
      {/* =========================================================================
          MAJESTIC FORMAL HERO SECTION (Style of SDUI.ie)
          ========================================================================= */}
      <section className="relative pt-4 sm:pt-10 min-h-[75vh] flex flex-col justify-center">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
          {/* Main Hero Card with Crisp Formal Styling */}
          <div className="bubble-glass rounded-2xl sm:rounded-3xl lg:rounded-[3rem] p-4 sm:p-8 lg:p-12 border border-white/95 shadow-2xl relative overflow-hidden">
            {/* National Irish & Sudanese Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#15803d] via-[#ffffff] via-[#ea580c] via-[#dc2626] to-[#0f172a]"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
              {/* Crest Column */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
                <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-2xl sm:rounded-3xl bg-white p-2 sm:p-3 shadow-md border border-slate-200 transition-transform duration-200 hover:scale-[1.02]">
                  <div className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center bg-white/80">
                    <img
                      src="/sdi-logo.jpg"
                      alt="Sudanese Doctors in Ireland (SDI) Official Crest"
                      className="w-full h-full object-contain filter drop-shadow-xs"
                    />
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#15803d] block font-mono">
                    {isArabic ? 'تأسست عام 2010' : 'ESTABLISHED 2010'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {isArabic ? 'دبلن • جمهورية إيرلندا' : 'Dublin • Republic of Ireland'}
                  </span>
                </div>
              </div>

              {/* Text & Mission Column */}
              <div className="lg:col-span-8 space-y-4 sm:space-y-5 text-center lg:text-left rtl:lg:text-right">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-[#15803d] shrink-0"></span>
                  <span className="break-words">
                    {isArabic
                      ? 'الممثل الرسمي للأطباء السودانيين في جمهورية إيرلندا'
                      : 'Official Representative Union for Sudanese Doctors in Ireland'}
                  </span>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-headline text-[#0f172a] tracking-tight leading-tight">
                    {isArabic ? (
                      <>
                        نقابة أطباء السودان بأيرلندا <br />
                        <span className="text-[#15803d] text-xl sm:text-2xl md:text-3xl font-bold">
                          Sudanese Doctors in Ireland (SDI)
                        </span>
                      </>
                    ) : (
                      <>
                        Sudanese Doctors in Ireland <br />
                        <span className="text-[#15803d] text-xl sm:text-2xl md:text-3xl font-bold">
                          نقابة أطباء السودان بأيرلندا (SDI)
                        </span>
                      </>
                    )}
                  </h1>

                  <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed max-w-2xl">
                    {isArabic
                      ? 'الكيان النقابي والمهني المعتمد لتمثيل الأطباء السودانيين في جمهورية إيرلندا. ملتزمون بحماية الحقوق المهنية، وتيسير برامج التدريب والترخيص بالمجلس الطبي الإيرلندي (IMC)، وتوفير قنوات تواصل مباشرة وسريعة بين المراجعين والأطباء.'
                      : 'The official representative medical union for Sudanese physicians across the Republic of Ireland. Dedicated to professional advocacy, IMC licensing support, postgraduate education, and direct transparent communication.'}
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-end gap-2.5 sm:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onOpenCreateAccount}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#15803d]">badge</span>
                    <span>{isArabic ? 'حساب وبطاقة العضوية' : 'Member Credential ID'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-[18px]">contacts</span>
                    <span>{isArabic ? 'دليل التواصل مع الأطباء' : 'Direct Doctor Directory'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('news')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs sm:text-sm font-medium transition-colors"
                  >
                    <span>{isArabic ? 'البيانات والأخبار' : 'Bulletins'}</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Status Indicator */}
                {currentId && (
                  <div className="pt-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                      <span className={`w-2 h-2 rounded-full ${isActivated ? 'bg-[#15803d]' : 'bg-[#ea580c]'}`}></span>
                      <span className="font-bold">{isArabic ? 'رقم العضوية:' : 'Member ID:'} #{currentId}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600">
                        {isActivated
                          ? (isArabic ? 'معتمد رسمياً' : 'Verified Member')
                          : (isArabic ? 'قيد المراجعة الإدارية' : 'Pending Verification')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOUR PILLARS OF THE UNION (Formal Glass Animated Cards)
          Colors from emblem: Navy (#0f172a), Green (#15803d), Red (#dc2626), Orange (#ea580c)
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#15803d] block">
            {isArabic ? 'الأهداف والركائز الأساسية' : 'CORE OBJECTIVES & MANDATE'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#0f172a]">
            {isArabic ? 'خدمة الطبيب والمجتمع الطبي' : 'Serving Doctors and Healthcare'}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {isArabic
              ? 'ترتكز أعمال الرابطة على أربعة محاور رئيسية تكفل تمثيل الطبيب وتطوير مسيرته المهنية.'
              : 'Our union operates across four core pillars supporting doctors and healthcare development.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Pillar 1: Professional Representation & Welfare */}
          <div className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-white/95 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden bg-white/75 flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0f172a]"></div>
            <div className="space-y-3 pt-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0f172a]">
                <span className="material-symbols-outlined text-[22px]">gavel</span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a]">
                {isArabic ? 'التمثيل النقابي ورعاية الحقوق' : 'Representation & Welfare'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isArabic
                  ? 'الدفاع عن حقوق الأطباء ومصالحهم المهنية وظروف عملهم في المستشفيات والمراكز الصحية الإيرلندية.'
                  : 'Advocating for doctors’ rights, safe working conditions, and contractual entitlements across Irish hospitals.'}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] font-semibold text-[#0f172a]">
              {isArabic ? 'دعم مستمر للأعضاء' : 'Continuous Member Support'}
            </div>
          </div>

          {/* Pillar 2: Licensing & Academic Training */}
          <div className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-white/95 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden bg-white/75 flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#15803d]"></div>
            <div className="space-y-3 pt-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#15803d]">
                <span className="material-symbols-outlined text-[22px]">school</span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a]">
                {isArabic ? 'التدريب والترخيص الطبي (IMC)' : 'IMC Licensing & Training'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isArabic
                  ? 'إرشاد متكامل للتسجيل بالمجلس الطبي الإيرلندي (IMC)، والتحضير للامتحانات الملكية، والالتحاق ببرامج التدريب التخصصي (BST/HST).'
                  : 'Orientation for Irish Medical Council (IMC) registration, Royal College exams, and specialist training schemes.'}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] font-semibold text-[#15803d]">
              {isArabic ? 'إرشاد أكاديمي وسريري' : 'Academic & Clinical Mentorship'}
            </div>
          </div>

          {/* Pillar 3: Health Solidarity with Sudan */}
          <div className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-white/95 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden bg-white/75 flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#dc2626]"></div>
            <div className="space-y-3 pt-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#dc2626]">
                <span className="material-symbols-outlined text-[22px]">medical_services</span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a]">
                {isArabic ? 'دعم القطاع الصحي بالسودان' : 'Medical Support for Sudan'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isArabic
                  ? 'المساهمة في دعم الخدمات الصحية، وبرامج تدريب الكوادر الطبية بالسودان، وتنظيم قوافل الإغاثة الطبية العاجلة.'
                  : 'Contributing to healthcare training in Sudan and mobilizing emergency humanitarian medical initiatives.'}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] font-semibold text-[#dc2626]">
              {isArabic ? 'تضامن صحي وإنساني' : 'Humanitarian Health Solidarity'}
            </div>
          </div>

          {/* Pillar 4: Community & Family Welfare */}
          <div className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-white/95 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden bg-white/75 flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#ea580c]"></div>
            <div className="space-y-3 pt-2">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#ea580c]">
                <span className="material-symbols-outlined text-[22px]">diversity_3</span>
              </div>
              <h3 className="text-base font-bold text-[#0f172a]">
                {isArabic ? 'الترابط الاجتماعي والأسري' : 'Social & Family Welfare'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isArabic
                  ? 'توثيق الروابط بين الأطباء السودانيين وأسرهم في إيرلندا وتنظيم الفعاليات الاجتماعية ودعم الأعضاء في مختلف الظروف.'
                  : 'Strengthening community bonds among Sudanese doctors and their families in Ireland through collegiate activities.'}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] font-semibold text-[#ea580c]">
              {isArabic ? 'تآزر ومجتمع موحد' : 'Collegiate Community Network'}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LATEST OFFICIAL DISPATCHES & BULLETINS (Simple, Dignified, Glassy)
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bubble-glass rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-10 border border-white/95 shadow-xl bg-white/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#dc2626] block">
                {isArabic ? 'البيانات والإعلانات' : 'OFFICIAL DISPATCHES'}
              </span>
              <h2 className="text-2xl font-extrabold font-headline text-[#0f172a]">
                {isArabic ? 'أحدث أخبار وبيانات النقابة' : 'Latest Announcements & Bulletins'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('news')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-300 hover:border-slate-800 text-xs font-bold text-[#0f172a] transition-colors"
            >
              <span>{isArabic ? 'عرض كافة الأخبار' : 'View All Bulletins'}</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {news.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNews(item)}
                className="bubble-glass p-5 rounded-2xl border border-white/90 hover:border-[#15803d] transition-all duration-200 cursor-pointer bg-white/70 shadow-xs hover:shadow-lg hover:-translate-y-1 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="font-bold text-[#15803d]">{isArabic ? (item.categoryAr || item.category) : item.category}</span>
                    <span>{isArabic ? (item.dateAr || item.date) : item.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0f172a] leading-snug">
                    {isArabic ? (item.titleAr || item.title) : item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {isArabic ? (item.summaryAr || item.summary) : item.summary}
                  </p>
                </div>
                <div className="pt-2 text-[11px] font-bold text-[#0f172a] flex items-center justify-between">
                  <span>{isArabic ? 'قراءة البيان كاملاً' : 'Read Full Notice'}</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          DOCTORS SHOWCASE ON HOME PAGE (Featuring Photo, Name, and Professional Bio)
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-bold text-[#15803d]">
              <span className="w-2 h-2 rounded-full bg-[#15803d]"></span>
              <span>{isArabic ? 'الكادر الطبي المعتمد' : 'Accredited Medical Cadre'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#0f172a]">
              {isArabic ? 'أطباء السودان في إيرلندا' : 'Sudanese Doctors in Ireland'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              {isArabic
                ? 'نخبة من الأطباء والاستشاريين المعتمدين لدى المجلس الطبي الإيرلندي (IMC) في مختلف المستشفيات الجامعية والمراكز التخصصية.'
                : 'Distinguished Sudanese medical consultants and specialists registered with the Irish Medical Council across university hospitals.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0f172a] text-xs font-bold border border-slate-300 transition-all flex items-center gap-2"
            >
              <span>{isArabic ? 'طرق التواصل المباشر' : 'Direct Contact Info'}</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Featured Doctor Cards with Photo, Name & Professional Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {featuredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bubble-glass rounded-2xl sm:rounded-3xl lg:rounded-[2.75rem] p-4 sm:p-7 md:p-8 border border-white/90 hover:border-emerald-500 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-2xl"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#15803d]"></div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left rtl:sm:text-right">
                {/* Doctor Picture */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden border border-white/90 bg-slate-50 shadow-md">
                    <img
                      src={doc.photoUrl || '/dr-al-samoual-awad.jpg'}
                      alt={doc.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="mt-1.5 text-center">
                    <span className="text-[10px] font-mono font-semibold text-slate-500">
                      IMC #{doc.imcNumber}
                    </span>
                  </div>
                </div>

                {/* Doctor Name, Title, and Professional Presentation */}
                <div className="space-y-1.5 flex-1">
                  {(doc.roleCategory || doc.roleCategoryAr) && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#15803d] block font-mono">
                      {isArabic && doc.roleCategoryAr ? doc.roleCategoryAr : doc.roleCategory}
                    </span>
                  )}

                  <h3 className="text-xl sm:text-2xl font-bold font-headline text-[#0f172a]">
                    {isArabic && doc.nameAr ? doc.nameAr : doc.name}
                  </h3>

                  {(doc.title || doc.titleAr) && (
                    <p className="text-xs font-semibold text-slate-700">
                      {isArabic && doc.titleAr ? doc.titleAr : doc.title}
                    </p>
                  )}

                  {((doc.specialty || doc.specialtyAr) || (doc.hospital || doc.hospitalAr)) && (
                    <div className="flex flex-wrap items-center justify-center sm:justify-start rtl:sm:justify-end gap-2 text-xs text-slate-500 pt-1">
                      {(doc.specialty || doc.specialtyAr) && (
                        <span className="text-slate-700 font-medium">
                          {isArabic && doc.specialtyAr ? doc.specialtyAr : doc.specialty}
                        </span>
                      )}
                      {(doc.specialty || doc.specialtyAr) && (doc.hospital || doc.hospitalAr) && (
                        <span>•</span>
                      )}
                      {(doc.hospital || doc.hospitalAr) && (
                        <span>{isArabic && doc.hospitalAr ? doc.hospitalAr : doc.hospital}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Description surrounding the doctor */}
              {(doc.bio || doc.bioAr) && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isArabic && doc.bioAr ? doc.bioAr : doc.bio}
                  </p>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]"></span>
                    <span>{isArabic ? 'رقم السجل:' : 'Registry ID:'} #{doc.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('contact')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#25D366]">chat</span>
                      <span>{isArabic ? 'معلومات التواصل المباشر' : 'Direct Contact Info'}</span>
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          CONTACT & SECRETARIAT DESK
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bubble-glass rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-8 md:p-10 border border-white/95 shadow-xl bg-[#0f172a] text-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#15803d] block">
                {isArabic ? 'التواصل مع الأمانة العامة' : 'EXECUTIVE SECRETARIAT'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-headline">
                {isArabic ? 'رابطة الأطباء السودانيين في إيرلندا (SDI)' : 'Sudanese Doctors in Ireland (SDI)'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                {isArabic
                  ? 'ترحب الأمانة العامة بكافة استفسارات الزملاء الأطباء بخصوص التسجيل، التوجيه المهني، والأنشطة الأكاديمية والاجتماعية.'
                  : 'The Executive Secretariat welcomes all inquiries from colleagues regarding membership, professional guidance, and union initiatives.'}
              </p>
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end">
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-full bg-white text-[#0f172a] hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-lg hover:scale-105 transition-all"
              >
                {isArabic ? 'تواصل مع السكرتارية ←' : 'Contact Secretariat →'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
