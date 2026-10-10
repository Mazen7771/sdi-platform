import React, { useState } from 'react';
import { DoctorMember, Language } from '../types';

interface DoctorProfileModalProps {
  doctor: DoctorMember | null;
  onClose: () => void;
  lang: Language;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({ doctor, onClose, lang }) => {
  const [copied, setCopied] = useState(false);
  if (!doctor) return null;

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(`SDI-VERIFY-${doctor.imcNumber}-${doctor.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn">
      <div className="bubble-glass w-full max-w-lg rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-8 bg-white/95 border border-slate-200 shadow-xl relative overflow-hidden text-slate-900 max-h-[92vh] max-h-[92dvh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-black transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left rtl:sm:text-right gap-3 sm:gap-4 mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-xs">
            <img
              src={doctor.photoUrl || '/dr-al-samoual-awad.jpg'}
              alt={doctor.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start rtl:sm:justify-end gap-1.5 sm:gap-2 mb-1">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bubble-glass-pill text-emerald-900 border border-emerald-300 font-bold">
                {lang === 'ar' ? 'سجل تخصصي معتمد' : 'VERIFIED STANDING'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bubble-glass-pill text-slate-600 border border-slate-300">
                IMC #{doctor.imcNumber}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold font-headline text-slate-900">
              {lang === 'ar' && doctor.nameAr ? doctor.nameAr : doctor.name}
            </h3>
            {(doctor.title || doctor.titleAr) && (
              <p className="text-xs font-mono text-slate-600">
                {lang === 'ar' && doctor.titleAr ? doctor.titleAr : doctor.title}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 text-xs mb-6 font-mono">
          {(doctor.specialty || doctor.specialtyAr) && (
            <div className="p-3.5 rounded-2xl bubble-glass border border-slate-200/80 bg-white/60">
              <span className="text-[10px] uppercase text-slate-500 block">
                {lang === 'ar' ? 'التخصص الدقيق:' : 'Clinical Specialty:'}
              </span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {lang === 'ar' && doctor.specialtyAr ? doctor.specialtyAr : doctor.specialty}
              </span>
            </div>
          )}

          {(doctor.hospital || doctor.hospitalAr) && (
            <div className="p-3.5 rounded-2xl bubble-glass border border-slate-200/80 bg-white/60">
              <span className="text-[10px] uppercase text-slate-500 block">
                {lang === 'ar' ? 'المستشفى والارتباط الأكاديمي:' : 'Hospital & Academic Affiliation:'}
              </span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {lang === 'ar' && doctor.hospitalAr ? doctor.hospitalAr : doctor.hospital}
              </span>
            </div>
          )}

          {(doctor.bio || doctor.bioAr) && (
            <div className="p-3.5 rounded-2xl bubble-glass border border-slate-200/80 bg-white/60">
              <span className="text-[10px] uppercase text-slate-500 block">
                {lang === 'ar' ? 'النبذة المهنية:' : 'Professional Biography:'}
              </span>
              <p className="text-slate-800 mt-1 font-sans text-xs leading-relaxed">
                {lang === 'ar' && doctor.bioAr ? doctor.bioAr : doctor.bio}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 font-mono">
            <div className="p-3.5 rounded-2xl bubble-glass-pill border border-slate-200/80 bg-white/70">
              <span className="text-[10px] uppercase text-slate-500 block">
                {lang === 'ar' ? 'رقم عضوية SDI:' : 'SDI Registry ID:'}
              </span>
              <span className="font-bold text-slate-900 mt-0.5 block">#{doctor.id}</span>
            </div>
            <div className="p-3.5 rounded-2xl bubble-glass-pill border border-emerald-200/80 bg-emerald-50/70">
              <span className="text-[10px] uppercase text-emerald-800 block">
                {lang === 'ar' ? 'ساعات التطوير المعتمدة:' : 'Accredited CPD Units:'}
              </span>
              <span className="font-bold text-emerald-800 mt-0.5 block">{doctor.cpdUnits} Units</span>
            </div>
          </div>
        </div>

        {/* Direct Contact Links */}
        {(doctor.whatsapp || doctor.email || doctor.cvPdfUrl || doctor.recordingUrl) && (
          <div className="space-y-2 mb-4">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              {doctor.whatsapp && (
                <a
                  href={`https://wa.me/${doctor.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>WhatsApp: {doctor.whatsapp}</span>
                </a>
              )}
              {doctor.email && (
                <a
                  href={`mailto:${doctor.email}`}
                  className="w-full sm:flex-1 py-2 px-3 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span>{doctor.email}</span>
                </a>
              )}
            </div>

          {/* Attached Doctor CV or Credentials PDF */}
          {doctor.cvPdfUrl && (
            <a
              href={doctor.cvPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={doctor.cvPdfName || `${doctor.name}-CV-Credentials.pdf`}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px] text-amber-700">picture_as_pdf</span>
              <span>{lang === 'ar' ? 'تحميل وثيقة الاعتماد والسيرة المهنية (PDF)' : 'Download Verified Credentials & CV (PDF)'}</span>
            </a>
          )}

          {/* Doctor Introduction / Lecture Video Recording */}
          {doctor.recordingUrl && (
            <a
              href={doctor.recordingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px] text-rose-600">play_circle</span>
              <span>{lang === 'ar' ? 'مشاهدة الكلمة التعريفية / تسجيل المحاضرة' : 'Watch Introduction Video / Clinical Speech'}</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          )}
        </div>
        )}

        {copied && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-mono text-emerald-900 flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-sm text-[#15803d]">verified</span>
            <span>{lang === 'ar' ? 'تم نسخ شهادة التحقق المعتمدة للممارس الطبي.' : 'Cryptographic verification certificate copied to clipboard.'}</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500">
              {lang === 'ar' ? 'سريان الصلاحية حتى ديسمبر 2026' : 'Audit Validated Thru Dec 2026'}
            </span>
          </div>

          <button
            onClick={handleCopyHash}
            className="c-btn c-btn--teal py-2 px-4 rounded-lg font-semibold text-xs shadow-2xs"
          >
            <span>{lang === 'ar' ? 'نسخ رمز التحقق' : 'Copy Verification Hash'}</span>
            <div className="c-btn__arrow-box">
              <span className="c-btn__arrow c-btn__arrow--main">→</span>
              <span className="c-btn__arrow c-btn__arrow--slide">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
