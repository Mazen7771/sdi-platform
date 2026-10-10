import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { BioDnaHelix } from './BioDnaHelix';

interface HeroSectionProps {
  lang: Language;
  onOpenRegister: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang, onOpenRegister }) => {
  const [heroStep, setHeroStep] = useState(1);
  const [heartRate, setHeartRate] = useState(72);
  const t = TRANSLATIONS[lang];

  const projects = [
    { title: 'Stellar home for Saturion', titleAr: 'منظومة ستيلار للأبحاث والبيئة الطبية' },
    { title: 'Emergency Relief & Tele-Consult Hub', titleAr: 'منصة الإغاثة والاستشارات التخصصية عن بعد' },
    { title: 'HSE Trainee & Fellowship Bridge', titleAr: 'برنامج الزمالة والتدريب التخصصي الإيرلندي' },
    { title: 'RCSI & RCPI Simulation Masterclass', titleAr: 'مختبر المحاكاة السريرية للامتحانات الملكية' }
  ];

  const totalSteps = 4;

  const nextStep = () => {
    setHeroStep((prev) => (prev >= totalSteps ? 1 : prev + 1));
  };

  const prevStep = () => {
    setHeroStep((prev) => (prev <= 1 ? totalSteps : prev - 1));
  };

  const toggleHeartRate = () => {
    setHeartRate((prev) => (prev === 72 ? 76 : prev === 76 ? 70 : 72));
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = window.innerWidth < 640 ? 76 : window.innerWidth < 1024 ? 86 : 96;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center py-8 lg:py-14 overflow-hidden">
      <div className="max-w-7xl w-full mx-auto px-6 lg:px-12 relative">
        {/* Top Editorial Precision Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-slate-900 font-semibold tracking-wider">Terascape Medical Systems</span>
            <span className="text-slate-300">/</span>
            <span>{t.taglineTop}</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-slate-700 font-mono font-semibold">{t.systemStatus}</span>
            <span className="text-slate-500">{t.accreditationBadge}</span>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
              <span className="text-[11px] font-mono font-bold tracking-[0.16em] text-slate-800 uppercase">
                {t.heroTag}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-headline font-extrabold text-slate-900 tracking-tight leading-[1.08]">
              <span>{t.heroTitlePrefix}</span><br />
              <span className="text-slate-700">{t.heroTitleHighlight}</span><br />
              <span>{t.heroTitleSuffix}</span>
            </h1>

            {/* Thin architectural hairline */}
            <div className="w-24 h-[2px] bg-slate-300"></div>

            <p className="text-sm sm:text-base text-slate-600 max-w-lg font-normal leading-relaxed">
              {t.heroDescription}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenRegister}
                className="btn-executive inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-slate-900 text-white font-semibold text-xs uppercase tracking-wider shadow-sm hover:bg-black transition-all"
              >
                <span>{t.joinNetworkBtn}</span>
                <span className="w-2 h-2 bg-white inline-block rounded-xs"></span>
              </button>

              <button
                onClick={() => scrollTo('section-id-lookup')}
                className="optical-glass-pill btn-executive inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-slate-800 font-semibold text-xs tracking-wider uppercase border border-slate-300 hover:border-slate-500 hover:text-black transition-all"
              >
                <span className="material-symbols-outlined text-slate-700 text-[18px]">verified_user</span>
                <span>{t.verifyMemberBtn}</span>
              </button>
            </div>

            {/* Micro Metrics Tag - responsive grid */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-slate-200 text-xs font-mono">
              <div className="p-2 sm:p-0 rounded-lg bg-slate-50/60 sm:bg-transparent border border-slate-200/60 sm:border-0">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">{t.metricAccredited}</span>
                <span className="text-slate-900 font-bold text-sm">{t.metricAccreditedVal}</span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
                  <div className="h-full w-4/5 bg-slate-700 rounded-full"></div>
                </div>
              </div>
              <div className="p-2 sm:p-0 rounded-lg bg-slate-50/60 sm:bg-transparent border border-slate-200/60 sm:border-0">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">{t.metricSecurity}</span>
                <span className="text-slate-900 font-bold text-sm">{t.metricSecurityVal}</span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
                  <div className="h-full w-full bg-slate-800 rounded-full"></div>
                </div>
              </div>
              <div className="p-2 sm:p-0 rounded-lg bg-slate-50/60 sm:bg-transparent border border-slate-200/60 sm:border-0">
                <span className="text-[10px] text-slate-500 uppercase block font-semibold">{t.metricGovernance}</span>
                <span className="text-slate-900 font-bold text-sm">{t.metricGovernanceVal}</span>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
                  <div className="h-full w-3/4 bg-slate-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Crystal Optical Glass Card framing Biological 3D Helix & Telemetry HUD */}
          <div className="lg:col-span-6 relative">
            <div className="optical-glass rounded-3xl p-3 sm:p-4 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.12)] border border-slate-200/90 bg-white/80">
              <span className="crosshair-corner crosshair-tl"></span>
              <span className="crosshair-corner crosshair-tr"></span>
              <span className="crosshair-corner crosshair-bl"></span>
              <span className="crosshair-corner crosshair-br"></span>

              {/* 3D Biological Animated Canvas Object with Interactive Mouse Tracker */}
              <BioDnaHelix lang={lang} />

              {/* Floating Micro Status Pills */}
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <div className="optical-glass-subtle rounded-xl p-2.5 flex items-center gap-2.5 border border-slate-200 bg-white">
                  <span className="material-symbols-outlined text-slate-700 text-[18px]">verified</span>
                  <div>
                    <p className="text-[9px] font-mono uppercase text-slate-500 font-semibold">{lang === 'ar' ? 'الاعتماد' : 'Accreditation'}</p>
                    <p className="text-xs font-semibold text-slate-900">{t.fullPracticeAuth}</p>
                  </div>
                </div>
                <div className="optical-glass-subtle rounded-xl p-2.5 flex items-center gap-2.5 border border-slate-200 bg-white">
                  <span className="material-symbols-outlined text-slate-700 text-[18px]">security</span>
                  <div>
                    <p className="text-[9px] font-mono uppercase text-slate-500 font-semibold">{lang === 'ar' ? 'بروتوكول الأمان' : 'Security Protocol'}</p>
                    <p className="text-xs font-semibold text-slate-900">{t.zeroSharedPassword}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO FOOTER BAR */}
        <div className="mt-14 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <button
            onClick={() => scrollTo('section-about')}
            className="inline-flex items-center gap-2.5 text-xs font-mono text-slate-600 hover:text-slate-950 transition-colors group font-semibold"
          >
            <span className="w-3 h-3 rounded-full border border-slate-400 flex items-center justify-center group-hover:border-black">
              <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-black"></span>
            </span>
            <span className="tracking-widest uppercase">{t.scrollDown}</span>
          </button>

          {/* Interactive Stepper */}
          <div className="optical-glass rounded-2xl p-2.5 sm:px-4 sm:py-3 flex items-center gap-4 text-xs font-mono shadow-sm border border-slate-200 bg-white/90">
            <span className="text-slate-800 font-medium hidden sm:inline">
              {lang === 'ar' ? projects[heroStep - 1].titleAr : projects[heroStep - 1].title}
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <div className="flex items-center gap-3">
              <button
                className="w-7 h-7 rounded-lg optical-glass-pill flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-all active:scale-90 border border-slate-200"
                onClick={prevStep}
                aria-label="Previous Project"
              >
                <span className="material-symbols-outlined text-[14px]">chevron_left</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-bold">(0{heroStep})</span>
                <div className="w-16 h-[3px] bg-slate-200 rounded-full relative overflow-hidden">
                  <div className="h-full w-full bg-slate-800 rounded-full bar-indicator-formal"></div>
                </div>
                <span className="text-slate-500">04</span>
              </div>
              <button
                className="w-7 h-7 rounded-lg optical-glass-pill flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-all active:scale-90 border border-slate-200"
                onClick={nextStep}
                aria-label="Next Project"
              >
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
            <button
              onClick={() => scrollTo('section-news')}
              className="text-[11px] text-slate-900 hover:text-black font-semibold flex items-center gap-1 transition-colors pl-2"
            >
              <span>{t.viewProject}</span>
              <span className="material-symbols-outlined text-[13px]">arrow_outward</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
