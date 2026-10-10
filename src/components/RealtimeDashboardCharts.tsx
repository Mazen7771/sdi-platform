import React, { useState, useEffect } from 'react';
import { DoctorMember, Course, NewsItem, ResourceItem, AuditLogEntry, IdAllocation, Language } from '../types';

interface RealtimeDashboardChartsProps {
  lang: Language;
  doctors: DoctorMember[];
  courses: Course[];
  news: NewsItem[];
  resources?: ResourceItem[];
  idAllocations?: IdAllocation[];
  auditLogs?: AuditLogEntry[];
}

export const RealtimeDashboardCharts: React.FC<RealtimeDashboardChartsProps> = ({
  lang,
  doctors = [],
  courses = [],
  news = [],
  resources = [],
  idAllocations = [],
  auditLogs = [],
}) => {
  const isArabic = lang === 'ar';
  const [liveClock, setLiveClock] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute real metrics from the actual arrays
  const totalClinicians = doctors.length;
  const specialistCount = doctors.filter((d) => d.division === 'Specialist Division').length;
  const generalCount = doctors.filter((d) => d.division === 'General Division').length;
  const traineeCount = doctors.filter((d) => d.division === 'Trainee Specialist').length;

  const totalCpdHours = courses.reduce((acc, c) => acc + (c.cpdUnits || 0), 0);
  const activeIdsCount = idAllocations.filter(
    (i) => i.status === 'Allocated' || i.status === 'Active' || i.isActivated
  ).length;

  // Real unique specialties
  const uniqueSpecialties = Array.from(new Set(doctors.map((d) => d.specialty).filter(Boolean)));
  // Real unique hospitals
  const uniqueHospitals = Array.from(new Set(doctors.map((d) => d.hospital).filter(Boolean)));

  return (
    <div className="bubble-glass rounded-[2rem] p-6 lg:p-8 border border-white/95 shadow-md bg-white/92 space-y-6">
      {/* Real-time Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-2xl text-emerald-400">query_stats</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-headline font-bold text-[#0f172a] flex items-center gap-2">
              <span>{isArabic ? 'المؤشرات الحية الحقيقية لقاعدة البيانات' : 'Live Real-Time Database Metrics'}</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#15803d] border border-emerald-200 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803d] animate-pulse"></span>
                {isArabic ? 'مزامنة مباشرة' : 'LIVE'}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {isArabic
                ? 'إحصاءات دقيقة ومقاسة لحظياً من واقع السجلات المحفوظة في قاعدة البيانات'
                : 'Accurately measured in real-time from active records in Cloud SQL & Secretariat state'}
            </p>
          </div>
        </div>

        {/* Live Clock & DB Status */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl self-start sm:self-auto">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 font-medium">{isArabic ? 'التوقيت المحلي:' : 'Local Time:'}</span>
            <span className="font-bold text-[#0f172a]">{liveClock}</span>
          </div>
        </div>
      </div>

      {/* 4 Core Measured Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clinicians Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#15803d]/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">{isArabic ? 'الأطباء المعتمدون' : 'Accredited Doctors'}</span>
            <span className="material-symbols-outlined text-lg text-[#15803d]">medical_services</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] leading-none mb-1">
            {totalClinicians}
          </div>
          <div className="text-[11px] text-slate-500">
            {totalClinicians === 0
              ? isArabic
                ? 'السجل جاهز لاستقبال بيانات جديدة'
                : 'Registry ready for verified entries'
              : isArabic
              ? `${uniqueSpecialties.length} تخصصات سريرية`
              : `${uniqueSpecialties.length} specialties recorded`}
          </div>
        </div>

        {/* News Bulletins Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#15803d]/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">{isArabic ? 'البيانات والأخبار' : 'Official Bulletins'}</span>
            <span className="material-symbols-outlined text-lg text-blue-600">campaign</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] leading-none mb-1">
            {news.length}
          </div>
          <div className="text-[11px] text-slate-500">
            {isArabic ? 'بيانات منشورة وموثقة' : 'Published dispatches live'}
          </div>
        </div>

        {/* Courses & CPD Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#15803d]/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">{isArabic ? 'البرامج والتدريب' : 'Courses & CPD'}</span>
            <span className="material-symbols-outlined text-lg text-emerald-600">school</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] leading-none mb-1">
            {courses.length}
          </div>
          <div className="text-[11px] text-slate-500">
            {isArabic ? `${totalCpdHours} ساعة تدريب معتمدة` : `${totalCpdHours} total CPD hours accredited`}
          </div>
        </div>

        {/* Guidelines / Resources Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#15803d]/40 transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-bold uppercase tracking-wider">{isArabic ? 'المكتبة واللوائح' : 'HSE Guidelines'}</span>
            <span className="material-symbols-outlined text-lg text-amber-600">description</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] leading-none mb-1">
            {resources.length}
          </div>
          <div className="text-[11px] text-slate-500">
            {isArabic ? 'خوارزميات ولوائح سريرية' : 'Verified clinical protocols'}
          </div>
        </div>
      </div>

      {/* Real Breakdown Panels (Calculated strictly from live data) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Clinician Divisions Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-[#15803d]">pie_chart</span>
              <span>{isArabic ? 'توزيع الأطباء حسب سجل المجلس الطبي (IMC)' : 'Clinicians Division Distribution (IMC)'}</span>
            </h4>
            <span className="text-xs font-bold text-slate-600">
              {totalClinicians} {isArabic ? 'طبيب' : 'Total'}
            </span>
          </div>

          {totalClinicians > 0 ? (
            <div className="space-y-2.5 pt-1">
              {/* Specialist Division */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">{isArabic ? 'السجل التخصصي (Specialist)' : 'Specialist Division'}</span>
                  <span className="font-bold text-[#0f172a]">{specialistCount} ({Math.round((specialistCount / totalClinicians) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#15803d] rounded-full" style={{ width: `${(specialistCount / totalClinicians) * 100}%` }}></div>
                </div>
              </div>

              {/* General Division */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">{isArabic ? 'السجل العام (General Division)' : 'General Division'}</span>
                  <span className="font-bold text-[#0f172a]">{generalCount} ({Math.round((generalCount / totalClinicians) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0f172a] rounded-full" style={{ width: `${(generalCount / totalClinicians) * 100}%` }}></div>
                </div>
              </div>

              {/* Trainee Specialist */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700">{isArabic ? 'التدريب التخصصي (Trainee Specialist)' : 'Trainee Specialist'}</span>
                  <span className="font-bold text-[#0f172a]">{traineeCount} ({Math.round((traineeCount / totalClinicians) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(traineeCount / totalClinicians) * 100}%` }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white text-center text-xs text-slate-500 border border-slate-200">
              {isArabic ? 'لم يتم تسجيل أطباء بعد. سيظهر التوزيع تلقائياً عند إضافة أول طبيب.' : 'No doctors in registry yet. Real division breakdown will generate automatically upon enrolling clinicians.'}
            </div>
          )}
        </div>

        {/* Real-time System & Secretariat Audit Status */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f172a] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base text-blue-600">verified_user</span>
              <span>{isArabic ? 'حالة النظام وسجل العمليات' : 'System & Operations Trail'}</span>
            </h4>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {isArabic ? 'متصل وآمن' : 'Online'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-600">{isArabic ? 'سجلات التدقيق الإداري:' : 'Audit Actions Logged:'}</span>
              <span className="font-bold text-[#0f172a]">{auditLogs.length} {isArabic ? 'عملية موثقة' : 'logged entries'}</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-600">{isArabic ? 'معرفات العضوية المسحوبة:' : 'Issued Member IDs:'}</span>
              <span className="font-bold text-[#0f172a]">{activeIdsCount} {isArabic ? 'معرف' : 'claimed IDs'}</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-white border border-slate-200">
              <span className="text-slate-600">{isArabic ? 'المستشفيات والارتباطات:' : 'Affiliated Hospitals:'}</span>
              <span className="font-bold text-[#0f172a]">{uniqueHospitals.length} {isArabic ? 'مستشفى ومرفق' : 'centers'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
