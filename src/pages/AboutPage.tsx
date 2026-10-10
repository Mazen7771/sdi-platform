import React from 'react';
import { Language } from '../types';

interface AboutPageProps {
  lang: Language;
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang }) => {
  const isArabic = lang === 'ar';

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-12">
      {/* Page Header */}
      <div className="bubble-glass rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 md:p-12 border border-white/95 shadow-xl bg-white/80 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-[#0f172a]">
          <span className="w-2 h-2 rounded-full bg-[#15803d]"></span>
          <span>{isArabic ? 'الميثاق والتأسيس • منذ 2010' : 'Heritage & Charter • Est. 2010'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-headline text-[#0f172a]">
          {isArabic ? 'عن نقابة أطباء السودان بأيرلندا (SDI)' : 'About Sudanese Doctors in Ireland (SDI)'}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-700 leading-relaxed max-w-3xl">
          {isArabic
            ? 'نقابة أطباء السودان بأيرلندا (Sudanese Doctors in Ireland) هي كيان نقابي ومهني معتمد، تأسست في جمهورية إيرلندا عام 2010 لتكون الممثل الرسمي للأطباء السودانيين العاملين في القطاع الصحي الإيرلندي بنظام عضوية واشتراكات سنوية معتمدة.'
            : 'Sudanese Doctors in Ireland (SDI) is an official professional medical union and association founded in 2010 to serve as the accredited representative body for Sudanese healthcare professionals across the Republic of Ireland, sustained through registered memberships and accredited professional services.'}
        </p>
      </div>

      {/* Core Objectives (Glass Animated Cards with Emblem Colors) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-7 border border-white/95 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#0f172a]"></div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0f172a] flex items-center justify-center font-bold">
            01
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a]">
            {isArabic ? 'التمثيل والدفاع عن الحقوق المهنية' : 'Professional Representation & Rights'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isArabic
              ? 'تمثيل الأطباء السودانيين أمام الهيئات الطبية الإيرلندية والدفاع عن حقوقهم الوظيفية والتعاقدية، وتوفير الدعم القانوني والاستشاري للأعضاء عند الحاجة.'
              : 'Representing Sudanese doctors before Irish medical and healthcare authorities, safeguarding employment rights, and offering guidance in professional practice.'}
          </p>
        </div>

        <div className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-7 border border-white/95 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#15803d]"></div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#15803d] flex items-center justify-center font-bold">
            02
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a]">
            {isArabic ? 'التطوير الأكاديمي والتدريب المستمر' : 'Academic Growth & CPD'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isArabic
              ? 'مساعدة الأطباء في التسجيل بالمجلس الطبي الإيرلندي (IMC)، وتسهيل التدريب التخصصي والزمالات بالتعاون مع الكليات الملكية للأطباء والجراحين.'
              : 'Assisting physicians with Irish Medical Council (IMC) licensing, specialty training schemes (BST/HST), and examination preparations (MRCPI / MRCS).'}
          </p>
        </div>

        <div className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-7 border border-white/95 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#dc2626]"></div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#dc2626] flex items-center justify-center font-bold">
            03
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a]">
            {isArabic ? 'التضامن الصحي مع السودان' : 'Medical Solidarity with Sudan'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isArabic
              ? 'مد يد العون للقطاع الصحي بالسودان عبر تدريب الكوادر المحلية، وتنظيم الورش السريرية، وإرسال المساعدات والمعدات الطبية الإنسانية العاجلة.'
              : 'Channeling expertise, telemedicine support, clinical workshops, and humanitarian medical relief to sustain and develop healthcare services in Sudan.'}
          </p>
        </div>

        <div className="bubble-glass rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 md:p-7 border border-white/95 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#ea580c]"></div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ea580c] flex items-center justify-center font-bold">
            04
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#0f172a]">
            {isArabic ? 'الترابط المجتمعي ورعاية الأسر' : 'Community & Family Cohesion'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isArabic
              ? 'تعزيز الروابط الأخوية والاجتماعية بين الأطباء وأسرهم في مختلف المدن والمقاطعات الإيرلندية، وإقامة الفعاليات الثقافية والاجتماعية الجامعة.'
              : 'Fostering collegiate fellowship and social cohesion among Sudanese medical families across Dublin, Cork, Galway, Limerick, and all Irish counties.'}
          </p>
        </div>
      </div>
    </div>
  );
};
