import React from 'react';
import { Language, AppPage } from '../types';

interface FooterProps {
  lang: Language;
  onNavigate: (page: AppPage) => void;
  onOpenCreateAccount: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onNavigate,
  onOpenCreateAccount,
  onOpenAdmin,
}) => {
  const isArabic = lang === 'ar';

  return (
    <footer className="w-full pt-6 sm:pt-8 pb-16 px-3 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto bubble-glass rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-12 border border-white/95 shadow-lg bg-white/85">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-1.5 border border-slate-200 shadow-xs shrink-0">
                <img
                  alt="SDI Official Emblem"
                  className="w-full h-full object-contain filter drop-shadow-xs"
                  src="/sdi-logo.jpg"
                />
              </div>
              <div>
                <span className="font-headline font-bold text-lg text-[#0f172a] tracking-tight block">
                  {isArabic ? 'نقابة أطباء السودان بأيرلندا' : 'Sudanese Doctors in Ireland'}
                </span>
                <span className="text-xs text-[#15803d] font-semibold block">
                  Sudanese Doctors in Ireland (SDI) • Est. 2010
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-md leading-relaxed">
              {isArabic
                ? 'الكيان المهني والنقابي الممثل للأطباء السودانيين في جمهورية إيرلندا. ملتزمون بتعزيز الكفاءة المهنية، ورعاية شؤون الأعضاء، ودعم النظام الصحي بالسودان.'
                : 'The official representative union for Sudanese doctors and healthcare practitioners in the Republic of Ireland. Dedicated to professional representation, training, welfare, and medical solidarity.'}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-[#0f172a]">
              <span className="w-2 h-2 rounded-full bg-[#15803d]"></span>
              <span>{isArabic ? 'كيان نقابي ومهني معتمد للأطباء' : 'Official Professional Medical Union & Association'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
              {isArabic ? 'أقسام الموقع' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#0f172a] transition-colors"
                >
                  {isArabic ? 'الرئيسية' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { onNavigate('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#0f172a] transition-colors"
                >
                  {isArabic ? 'عن الرابطة والدستور' : 'About Union & Mandate'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { onNavigate('news'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#0f172a] transition-colors"
                >
                  {isArabic ? 'الأخبار والبيانات الرسمية' : 'Official Bulletins & News'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { onNavigate('doctors'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#0f172a] transition-colors"
                >
                  {isArabic ? 'سجل الأطباء' : 'Doctors Directory'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { onNavigate('courses'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#0f172a] transition-colors"
                >
                  {isArabic ? 'البرامج والتدريب الطبي' : 'Clinical Education'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { onNavigate('help'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#0f172a] transition-colors font-bold text-emerald-800"
                >
                  {isArabic ? 'دليل الاستخدام والتشغيل' : 'Actionable Help Guide'}
                </button>
              </li>
            </ul>
          </div>

          {/* Secretariat & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
              {isArabic ? 'العضوية والتواصل' : 'Membership & Office'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button
                  type="button"
                  onClick={onOpenCreateAccount}
                  className="text-[#0f172a] hover:text-[#15803d] font-bold transition-colors"
                >
                  {isArabic ? 'حساب وبطاقة العضوية (ID)' : 'Member Credential ID'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { onNavigate('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#0f172a] transition-colors"
                >
                  {isArabic ? 'التواصل مع السكرتارية' : 'Contact Secretariat'}
                </button>
              </li>
              {onOpenAdmin && (
                <li className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0f172a] text-xs font-semibold transition-colors border border-slate-300 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[15px] text-[#15803d]">admin_panel_settings</span>
                    <span>{isArabic ? 'لوحة تحكم الإدارة' : 'Admin Portal'}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © 2010–{new Date().getFullYear()} Sudanese Doctors in Ireland (SDI) | نقابة أطباء السودان بأيرلندا.
          </p>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span>Dublin, Ireland</span>
            <span>·</span>
            <span>sdui.ie</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
