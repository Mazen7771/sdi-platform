import React, { useState } from 'react';
import { Course, Language } from '../types';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
  lang: Language;
}

function parseVideoEmbed(url?: string): { type: 'youtube' | 'vimeo' | 'direct' | 'link'; embedUrl?: string } {
  if (!url) return { type: 'link' };
  const trimmed = url.trim();

  // YouTube match
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return { type: 'youtube', embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}` };
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  // Direct MP4 / WebM
  if (trimmed.endsWith('.mp4') || trimmed.endsWith('.webm')) {
    return { type: 'direct', embedUrl: trimmed };
  }

  return { type: 'link', embedUrl: trimmed };
}

export const CourseModal: React.FC<CourseModalProps> = ({ course, onClose, lang }) => {
  const isArabic = lang === 'ar';
  const [activeModule, setActiveModule] = useState(0);
  const [enrolled, setEnrolled] = useState(false);
  const [copiedLesson, setCopiedLesson] = useState(false);

  if (!course) return null;

  const videoInfo = parseVideoEmbed(course.recordingUrl);

  const handleCopyLessonLink = () => {
    if (!course.lessonUrl) return;
    navigator.clipboard?.writeText(course.lessonUrl);
    setCopiedLesson(true);
    setTimeout(() => setCopiedLesson(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn">
      <div className="bubble-glass w-full max-w-3xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-7 md:p-9 bg-white/95 border border-slate-200 shadow-2xl relative overflow-hidden text-slate-900 max-h-[92vh] max-h-[92dvh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-black transition-all shadow-xs z-20"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-[11px] font-mono font-bold border border-emerald-300">
            +{course.cpdUnits} CPD UNITS
          </span>
          <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
            {course.accessType === 'members'
              ? (isArabic ? 'أعضاء الرابطة فقط' : 'Members Only')
              : (isArabic ? 'متاح للجميع مجاناً' : 'Open Access')}
          </span>
          {course.recordingUrl && (
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">play_circle</span>
              <span>{isArabic ? 'تسجيل متاح' : 'Recording'}</span>
            </span>
          )}
          {course.lessonUrl && (
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">videocam</span>
              <span>{isArabic ? 'درس مباشر' : 'Live Lesson'}</span>
            </span>
          )}
          {course.pdfUrl && (
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">picture_as_pdf</span>
              <span>{isArabic ? 'مذكرة PDF' : 'PDF Material'}</span>
            </span>
          )}
        </div>

        {/* Course Banner/Thumbnail if uploaded */}
        {course.imageUrl && (
          <div className="mb-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm max-h-60">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title & Description */}
        <h3 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 mb-2 leading-tight">
          {isArabic && course.titleAr ? course.titleAr : course.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-mono">
          {isArabic && course.descriptionAr ? course.descriptionAr : course.description}
        </p>

        {/* ========================================================
            1. RECORDING STREAM / VIDEO PLAYER
            ======================================================== */}
        {course.recordingUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-300 bg-slate-950 shadow-md">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-white font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="font-bold">{isArabic ? 'التسجيل الكامل للمحاضرة' : 'Full Lecture Recording'}</span>
              </div>
              <a
                href={course.recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-bold"
              >
                <span>{isArabic ? 'فتح في نافذة مستقلة' : 'Open in New Tab'}</span>
                <span className="material-symbols-outlined text-[13px]">open_in_new</span>
              </a>
            </div>

            {videoInfo.type === 'youtube' && videoInfo.embedUrl && (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={videoInfo.embedUrl}
                  title="Lecture Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            )}

            {videoInfo.type === 'vimeo' && videoInfo.embedUrl && (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={videoInfo.embedUrl}
                  title="Lecture Video"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            )}

            {videoInfo.type === 'direct' && videoInfo.embedUrl && (
              <div className="aspect-video w-full bg-black">
                <video controls className="w-full h-full" src={videoInfo.embedUrl} />
              </div>
            )}

            {videoInfo.type === 'link' && (
              <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left rtl:sm:text-right">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <span className="material-symbols-outlined text-2xl">play_circle</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">{isArabic ? 'مشاهدة التسجيل عبر الرابط الخارجي' : 'Watch Recording on External Vault'}</h5>
                    <p className="text-[11px] text-slate-300 font-mono truncate max-w-xs">{course.recordingUrl}</p>
                  </div>
                </div>
                <a
                  href={course.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  <span>{isArabic ? 'تشغيل التسجيل الآن' : 'Launch Video Stream'}</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            2. LIVE LESSON / VIRTUAL CLASSROOM LINK
            ======================================================== */}
        {course.lessonUrl && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-xl">video_camera_front</span>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 block">
                  {isArabic ? 'رابط الدرس المباشر / البث الحي' : 'Live Virtual Classroom / Meeting Link'}
                </span>
                <p className="text-xs font-semibold text-slate-800 break-all line-clamp-1">{course.lessonUrl}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleCopyLessonLink}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">{copiedLesson ? 'done' : 'content_copy'}</span>
                <span>{copiedLesson ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ الرابط' : 'Copy')}</span>
              </button>
              <a
                href={course.lessonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[15px]">launch</span>
                <span>{isArabic ? 'دخول الدرس الآن' : 'Join Lesson Now'}</span>
              </a>
            </div>
          </div>
        )}

        {/* ========================================================
            3. ATTACHED COURSE PDF DOCUMENT / HANDBOOK
            ======================================================== */}
        {course.pdfUrl && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 block">
                  {isArabic ? 'مذكرة الدورة والمستندات (PDF)' : 'Course Curriculum & Handout Document'}
                </span>
                <p className="text-xs font-bold text-slate-800 break-all">{course.pdfName || 'Course-Document.pdf'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <a
                href={course.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download={course.pdfName || 'Course-Handout.pdf'}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>{isArabic ? 'تحميل ملف PDF' : 'Download PDF'}</span>
              </a>
            </div>
          </div>
        )}

        {/* Masterclass metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-5 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase text-slate-500 block">{isArabic ? 'هيئة التدريس:' : 'Lead Faculty:'}</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{isArabic && course.leadFacultyAr ? course.leadFacultyAr : course.leadFaculty}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase text-slate-500 block">{isArabic ? 'صيغة الدورة:' : 'Format:'}</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{isArabic && course.formatAr ? course.formatAr : course.format}</span>
          </div>
        </div>

        {/* Syllabus / Stations list */}
        <div className="space-y-2 mb-6">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
            {isArabic ? 'المنهج والمحطات المعتمدة (Syllabus):' : 'Accredited Curriculum & Stations:'}
          </h4>
          <div className="space-y-2">
            {(isArabic && course.syllabusAr ? course.syllabusAr : course.syllabus).map((item, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveModule(idx)}
                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                  activeModule === idx 
                    ? 'border-[#15803d] bg-emerald-50/70 text-slate-900 shadow-xs' 
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                  0{idx + 1}
                </span>
                <span className="leading-snug pt-0.5">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {enrolled && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
            <span>{isArabic ? 'تم تسجيل حضورك بنجاح وحفظ مقعدك.' : 'Registration confirmed! Access codes dispatched to your device.'}</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            {isArabic && course.cohortAr ? course.cohortAr : course.cohort}
          </span>
          <button
            onClick={() => setEnrolled(true)}
            className="px-6 py-2.5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <span>
              {course.accessType === 'members' 
                ? (isArabic ? 'حجز المقعد التدريبي' : 'Reserve Member Seat') 
                : (isArabic ? 'تأكيد التسجيل في الدورة' : 'Enroll in Masterclass')}
            </span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
