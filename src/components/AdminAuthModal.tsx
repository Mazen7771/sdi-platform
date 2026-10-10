import React, { useState } from 'react';
import { Language } from '../types';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: Language;
}

export const ADMIN_AUTH_KEY = 'sdi_admin_session_auth';
export const ADMIN_PASSWORD = '18990sdi@';

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
      setErrorMessage(
        lang === 'ar'
          ? 'كلمة المرور غير صحيحة. يرجى التحقق وإعادة المحاولة.'
          : 'Invalid administrator credentials. Access denied.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bubble-glass w-full max-w-md rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-7 md:p-9 bg-white/95 border border-white/95 shadow-2xl relative max-h-[92vh] max-h-[92dvh] overflow-y-auto">
        <button
          type="button"
          onClick={() => {
            setError(false);
            setPassword('');
            onClose();
          }}
          className="absolute top-5 right-5 rtl:left-5 rtl:right-auto w-9 h-9 rounded-full bubble-glass-pill flex items-center justify-center text-slate-500 hover:text-black transition-all shadow-xs"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Security Crest Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-2xl text-emerald-400">admin_panel_settings</span>
          </div>
          <div>
            <h3 className="font-headline font-extrabold text-slate-900 text-lg leading-tight">
              {lang === 'ar' ? 'مصادقة لوحة تحكم الأمانة العامة' : 'Secretariat Console Access'}
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {lang === 'ar' ? 'منطقة إدارية مقيدة ومحمية' : 'Restricted Administrative Clearance'}
            </p>
          </div>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-700 flex items-center justify-between">
              <span>{lang === 'ar' ? 'رمز حماية المشرف (Admin Password)' : 'Administrator Password'}</span>
              <span className="text-[10px] text-slate-400 font-mono">OWASP ASVS L2</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400 text-base">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder={lang === 'ar' ? 'أدخل كلمة مرور الإدارة...' : 'Enter administrative key...'}
                className={`bubble-glass-input w-full pl-9 pr-10 rtl:pr-9 rtl:pl-10 py-3 text-xs font-mono tracking-wider focus:outline-none transition-all ${
                  error
                    ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:border-rose-600'
                    : 'text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-base flex items-center"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {error && (
              <p className="text-[11px] text-rose-600 font-mono flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[13px]">error</span>
                <span>{errorMessage}</span>
              </p>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bubble-glass border border-slate-200/80 text-[11px] text-slate-600 space-y-1 font-mono bg-white/60">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>{lang === 'ar' ? 'حماية مشفرة' : 'Encrypted Session Protection'}</span>
            </div>
            <p className="text-[10px] text-slate-500">
              {lang === 'ar'
                ? 'الوصول مصرح به فقط لمسؤولي الأمانة العامة لرابطة الأطباء السودانيين في إيرلندا.'
                : 'Access permitted strictly to authorized SDI Secretariat administrators.'}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setError(false);
                setPassword('');
                onClose();
              }}
              className="px-4 py-2.5 rounded-full bubble-glass-pill text-xs font-mono font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="c-btn c-btn--teal py-2.5 px-5 rounded-full font-bold text-xs shadow-md"
            >
              <span>{lang === 'ar' ? 'دخول لوحة الإدارة' : 'Authenticate & Unlock'}</span>
              <div className="c-btn__arrow-box">
                <span className="c-btn__arrow c-btn__arrow--main">→</span>
                <span className="c-btn__arrow c-btn__arrow--slide">→</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
