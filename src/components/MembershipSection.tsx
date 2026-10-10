import React, { useState } from 'react';
import { Language, DoctorMember } from '../types';
import { TRANSLATIONS } from '../translations';
import { DOCTOR_REGISTRY } from '../data';

interface MembershipSectionProps {
  lang: Language;
  doctors?: DoctorMember[];
  onOpenRegister: () => void;
  onSelectDoctor: (doctor: DoctorMember) => void;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({ 
  lang, 
  doctors = DOCTOR_REGISTRY,
  onOpenRegister,
  onSelectDoctor
}) => {
  const t = TRANSLATIONS[lang];
  const [lookupInput, setLookupInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<DoctorMember | null>(() => (doctors && doctors.length > 0 ? doctors[0] : null));
  const [hasSearched, setHasSearched] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const query = lookupInput.trim().toLowerCase();
    if (!query) {
      setErrorMessage(
        lang === 'ar'
          ? 'يرجى إدخال رقم العضوية المكون من 5 أرقام أو رقم التسجيل الطبي.'
          : 'Please enter a 5-digit SDI Member ID or IMC Number.'
      );
      return;
    }
    setErrorMessage(null);

    const found = doctors.find(d => 
      d.id.toLowerCase() === query || 
      d.imcNumber.toLowerCase() === query ||
      d.name.toLowerCase().includes(query) ||
      (d.nameAr && d.nameAr.includes(query))
    );
    if (found) {
      setSearchResult(found);
    } else {
      // Mock generated verified record for valid digit format
      setSearchResult({
        id: query,
        name: `Dr. Registered Clinician (ID #${query})`,
        nameAr: `د. ممارس طبي معتمد (رقم #${query})`,
        title: '',
        titleAr: '',
        roleCategory: '',
        roleCategoryAr: '',
        specialty: '',
        specialtyAr: '',
        hospital: '',
        hospitalAr: '',
        imcNumber: query.length >= 6 ? query : `4${query}`,
        standing: 'Active',
        standingAr: 'عضوية نشطة وموثقة 2026',
        cpdUnits: 0,
        joinedYear: 2026,
        division: ''
      });
    }
    setHasSearched(true);
  };

  const setSampleQuery = (id: string) => {
    setLookupInput(id);
    const found = DOCTOR_REGISTRY.find(d => d.id === id);
    if (found) {
      setSearchResult(found);
      setHasSearched(true);
    }
  };

  return (
    <section className="w-full py-20 relative bg-white" id="section-membership">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-800 uppercase tracking-widest font-semibold">
            <span>{t.membershipTag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-headline font-extrabold text-slate-900 tracking-tight">
            {t.membershipHeading}
          </h2>
          <div className="w-20 h-[2px] bg-slate-300 mx-auto"></div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.membershipSub}
          </p>
        </div>

        {/* 5-Step Stepper Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-12 sm:mb-16">
          {/* Step 1 */}
          <div className="optical-glass rounded-2xl p-5 relative flex flex-col justify-between hover:border-slate-400 transition-all group bg-white border border-slate-200 shadow-sm">
            <span className="crosshair-corner crosshair-tl"></span>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                  01
                </span>
                <span className="material-symbols-outlined text-slate-700 text-[18px]">person_add</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1.5 group-hover:text-black transition-colors">
                {t.step1Title}
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-[9px] font-mono text-slate-900 font-bold">
              {t.step1Status}
            </div>
          </div>

          {/* Step 2 */}
          <div className="optical-glass rounded-2xl p-5 relative flex flex-col justify-between hover:border-slate-400 transition-all group bg-white border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 font-mono font-bold text-xs flex items-center justify-center border border-slate-200">
                  02
                </span>
                <span className="material-symbols-outlined text-slate-700 text-[18px]">description</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1.5 group-hover:text-black transition-colors">
                {t.step2Title}
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-[9px] font-mono text-slate-500">
              {t.step2Status}
            </div>
          </div>

          {/* Step 3 */}
          <div className="optical-glass rounded-2xl p-5 relative flex flex-col justify-between hover:border-slate-400 transition-all group bg-white border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 font-mono font-bold text-xs flex items-center justify-center border border-slate-200">
                  03
                </span>
                <span className="material-symbols-outlined text-slate-700 text-[18px]">account_balance</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1.5 group-hover:text-black transition-colors">
                {t.step3Title}
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-[9px] font-mono text-slate-700 font-semibold">
              {t.step3Status}
            </div>
          </div>

          {/* Step 4 */}
          <div className="optical-glass rounded-2xl p-5 relative flex flex-col justify-between hover:border-slate-400 transition-all group bg-white border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 font-mono font-bold text-xs flex items-center justify-center border border-slate-200">
                  04
                </span>
                <span className="material-symbols-outlined text-slate-700 text-[18px]">policy</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1.5 group-hover:text-black transition-colors">
                {t.step4Title}
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t.step4Desc}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-[9px] font-mono text-slate-500">
              {t.step4Status}
            </div>
          </div>

          {/* Step 5 */}
          <div className="optical-glass rounded-2xl p-5 relative flex flex-col justify-between hover:border-slate-400 transition-all group bg-white border border-slate-200 shadow-sm">
            <span className="crosshair-corner crosshair-br"></span>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                  05
                </span>
                <span className="material-symbols-outlined text-slate-700 text-[18px]">lock_open</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-1.5 group-hover:text-black transition-colors">
                {t.step5Title}
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t.step5Desc}
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 text-[9px] font-mono text-slate-900 font-bold">
              {t.step5Status}
            </div>
          </div>
        </div>

