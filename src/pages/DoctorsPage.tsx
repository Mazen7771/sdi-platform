import React, { useState } from 'react';
import { Language, DoctorMember, AppPage } from '../types';
import { RestrictedAccessNotice } from '../components/RestrictedAccessNotice';

interface DoctorsPageProps {
  lang: Language;
  doctors: DoctorMember[];
  onSelectDoctor: (doc: DoctorMember) => void;
  isActivated: boolean;
  onNavigate: (page: AppPage) => void;
  onOpenCreateAccount: () => void;
  onRequestAdmin: () => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  lang,
  doctors,
  onSelectDoctor,
  isActivated,
  onNavigate,
  onOpenCreateAccount,
  onRequestAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isArabic = lang === 'ar';

  if (!isActivated) {
    return (
      <RestrictedAccessNotice
        lang={lang}
        targetPage="doctors"
        onNavigateToNews={() => onNavigate('news')}
        onOpenCreateAccount={onOpenCreateAccount}
        onRequestAdmin={onRequestAdmin}
      />
    );
  }

  const filteredDoctors = doctors.filter((doc) => {
    const q = searchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      (doc.nameAr && doc.nameAr.includes(q)) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.hospital.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="bubble-glass rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-10 border border-white/95 shadow-xl bg-white/80 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-bold text-[#15803d]">
          <span className="w-2 h-2 rounded-full bg-[#15803d]"></span>
          <span>{isArabic ? 'سجل الأعضاء المعتمدين' : 'Official Physician Registry'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-headline text-[#0f172a]">
          {isArabic ? 'دليل الأطباء السودانيين في إيرلندا' : 'Directory of Sudanese Doctors in Ireland'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          {isArabic
            ? 'السجل الرسمي المعتمد للأطباء والاستشاريين والمتدربين السودانيين الممارسين في جمهورية إيرلندا والمسجلين لدى المجلس الطبي الإيرلندي (IMC).'
            : 'The official institutional registry representing Sudanese medical consultants, specialists, and trainees practicing across the Republic of Ireland under Irish Medical Council (IMC) registration.'}
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {doctors.length > 0 && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'البحث بالاسم، التخصص، أو المستشفى...' : 'Search by name, specialty, or hospital...'}
              className="w-full sm:max-w-md px-4 py-2.5 rounded-full border border-slate-300 focus:border-[#15803d] text-xs outline-none bg-white/90"
            />
          )}
        </div>
      </div>

      {/* Registry Content */}
      {doctors.length === 0 ? (
        <div className="bubble-glass rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-10 md:p-14 text-center space-y-5 border border-white/95 shadow-xl bg-white/80 max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-[#0f172a] flex items-center justify-center mx-auto border-2 border-slate-200">
            <span className="material-symbols-outlined text-3xl text-[#15803d]">verified_user</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#0f172a]">
              {isArabic ? 'السجل قيد التدقيق والاعتماد المباشر' : 'Official Directory Under Active Curation'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
              {isArabic
                ? 'سجل الأطباء المعتمدين لدى الرابطة يخضع للتدقيق والاعتماد الإداري المركزي من قبل الأمانة العامة.'
                : 'The verified doctors registry is curated and managed centrally by the SDI Secretariat.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200/80 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={onOpenCreateAccount}
              className="px-5 py-2.5 rounded-full bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold transition-all shadow-sm"
            >
              {isArabic ? 'حساب العضوية (ID)' : 'Member Credential ID'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#0f172a] border border-slate-300 text-xs font-bold transition-all shadow-xs"
            >
              {isArabic ? 'التواصل مع الأمانة' : 'Contact Secretariat'}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full py-12 text-center bubble-glass rounded-2xl p-6 bg-white/70 border border-slate-200 space-y-2">
              <span className="material-symbols-outlined text-3xl text-slate-400">person_search</span>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {isArabic ? 'لم يتم العثور على أطباء مطابقين لكلمة البحث.' : 'No doctors found matching your search.'}
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#15803d] font-bold underline cursor-pointer"
              >
                {isArabic ? 'إعادة ضبط البحث' : 'Clear search'}
              </button>
            </div>
          ) : (
            filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectDoctor(doc)}
                className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 border border-white/90 hover:border-emerald-600 transition-all duration-300 cursor-pointer shadow-md hover:shadow-2xl space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left rtl:sm:text-right gap-3 sm:gap-4">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 border border-white/90 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={doc.photoUrl || '/dr-al-samoual-awad.jpg'}
                        alt={doc.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0 w-full">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        {doc.roleCategory ? (
                          <span className="font-bold text-[#15803d] px-2 py-0.5 rounded-full bubble-glass-pill border border-emerald-300 truncate">
                            {doc.roleCategory}
                          </span>
                        ) : <span />}
                        <span className="text-slate-400 font-mono text-[10px]">#{doc.id}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold font-headline text-[#0f172a] truncate">
                        {isArabic && doc.nameAr ? doc.nameAr : doc.name}
                      </h3>
                      {(doc.title || doc.titleAr) && (
                        <p className="text-xs text-slate-700 font-semibold truncate font-mono">
                          {isArabic && doc.titleAr ? doc.titleAr : doc.title}
                        </p>
                      )}
                      {(doc.specialty || doc.specialtyAr) && (
                        <p className="text-xs text-slate-600 font-medium truncate font-mono">
                          {isArabic && doc.specialtyAr ? doc.specialtyAr : doc.specialty}
                        </p>
                      )}
                    </div>
                  </div>

                  {(doc.hospital || doc.hospitalAr) && (
                    <div className="text-xs text-slate-600 font-mono leading-relaxed bg-white/40 p-2.5 rounded-xl border border-white/70">
                      <span className="line-clamp-1">{isArabic && doc.hospitalAr ? doc.hospitalAr : doc.hospital}</span>
                    </div>
                  )}

                  {/* Media Indicators (Photo, CV PDF, Video) */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {doc.cvPdfUrl && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold font-mono">
                        <span className="material-symbols-outlined text-[13px]">picture_as_pdf</span>
                        <span>{isArabic ? 'سيرة PDF' : 'CV Document'}</span>
                      </span>
                    )}
                    {doc.recordingUrl && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold font-mono">
                        <span className="material-symbols-outlined text-[13px]">play_circle</span>
                        <span>{isArabic ? 'تسجيل مرئي' : 'Video Intro'}</span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold font-mono">
                      <span className="material-symbols-outlined text-[13px]">verified</span>
                      <span>IMC #{doc.imcNumber}</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 font-bold">{doc.division}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#15803d] font-bold flex items-center gap-1">
                      <span>{isArabic ? 'عرض الملف' : 'View Profile'}</span>
                      <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
