import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface ContactSectionProps {
  lang: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [formData, setFormData] = useState({
    name: '',
    imc: '',
    email: '',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', imc: '', email: '', message: '' });
    }, 4500);
  };

  return (
    <section className="w-full py-20 relative bg-slate-50/60 border-t border-slate-200" id="section-contact">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="optical-glass rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-sm bg-white border border-slate-200">
          <span className="crosshair-corner crosshair-tl"></span>
          <span className="crosshair-corner crosshair-tr"></span>
          <span className="crosshair-corner crosshair-bl"></span>
          <span className="crosshair-corner crosshair-br"></span>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-700 uppercase tracking-widest font-semibold">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                <span>{t.contactTag}</span>
              </div>
              <h2 className="text-3xl font-headline font-extrabold text-slate-900 tracking-tight">
                {t.contactHeading}
              </h2>
              <div className="w-20 h-[2px] bg-slate-400"></div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.contactSub}
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl optical-glass-subtle border border-slate-200 bg-slate-50/70">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                      {t.officialEmail}
                    </span>
                    <a className="text-sm font-mono font-bold text-slate-900 hover:text-black transition-colors" href="mailto:admin@sdi-ireland.org">
                      admin@sdi-ireland.org
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl optical-glass-subtle border border-slate-200 bg-slate-50/70">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                      {t.registeredJurisdiction}
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      {t.dublinJurisdiction}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl optical-glass-subtle border border-slate-200 bg-slate-50/70">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                      {t.officeHours}
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      {t.officeHoursVal}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              {sent ? (
                <div className="optical-glass-subtle rounded-2xl p-8 border border-emerald-200 bg-emerald-50/60 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-2xl">done_all</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {lang === 'ar' ? 'تم استلام الإرسالية لدى السكرتارية التنفيذية' : 'Transmission Dispatched to Secretariat'}
                  </h4>
                  <p className="text-xs text-slate-600 font-mono">
                    REF #SEC-TRANSMIT-2026-9041 • Response SLA: Within 24-48 Hours
                  </p>
                  <p className="text-xs text-slate-600">
                    {lang === 'ar' 
                      ? 'شكراً لتواصلك. سيقوم المنسق الإداري للرابطة بمراجعة استفسارك والرد عليك عبر البريد الإلكتروني.'
                      : 'Thank you for reaching out. The Secretariat Administrative Officer will review your submission and reply to your provided address.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="optical-glass-subtle rounded-2xl p-6 sm:p-8 space-y-4 border border-slate-200 bg-slate-50/50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-slate-700 font-semibold block">
                        {t.formNameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder={t.formNamePlaceholder}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-900 font-mono transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono uppercase text-slate-700 font-semibold block">
                        {t.formImcLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.imc}
                        onChange={(e) => setFormData({...formData, imc: e.target.value})}
                        placeholder={t.formImcPlaceholder}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-900 font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-slate-700 font-semibold block">
                      {t.formEmailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder={t.formEmailPlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-900 font-mono transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase text-slate-700 font-semibold block">
                      {t.formMessageLabel}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder={t.formMessagePlaceholder}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-slate-900 font-mono transition-all"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn-executive w-full py-4 rounded-xl bg-slate-900 text-white font-semibold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 hover:bg-black transition-all"
                  >
                    <span>{t.transmitBtn}</span>
                    <span className="w-2 h-2 bg-white inline-block rounded-xs"></span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