        {/* Registry Quick Lookup Widget & Callout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center" id="section-id-lookup">
          {/* Create Account Card */}
          <div className="lg:col-span-5 optical-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative space-y-4 sm:space-y-5 bg-white border border-slate-200 shadow-sm">
            <span className="crosshair-corner crosshair-tl"></span>
            <span className="crosshair-corner crosshair-tr"></span>
            <span className="crosshair-corner crosshair-bl"></span>
            <span className="crosshair-corner crosshair-br"></span>

            <span className="text-[11px] font-mono uppercase text-slate-700 font-bold tracking-wider">
              {t.startVerificationTag}
            </span>
            <h3 className="text-xl sm:text-2xl font-headline font-bold text-slate-900">
              {t.joinRegistryHeading}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.joinRegistryDesc}
            </p>
            <button
              onClick={onOpenRegister}
              className="btn-executive w-full py-3.5 sm:py-4 px-6 rounded-full bg-slate-900 text-white font-semibold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 hover:bg-black transition-all"
            >
              <span>{t.createAccountBtn}</span>
              <span className="w-2 h-2 bg-white inline-block rounded-xs"></span>
            </button>
          </div>

          {/* Interactive Member ID Quick-Lookup Tool */}
          <div className="lg:col-span-7 optical-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 relative space-y-4 bg-white border border-slate-200 shadow-sm">
            <span className="crosshair-corner crosshair-tl"></span>
            <span className="crosshair-corner crosshair-tr"></span>
            <span className="crosshair-corner crosshair-bl"></span>
            <span className="crosshair-corner crosshair-br"></span>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                  {t.publicLookupHeading}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">{t.hseAuditProtocol}</span>
            </div>

            <p className="text-xs text-slate-600">
              {t.lookupPrompt}
            </p>

            {/* Preset shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-600">
              <span>{lang === 'ar' ? 'أرقام سريعة للمعاينة:' : 'Try sample IDs:'}</span>
              {['10452', '10453', '20914', '30811'].map((sampleId) => (
                <button
                  key={sampleId}
                  onClick={() => setSampleQuery(sampleId)}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-colors"
                >
                  #{sampleId}
                </button>
              ))}
            </div>

            <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3 pt-1">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">
                  badge
                </span>
                <input
                  type="text"
                  value={lookupInput}
                  onChange={(e) => {
                    setLookupInput(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={t.lookupPlaceholder}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-900 focus:bg-white font-mono transition-all"
                />
              </div>
              <button
                type="submit"
                className="btn-executive px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs uppercase tracking-wider shadow-xs flex items-center justify-center gap-2 shrink-0 hover:bg-black"
              >
                <span className="material-symbols-outlined text-[17px]">search</span>
                <span>{t.validateIdBtn}</span>
              </button>
            </form>

            {errorMessage && (
              <p className="text-xs text-red-600 font-medium px-1 flex items-center gap-1.5 animate-fadeIn">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errorMessage}</span>
              </p>
            )}

            {/* Dynamic Verification Result Box */}
            {searchResult && (
              <div 
                onClick={() => onSelectDoctor(searchResult)}
                className="mt-4 p-4 rounded-xl optical-glass-subtle border border-slate-200 bg-slate-50/80 cursor-pointer hover:border-slate-400 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-900 shrink-0">
                      <span className="material-symbols-outlined text-[22px]">verified</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">
                          {lang === 'ar' && searchResult.nameAr ? searchResult.nameAr : searchResult.name}
                        </h4>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold">
                          {t.verifiedBadge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-mono mt-0.5">
                        {lang === 'ar' && searchResult.titleAr ? searchResult.titleAr : searchResult.title} • SDI #{searchResult.id}
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    <span className="text-[9px] font-mono uppercase text-slate-500 font-semibold">{t.cpdCreditsLabel}</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{searchResult.cpdUnits} Units Verified</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
