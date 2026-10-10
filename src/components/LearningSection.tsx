import React from 'react';
import { Course, Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { COURSES } from '../data';

interface LearningSectionProps {
  lang: Language;
  courses?: Course[];
  onSelectCourse: (course: Course) => void;
}

export const LearningSection: React.FC<LearningSectionProps> = ({ lang, courses = COURSES, onSelectCourse }) => {
  const t = TRANSLATIONS[lang];

  return (
    <section className="w-full py-20 relative bg-slate-50/60 border-y border-slate-200" id="section-learning">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-700 uppercase tracking-widest font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              <span>{t.learningTag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-slate-900 tracking-tight">
              {t.learningHeading}
            </h2>
            <div className="w-24 h-[2px] bg-slate-400 mt-2"></div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
            {t.learningSub}
          </p>
        </div>

        {/* Courses Cards Grid with responsive scaling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {courses.map((course, idx) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="optical-glass rounded-3xl p-6 relative flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 group bg-white border border-slate-200 shadow-sm cursor-pointer"
            >
              {idx === 0 && (
                <>
                  <span className="crosshair-corner crosshair-tl"></span>
                  <span className="crosshair-corner crosshair-tr"></span>
                </>
              )}
              {idx === 2 && (
                <>
                  <span className="crosshair-corner crosshair-bl"></span>
                  <span className="crosshair-corner crosshair-br"></span>
                </>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-900 text-[10px] font-mono font-bold">
                    {course.cpdUnits} CPD UNITS
                  </span>
                  <span className="optical-glass-pill px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-700 border border-slate-200 flex items-center gap-1 shadow-xs">
                    <span className={`w-1.5 h-1.5 rounded-full ${course.accessType === 'open' ? 'bg-emerald-600' : 'bg-slate-800'}`}></span>
                    {course.accessType === 'members' 
                      ? (lang === 'ar' ? '[أعضاء الرابطة]' : '[Members only]') 
                      : (lang === 'ar' ? '[متاح للعامة]' : '[Open Access]')}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-headline font-bold text-slate-900 group-hover:text-black transition-colors">
                    {lang === 'ar' ? course.titleAr : course.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                    {lang === 'ar' ? course.descriptionAr : course.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl optical-glass-subtle space-y-1.5 text-xs font-mono border border-slate-200 bg-slate-50/70">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">{lang === 'ar' ? 'هيئة التدريس:' : 'Lead Faculty:'}</span>
                    <span className="text-slate-900 font-semibold">{lang === 'ar' ? course.leadFacultyAr : course.leadFaculty}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">{lang === 'ar' ? 'صيغة الدورة:' : 'Format:'}</span>
                    <span className="text-slate-700 font-semibold">{lang === 'ar' ? course.formatAr : course.format}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500 font-medium">
                  {lang === 'ar' ? course.cohortAr : course.cohort}
                </span>
                <button
                  type="button"
                  className="optical-glass-pill px-3.5 py-2 rounded-xl text-xs font-bold text-slate-900 hover:bg-slate-100 flex items-center gap-1 transition-all border border-slate-200"
                >
                  <span>
                    {course.id === 'nchd-induction' 
                      ? t.streamVaultBtn 
                      : course.id === 'annual-cpd-2026' 
                      ? t.viewSyllabusBtn 
                      : t.viewDetailsBtn}
                  </span>
                  <span className="material-symbols-outlined text-[14px]">
                    {course.id === 'nchd-induction' ? 'play_circle' : 'arrow_forward'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
