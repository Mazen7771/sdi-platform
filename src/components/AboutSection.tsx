import React from 'react';
import { Language, DoctorMember } from '../types';
import { TRANSLATIONS } from '../translations';
import { DOCTOR_REGISTRY } from '../data';

interface AboutSectionProps {
  lang: Language;
  onSelectDoctor: (doctor: DoctorMember) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang, onSelectDoctor }) => {
  const t = TRANSLATIONS[lang];
  const docFellow = DOCTOR_REGISTRY[1]; // Rayan Osman (Cardiology Specialist Fellow)
  const docConsultant = DOCTOR_REGISTRY[0]; // Tarig El-Hassan (Consultant Physician)

  return (
    <section className="w-full py-20 relative bg-slate-50/60 border-y border-slate-200" id="section-about">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-700 uppercase tracking-widest font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              <span>{t.aboutTag}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-slate-900 tracking-tight">
              {t.aboutHeading}
            </h2>
            <div className="w-20 h-[2px] bg-slate-400 mt-2"></div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
            {t.aboutSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Institutional Mandate Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="optical-glass rounded-3xl p-8 shadow-sm border border-slate-200 bg-white">
              <span className="crosshair-corner crosshair-tl"></span>
              <span className="crosshair-corner crosshair-tr"></span>
              <span className="crosshair-corner crosshair-bl"></span>
              <span className="crosshair-corner crosshair-br"></span>

              <h3 className="text-xl font-headline font-bold text-slate-900 mb-4">
                {t.mandateTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                {t.mandateDesc}
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl optical-glass-subtle border border-slate-200/80 bg-slate-50/70">
                  <span className="material-symbols-outlined text-slate-900 text-[20px] shrink-0 mt-0.5">verified</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.pillar1Title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{t.pillar1Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl optical-glass-subtle border border-slate-200/80 bg-slate-50/70">
                  <span className="material-symbols-outlined text-slate-900 text-[20px] shrink-0 mt-0.5">hub</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.pillar2Title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{t.pillar2Desc}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl optical-glass-subtle border border-slate-200/80 bg-slate-50/70">
                  <span className="material-symbols-outlined text-slate-900 text-[20px] shrink-0 mt-0.5">balance</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.pillar3Title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">{t.pillar3Desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portraits Grid (Role-Based Designations Only) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Portrait 1: Cardiology Specialist Fellow */}
            <div 
              onClick={() => onSelectDoctor(docFellow)}
              className="optical-glass rounded-3xl p-3.5 shadow-sm border border-slate-200 bg-white group emerging-card-clean relative overflow-hidden transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100">
                <img
                  alt="Sudanese physician specialist in UCD research lab"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1XpPVvT3IH5qTSwXb7FvBtLKMl9zZ1YQGYcbBpDalABMq-67CPN7OBxoPoY1tHUlKrhZyBBc83WtkReIVS0LObTMryW4naiHqzoQQRWiqn6W1UE6T8X7bM8mUEs4z7UafTbfvGBZa9EByJCT8UhvlyUqYTkMVQhmCbfJTnFlnLFpp6ILrg-J8KHUsLe16l3c8OBVtu06rMcojz9d7_pKp82g-OiyH7KtWhLc_rVgNnX-bjZwQM5r_D5Fw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Emerging interactive text drawer */}
                <div className="absolute bottom-3 inset-x-3 p-3.5 rounded-xl optical-glass text-xs emerging-drawer-clean border border-white/90 bg-white/95 shadow-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-slate-900 font-bold">
                      {lang === 'ar' ? 'الشعبة التخصصية' : 'Specialist Division'}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200">
                      {lang === 'ar' ? 'معتمد' : 'VERIFIED'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs leading-snug">
                    {lang === 'ar' && docFellow.titleAr ? docFellow.titleAr : docFellow.title}
                  </h4>
                  <span className="text-[10px] text-slate-600 block mt-1">
                    {lang === 'ar' ? 'مستشفى جامعة دبلن • عضو الرابطة' : 'University Hospital Dublin • SDI Member'}
                  </span>
                  <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden border border-slate-200">
                    <div className="h-full w-2/3 bg-slate-700"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Portrait 2: Consultant Physician */}
            <div 
              onClick={() => onSelectDoctor(docConsultant)}
              className="optical-glass rounded-3xl p-3.5 shadow-sm border border-slate-200 bg-white group emerging-card-clean relative overflow-hidden transition-all duration-300 sm:mt-8 cursor-pointer"
            >
              <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100">
                <img
                  alt="Sudanese doctor consultant in Dublin clinical hospital"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1UWLFj5CB-mVqD0XWqANoka4s1IyYPwjUrQ_B0cq5CvjLHRxWLdqFNbb8wgWgzYFCkw-5dbYgWLxEDHLNpmYpykMGS7uNM8uZS5JcvhQ7Z1NoQixCdy0azM0MUgBgQFfR47reopmsWu-fNjER5FKySSLcfZrAjH-kt81j8XR3phYyBtHqvxT0A29c8TLfmpchtWD3MaWuwQ7CMq4m8qNszKxAY1_zLIp_Ibg9eE_8BH_EohJjq97Fu9K0Q"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Emerging interactive text drawer */}
                <div className="absolute bottom-3 inset-x-3 p-3.5 rounded-xl optical-glass text-xs emerging-drawer-clean border border-white/90 bg-white/95 shadow-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-slate-900 font-bold">
                      {lang === 'ar' ? 'إدارة الصحة الإيرلندية' : 'Health Directorate'}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200">
                      {lang === 'ar' ? 'زميل استشاري' : 'FELLOW'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs leading-snug">
                    {lang === 'ar' && docConsultant.titleAr ? docConsultant.titleAr : docConsultant.title}
                  </h4>
                  <span className="text-[10px] text-slate-600 block mt-1">
                    {lang === 'ar' ? 'مستشفى سانت جيمس بدبلن • مجلس الرابطة' : "St. James's Hospital Dublin • SDI Council"}
                  </span>
                  <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden border border-slate-200">
                    <div className="h-full w-4/5 bg-slate-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
