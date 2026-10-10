import React, { useState } from 'react';
import { Language, AppPage, DoctorMember, Course, NewsItem } from '../types';
import { HeaderSearch } from './HeaderSearch';
import { getCurrentSessionId, checkIsActivated } from '../data/idStore';

interface HeaderProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onOpenCreateAccount: () => void;
  onOpenAdmin: () => void;
  doctors: DoctorMember[];
  courses: Course[];
  news: NewsItem[];
  onSelectDoctor: (doctor: DoctorMember) => void;
  onSelectCourse: (course: Course) => void;
  onSelectNews: (news: NewsItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  currentPage,
  onNavigate,
  onOpenCreateAccount,
  onOpenAdmin,
  doctors,
  courses,
  news,
  onSelectDoctor,
  onSelectCourse,
  onSelectNews,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const currentId = getCurrentSessionId();
  const isActivated = checkIsActivated(currentId);

  const navLinks: { page: AppPage; num: string; labelEn: string; labelAr: string; isProtected?: boolean }[] = [
    { page: 'home', num: '01', labelEn: 'Home', labelAr: 'الرئيسية' },
    { page: 'news', num: '02', labelEn: 'News', labelAr: 'الأخبار' },
    { page: 'courses', num: '03', labelEn: 'Courses', labelAr: 'الدورات', isProtected: true },
    { page: 'doctors', num: '04', labelEn: 'Doctors', labelAr: 'الأطباء', isProtected: true },
    { page: 'conferences', num: '05', labelEn: 'Conferences', labelAr: 'المؤتمرات', isProtected: true },
    { page: 'resources', num: '06', labelEn: 'Resources', labelAr: 'المكتبة', isProtected: true },
    { page: 'about', num: '07', labelEn: 'About', labelAr: 'عن الرابطة' },
    { page: 'contact', num: '08', labelEn: 'Contact', labelAr: 'التواصل' },
    { page: 'help', num: '09', labelEn: 'Help Guide', labelAr: 'دليل الاستخدام' },
  ];

  const currentNav = navLinks.find((l) => l.page === currentPage) || navLinks[0];

  const handleNavClick = (page: AppPage) => {
    setDrawerOpen(false);
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
        <div className="w-full max-w-[1580px] mx-auto px-2 sm:px-4 lg:px-6 pt-2 sm:pt-3">
          {/* Main Top Header Bubble Bar */}
          <div className="bubble-glass rounded-2xl sm:rounded-full px-3 sm:px-5 lg:px-6 h-14 sm:h-16 lg:h-18 flex items-center justify-between gap-2 sm:gap-3 border border-white/95 shadow-md bg-white/85">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-2 sm:gap-3 text-left rtl:text-right group"
              >
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center p-1 border border-slate-200 shadow-xs group-hover:border-[#15803d] transition-all shrink-0">
                  <img
                    alt="Sudanese Doctors in Ireland (SDI)"
                    className="w-full h-full object-contain filter drop-shadow-xs"
                    src="/sdi-logo.jpg"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="font-headline font-extrabold text-xs sm:text-base tracking-tight text-[#0f172a] group-hover:text-[#15803d] transition-colors leading-tight">
                      {lang === 'ar' ? 'نقابة أطباء السودان' : 'Sudanese Doctors'}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white px-1.5 sm:px-2 py-0.5 rounded-full bg-[#15803d]">
                      {lang === 'ar' ? 'بأيرلندا' : 'IRELAND'}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-normal hidden md:inline">
                    Sudanese Doctors in Ireland (SDI)
                  </span>
                </div>
              </button>
            </div>

            {/* Tablet "You Are Here" Active Location Badge */}
            <div className="hidden md:flex lg:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#15803d] text-[11px] font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803d] animate-pulse"></span>
              <span className="max-w-[110px] sm:max-w-none truncate">
                {lang === 'ar' ? currentNav.labelAr : currentNav.labelEn}
              </span>
            </div>

            {/* Desktop Navigation Links with Bubble Nav Pills */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
              {navLinks.map((item) => (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleNavClick(item.page)}
                  className={`bubble-nav-pill ${
                    currentPage === item.page
                      ? 'bubble-nav-pill--active'
                      : 'bubble-nav-pill--inactive'
                  }`}
                >
                  {currentPage === item.page && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  )}
                  <span className="leading-tight">
                    {lang === 'ar' ? item.labelAr : item.labelEn}
                  </span>
                  {item.isProtected && !isActivated && (
                    <span className="text-[10px] text-amber-500 shrink-0">🔒</span>
                  )}
                </button>
              ))}
            </nav>

            {/* Right Controls: Account, Search, Language Switcher, Drawer Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Account / Claim ID Button */}
              {currentId ? (
                <button
                  type="button"
                  onClick={onOpenCreateAccount}
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bubble-glass-pill border text-xs font-mono font-bold transition-all shadow-xs shrink-0 ${
                    isActivated
                      ? 'text-emerald-900 border-emerald-400 hover:bg-emerald-50'
                      : 'text-amber-900 border-amber-400 hover:bg-amber-50'
                  }`}
                  title={isActivated ? 'Full Activated Access' : 'Restricted to News • Awaiting Admin'}
                >
                  <span className={`w-2 h-2 rounded-full ${isActivated ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`}></span>
                  <span className="text-[11px]">#{currentId}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenCreateAccount}
                  className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#15803d] hover:bg-[#166534] text-white text-xs font-mono font-bold transition-all shadow-sm shrink-0"
                >
                  <span className="material-symbols-outlined text-[15px]">badge</span>
                  <span>{lang === 'ar' ? 'العضوية' : 'Membership'}</span>
                </button>
              )}

              {/* Quick Search Dropdown */}
              <div className="hidden sm:block shrink-0">
                <HeaderSearch
                  lang={lang}
                  doctors={doctors}
                  courses={courses}
                  news={news}
                  onSelectDoctor={onSelectDoctor}
                  onSelectCourse={onSelectCourse}
                  onSelectNews={onSelectNews}
                  compact={true}
                />
              </div>

              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => onToggleLang(lang === 'en' ? 'ar' : 'en')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white/90 text-xs font-semibold text-slate-700 transition-colors shadow-2xs shrink-0"
                title="Switch Language / تبديل اللغة"
              >
                {lang === 'en' ? 'العربية' : 'EN'}
              </button>

              {/* Drawer MENU Button */}
              <button
                type="button"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
                aria-label="Toggle Navigation Drawer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]"></span>
                <span className="hidden sm:inline">{drawerOpen ? 'CLOSE' : 'MENU'}</span>
                <span className="text-xs">{drawerOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>

          {/* Dedicated Mobile Horizontal Scrollable Page Switcher Strip (Only on Phone/Tablet) */}
          <div className="lg:hidden w-full pt-1.5 pb-0.5">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1 -mx-1">
              {navLinks.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => handleNavClick(item.page)}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#0f172a] text-white shadow-xs'
                        : 'bg-white/90 text-slate-700 hover:bg-white hover:text-[#0f172a] border border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]"></span>}
                    <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>
                    {item.isProtected && !isActivated && (
                      <span className="text-[10px] opacity-70">🔒</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          SLIDE-OVER DRAWER MENU
          ========================================================================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bubble-glass-dark text-white h-full p-4 sm:p-7 md:p-10 flex flex-col justify-between shadow-2xl relative overflow-y-auto rounded-none sm:rounded-l-[2.5rem] rtl:sm:rounded-r-[2.5rem] rtl:sm:rounded-l-none border-l border-white/20">
            {/* Drawer Top Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center p-1 border border-white/20">
                  <img
                    alt="SDI Crest"
                    className="w-full h-full object-contain"
                    src="/sdi-logo.jpg"
                  />
                </div>
                <div>
                  <span className="font-headline font-bold text-sm block">
                    {lang === 'ar' ? 'نقابة أطباء السودان بأيرلندا' : 'Sudanese Doctors in Ireland'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    SDI Navigation Menu
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-9 h-9 rounded-full bubble-glass-pill flex items-center justify-center text-sm font-bold text-slate-900 hover:scale-105"
              >
                ✕
              </button>
            </div>

            {/* Active User ID Notification */}
            <div className="my-5 p-4 sm:p-5 rounded-2xl bubble-glass-dark border border-white/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-bold">
                  {lang === 'ar' ? 'حالة العضوية الحالية' : 'Membership Status'}
                </span>
                <span className="text-base font-mono font-bold text-white">
                  {currentId ? `#${currentId}` : (lang === 'ar' ? 'غير مسجل' : 'Unregistered')}
                </span>
                {currentId && (
                  <span className={`block text-[10px] font-bold mt-0.5 ${
                    isActivated ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {isActivated 
                      ? (lang === 'ar' ? '✓ عضوية معتمدة' : '✓ Full Member') 
                      : (lang === 'ar' ? '• قيد الاعتماد' : '• Under Review')}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onOpenCreateAccount();
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#15803d] text-white hover:bg-[#166534] text-xs font-bold shadow-sm"
              >
                {currentId ? (lang === 'ar' ? 'تفاصيل العضوية' : 'Member Details') : (lang === 'ar' ? 'حساب العضوية' : 'Member ID')}
              </button>
            </div>

            {/* Numbered Menu Links */}
            <div className="space-y-1.5 flex-1 my-2">
              {navLinks.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => handleNavClick(item.page)}
                    className={`w-full py-2.5 sm:py-3 px-4 rounded-2xl flex items-center justify-between text-left rtl:text-right transition-all group ${
                      isActive
                        ? 'bg-[#15803d]/40 text-emerald-200 border border-[#15803d]/60 font-bold'
                        : 'hover:bg-white/5 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold ${isActive ? 'text-emerald-300' : 'text-slate-500'}`}>
                        {item.num}
                      </span>
                      <span className="text-base sm:text-lg font-bold font-headline">
                        {lang === 'ar' ? item.labelAr : item.labelEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#15803d] text-white">
                          {lang === 'ar' ? 'أنت هنا' : 'Active'}
                        </span>
                      )}
                      {item.isProtected && !isActivated && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {lang === 'ar' ? 'مقيد' : 'Locked'}
                        </span>
                      )}
                      <span className="text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                        →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 flex items-center justify-center gap-2 transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-400">admin_panel_settings</span>
                <span>{lang === 'ar' ? 'لوحة تحكم المشرف' : 'Secretariat Admin Console'}</span>
              </button>

              <div className="text-center text-[10px] text-slate-400">
                © 2010–{new Date().getFullYear()} SUDANESE DOCTORS IN IRELAND (SDI)
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
