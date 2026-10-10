import React, { useState } from 'react';
import { Language, DoctorMember } from '../types';

interface ContactPageProps {
  lang: Language;
  doctors?: DoctorMember[];
}

export const ContactPage: React.FC<ContactPageProps> = ({ lang, doctors = [] }) => {
  const isArabic = lang === 'ar';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Default doctors directory list with Dr. Al-Samoual Awad included
  const displayDoctors: DoctorMember[] = doctors.length > 0 ? doctors : [
    {
      id: 'SDI-0010',
      name: 'Dr. Al-Samoual Awad',
      nameAr: 'د. السموأل عوض',
      title: '',
      titleAr: '',
      roleCategory: '',
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
    }
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-10">
      {/* Page Header */}
      <div className="bubble-glass rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-12 border border-white/95 shadow-xl bg-white/85 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-xs sm:text-sm font-bold text-[#15803d]">
          <span className="w-2 h-2 rounded-full bg-[#15803d]"></span>
          <span>{isArabic ? 'دليل التواصل المباشر مع الأطباء والإدارة' : 'Direct Clinician & Secretariat Contact Directory'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-headline text-[#0f172a] tracking-tight">
          {isArabic ? 'التواصل المباشر مع الأطباء' : 'Direct Physician Contact'}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed max-w-3xl">
          {isArabic
            ? 'لا يوجد أي نموذج مراسلة أو وسيط داخل الموقع. يتم التواصل مباشرة بين المراجع أو الطبيب وبين الطبيب المعني أو الإدارة عبر الواتساب المباشر أو البريد الإلكتروني الموضح أدناه بكل شفافية.'
            : 'No contact forms or intermediary web messaging. Communication between clients, doctors, and the Secretariat is conducted directly through each physician’s verified WhatsApp or direct email listed below.'}
        </p>
      </div>

      {/* Verified Doctors & Secretariat Directory Cards */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#15803d] text-2xl">contacts</span>
            <h2 className="text-xl sm:text-2xl font-bold font-headline text-[#0f172a]">
              {isArabic ? 'قائمة الأطباء المعتمدين ومعلومات التواصل' : 'Verified Doctors & Contact Information'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 bg-white px-3 py-1 rounded-md border border-slate-200">
              {displayDoctors.length} {isArabic ? 'طبيب' : 'Clinician(s)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {displayDoctors.map((doc) => {
            const rawPhone = doc.whatsapp || '+353 89 251 5586';
            const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
            const whatsappUrl = `https://wa.me/${cleanPhone}`;
            const emailAddress = doc.email || 'example@gmail.com';
            const mailtoUrl = `mailto:${emailAddress}`;

            return (
              <div
                key={doc.id}
                className="bubble-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 space-y-5 relative overflow-hidden"
              >
                {/* Top Accent Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#15803d]"></div>

                {/* Doctor Photo & Core Info Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left rtl:sm:text-right">
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-50">
                      <img
                        src={doc.photoUrl || '/dr-al-samoual-awad.jpg'}
                        alt={doc.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-[#15803d]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]"></span>
                        <span>{doc.roleCategory || (isArabic ? 'طبيب معتمد' : 'Verified Doctor')}</span>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold font-headline text-[#0f172a]">
                      {isArabic && doc.nameAr ? doc.nameAr : doc.name}
                    </h3>

                    {(doc.title || doc.titleAr) && (
                      <p className="text-xs text-slate-600 font-medium">
                        {isArabic && doc.titleAr ? doc.titleAr : doc.title}
                      </p>
                    )}

                    {((doc.specialty || doc.specialtyAr) || (doc.hospital || doc.hospitalAr)) && (
                      <div className="pt-0.5 flex flex-wrap items-center justify-center sm:justify-start rtl:sm:justify-end gap-1.5 text-xs text-slate-500">
                        {(doc.specialty || doc.specialtyAr) && (
                          <span className="font-semibold text-slate-700">
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

                {/* Bio Snippet */}
                {(doc.bio || doc.bioAr) && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    {isArabic && doc.bioAr ? doc.bioAr : doc.bio}
                  </p>
                )}

                {/* Direct Contact Methods */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                    {isArabic ? 'طرق التواصل المباشرة' : 'Direct Channels'}
                  </span>

                  {/* WhatsApp Direct Action Card */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-900 block font-mono">
                          WhatsApp
                        </span>
                        <span className="text-xs sm:text-sm font-semibold font-mono text-emerald-950 block dir-ltr truncate">
                          {rawPhone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleCopy(rawPhone, `phone-${doc.id}`)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-semibold hover:bg-emerald-50 transition-colors shadow-2xs"
                        title="Copy Number"
                      >
                        {copiedKey === `phone-${doc.id}` ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ' : 'Copy')}
                      </button>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <span>{isArabic ? 'مراسلة' : 'Message'}</span>
                        <span className="text-xs">↗</span>
                      </a>
                    </div>
                  </div>

                  {/* Email Direct Action Card */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-[#0f172a] text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <span className="material-symbols-outlined text-[20px]">mail</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block font-mono">
                          Email
                        </span>
                        <span className="text-xs sm:text-sm font-semibold font-mono text-slate-800 block truncate">
                          {emailAddress}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleCopy(emailAddress, `email-${doc.id}`)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors shadow-2xs"
                        title="Copy Email"
                      >
                        {copiedKey === `email-${doc.id}` ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ' : 'Copy')}
                      </button>

                      <a
                        href={mailtoUrl}
                        className="px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
                      >
                        <span>{isArabic ? 'إرسال' : 'Send'}</span>
                        <span className="text-xs">✉</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
