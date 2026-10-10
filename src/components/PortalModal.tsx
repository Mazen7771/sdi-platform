import React, { useState } from 'react';
import { Language, DoctorMember } from '../types';
import { DOCTOR_REGISTRY } from '../data';

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const PortalModal: React.FC<PortalModalProps> = ({ isOpen, onClose, lang }) => {
  const [memberId, setMemberId] = useState('10452');
  const [password, setPassword] = useState('••••••••');
  const [loggedInDoctor, setLoggedInDoctor] = useState<DoctorMember | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'cpd' | 'card'>('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const id = memberId.trim() || 'SDI-0001';
    const doc = DOCTOR_REGISTRY.find(d => d.id === id || d.imcNumber === id);
    if (doc) {
      setLoggedInDoctor(doc);
    } else {
      setLoggedInDoctor({
        id,
        name: `Clinician #${id}`,
        nameAr: `طبيب رقم #${id}`,
        title: '',
        titleAr: '',
        roleCategory: '',
        specialty: '',
        hospital: '',
        division: '',
        standing: 'Active',
        imcNumber: id.startsWith('IMC') ? id : `IMC-${id}`,
        cpdUnits: 0,
        joinedYear: 2026,
      });
    }
  };

  const handleLogout = () => {
    setLoggedInDoctor(null);
  };

  const handleExportTranscript = () => {
    setIsExporting(true);
    setExportSuccess(false);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 4000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="optical-glass w-full max-w-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 bg-white border border-slate-200 shadow-2xl relative overflow-hidden text-slate-900 max-h-[92vh] max-h-[92dvh] overflow-y-auto">
        <span className="crosshair-corner crosshair-tl"></span>
        <span className="crosshair-corner crosshair-tr"></span>
        <span className="crosshair-corner crosshair-bl"></span>
        <span className="crosshair-corner crosshair-br"></span>

        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full optical-glass-pill flex items-center justify-center text-slate-500 hover:text-black hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {!loggedInDoctor ? (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-brand-navy">
                <span className="material-symbols-outlined text-xl">lock</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-headline text-slate-900">
                  {lang === 'ar' ? 'بوابة الأطباء — تسجيل الدخول' : 'SDI Physician Portal Access'}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {lang === 'ar' ? 'نظام التحقق الآمن للأطباء المسجلين في إيرلندا' : 'Single sign-on for accredited Sudanese clinicians in Ireland'}
                </p>
              </div>
            </div>

            <div className="p-3.5 mb-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-base text-slate-700 shrink-0 mt-0.5">info</span>
              <div>
                <p className="font-semibold text-slate-800">
                  {lang === 'ar' ? 'بيانات تجريبية للمعاينة السريعة:' : 'Quick Demo Credentials:'}
                </p>
                <p className="font-mono text-[11px] mt-0.5">
                  ID: <span className="font-bold text-slate-900">10452</span> (Consultant) or <span className="font-bold text-slate-900">10453</span> (Fellow) • Any password
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'رقم العضوية أو رقم المجلس الطبي (IMC)' : 'SDI Member ID or IMC Registration No.'}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">badge</span>
                  <input
                    type="text"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:border-slate-900 focus:outline-none"
                    placeholder="e.g. 10452"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-700 mb-1">
                  {lang === 'ar' ? 'كلمة المرور' : 'Secure Passkey / Password'}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">key</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:border-slate-900 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-slate-900 focus:ring-0" />
                  <span>{lang === 'ar' ? 'تذكر هذه الجلسة' : 'Remember institutional session'}</span>
                </label>
                <button 
                  type="button"
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      const el = document.getElementById('section-contact');
                      if (el) {
                        const headerOffset = window.innerWidth < 640 ? 76 : 96;
                        const pos = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                        window.scrollTo({ top: pos, behavior: 'smooth' });
                      }
                    }, 100);
                  }} 
                  className="text-slate-600 hover:text-black underline text-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'استعادة الرمز' : 'Forgot access key?'}
                </button>
              </div>

              <button
                type="submit"
                className="btn-executive w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 mt-4 hover:bg-black transition-all"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>{lang === 'ar' ? 'دخول البوابة الرسمية' : 'Authenticate & Enter Vault'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Logged in member dashboard view */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg font-mono">
                  {loggedInDoctor.name.charAt(4) || 'D'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {lang === 'ar' && loggedInDoctor.nameAr ? loggedInDoctor.nameAr : loggedInDoctor.name}
                    </h3>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      {lang === 'ar' ? 'نشط 2026' : 'VERIFIED 2026'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    IMC #{loggedInDoctor.imcNumber} • SDI Member #{loggedInDoctor.id}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-mono text-slate-500 hover:text-rose-600 flex items-center gap-1 self-start sm:self-center"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {lang === 'ar' ? 'ملخص الاعتماد' : 'Accreditation Overview'}
              </button>
              <button
                onClick={() => setActiveTab('cpd')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'cpd' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {lang === 'ar' ? 'سجل الساعات (CPD)' : 'CPD Transcript (48h)'}
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'card' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {lang === 'ar' ? 'البطاقة الرقمية' : 'Digital Member ID'}
              </button>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">{lang === 'ar' ? 'الدرجة السريرية' : 'Clinical Grade'}</span>
                    <span className="font-bold text-slate-900 block mt-1">{lang === 'ar' && loggedInDoctor.roleCategoryAr ? loggedInDoctor.roleCategoryAr : loggedInDoctor.roleCategory}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">{lang === 'ar' ? 'المستشفى التابع' : 'Hospital Trust'}</span>
                    <span className="font-bold text-slate-900 block mt-1 line-clamp-1">{lang === 'ar' && loggedInDoctor.hospitalAr ? loggedInDoctor.hospitalAr : loggedInDoctor.hospital}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">{lang === 'ar' ? 'الرصيد المعتمد' : 'Verified CPD'}</span>
                    <span className="font-bold text-emerald-700 block mt-1 font-mono">{loggedInDoctor.cpdUnits} Units (Accredited)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl optical-glass-subtle border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>{lang === 'ar' ? 'حالة مطابقة المجلس الطبي الإيرلندي (IMC)' : 'Irish Medical Council Compliance Status'}</span>
                    <span className="text-emerald-600 text-[11px] font-mono">100% VALIDATED</span>
                  </h4>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-full rounded-full"></div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                    {lang === 'ar' 
                      ? 'تم التحقق من استيفاء المعايير السنوية للكفاءة المهنية وتجديد التسجيل ضمن السجل التخصصي 2026.' 
                      : 'All annual professional competence criteria verified for Specialist Division retention under Medical Practitioners Act.'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'cpd' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{lang === 'ar' ? 'سلسلة طب الطوارئ السريرية 2026' : 'Acute Medicine & Trauma CPD Series 2026'}</h5>
                    <p className="text-[11px] text-slate-500">Royal College of Physicians of Ireland • 14 Units</p>
                  </div>
                  <span className="font-mono font-bold text-slate-800">14.0 PTS</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{lang === 'ar' ? 'محاكاة الإنعاش المتقدم وتدقيق الجودة' : 'Advanced Cardiac Life Support & Clinical Audit'}</h5>
                    <p className="text-[11px] text-slate-500">St. James\'s Hospital Academic Division • 12 Units</p>
                  </div>
                  <span className="font-mono font-bold text-slate-800">12.0 PTS</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{lang === 'ar' ? 'التوجيه المهني والأخلاقيات الطبية الإيرلندية' : 'Medicolegal Guidelines & Ethics Symposium'}</h5>
                    <p className="text-[11px] text-slate-500">SDI Annual Academic Conclave • 22 Units</p>
                  </div>
                  <span className="font-mono font-bold text-slate-800">22.0 PTS</span>
                </div>

                {exportSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                    <span>
                      {lang === 'ar'
                        ? 'تم تنزيل كشف درجات وساعات التطوير المهني الرقمي المعتمد بنجاح.'
                        : 'Encrypted CPD Transcript downloaded successfully for IMC audit.'}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleExportTranscript}
                  disabled={isExporting}
                  className={`btn-executive w-full py-2.5 rounded-xl text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 mt-2 ${
                    exportSuccess ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-slate-900 hover:bg-black'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {exportSuccess ? 'verified' : 'download'}
                  </span>
                  <span>
                    {isExporting
                      ? (lang === 'ar' ? 'جارِ التصدير...' : 'Exporting...')
                      : exportSuccess
                      ? (lang === 'ar' ? '✓ تم التصدير بنجاح' : '✓ Export Completed')
                      : (lang === 'ar' ? 'تصدير كشف الساعات بصيغة IMC الرسمية' : 'Download Signed Transcript for IMC')}
                  </span>
                </button>
              </div>
            )}

            {activeTab === 'card' && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_-rRrruHDM53FKnzumRVPfJdTHtWtAY16NiFuwxnCZPrVWXgkC-rMrXFOEHkvqLHPzyKTHLGsNPD3TkTkFv-k14llSBW0tWPNwFO_13N3RCR9NwRgAEAcfPyNFqbRqXUQTcCoJ-fhVrLbdMO8Q2xClmu1wwUIWkgHz2lI0_NMvZQQN9rB4-JITyg_9oLTGCO4hVgqtL1BrEFBz0_SIxGygdF6jV0_wIIy94MF2IJeKdewJOoa0nqYsvPGj4ckWKdRjQ" 
                        alt="SDI Crest" 
                        className="w-full h-full object-contain filter invert"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-xs tracking-wider uppercase block">Sudanese Doctors in Ireland</span>
                      <span className="text-[9px] text-slate-400 font-mono">OFFICIAL CLINICAL CREDENTIAL</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    VALID 2026
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <h4 className="text-base font-bold tracking-tight">
                    {loggedInDoctor.name}
                  </h4>
                  <p className="text-xs text-slate-300 font-mono">
                    {loggedInDoctor.title}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Hospital: {loggedInDoctor.hospital}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 block text-[9px]">IMC REGISTRATION</span>
                    <span className="font-bold text-white">#{loggedInDoctor.imcNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">SDI MEMBER ID</span>
                    <span className="font-bold text-white">#{loggedInDoctor.id}</span>
                  </div>
                  <div className="w-10 h-10 bg-white p-1 rounded">
                    {/* Simulated QR Code */}
                    <div className="w-full h-full bg-slate-900 grid grid-cols-3 gap-0.5 p-0.5">
                      <div className="bg-white"></div><div className="bg-slate-900"></div><div className="bg-white"></div>
                      <div className="bg-slate-900"></div><div className="bg-white"></div><div className="bg-slate-900"></div>
                      <div className="bg-white"></div><div className="bg-white"></div><div className="bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
