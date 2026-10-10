import React, { useState } from 'react';
import { Language, PrecreatedId } from '../types';
import {
  claimNextUnusedId,
  getCurrentSessionId,
  setCurrentSessionId,
  load4000Ids,
  canCreateAccount,
  getSubscriptionInfo,
} from '../data/idStore';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAccountCreated: (assignedId: PrecreatedId) => void;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  lang,
  onAccountCreated,
}) => {
  const [issuedResult, setIssuedResult] = useState<PrecreatedId | null>(null);
  const [existingIdInput, setExistingIdInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkStatusMessage, setCheckStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentId = getCurrentSessionId();
  const accountCheck = canCreateAccount();
  const subInfo = getSubscriptionInfo(currentId);

  const handleClaimId = () => {
    setErrorMessage(null);

    // Rule: Cannot create two accounts at a time!
    if (!accountCheck.allowed && accountCheck.existingId) {
      setErrorMessage(
        lang === 'ar'
          ? `لا يمكن إنشاء أكثر من حساب في نفس الوقت. أنت مسجل بالفعل بالمعرف (#${accountCheck.existingId}).`
          : `Single Account Policy: You already hold Credential ID #${accountCheck.existingId}. Creating multiple simultaneous accounts is prohibited.`
      );
      return;
    }

    const res = claimNextUnusedId();
    if (res.success && res.id) {
      setIssuedResult(res.id);
      onAccountCreated(res.id);
    } else {
      setErrorMessage(res.error || 'Failed to allocate an ID.');
    }
  };

  const handleSwitchToExistingId = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const clean = existingIdInput.trim().toUpperCase();
    const pool = load4000Ids();
    const match = pool.find((item) => item.id.toUpperCase() === clean);

    if (!match) {
      setCheckStatusMessage(
        lang === 'ar'
          ? `المعرف "${clean}" غير مسجل في المستودع.`
          : `ID "${clean}" not found in the 4,000 credential directory.`
      );
      return;
    }

    setCurrentSessionId(match.id);
    const matchSub = getSubscriptionInfo(match.id);

    setCheckStatusMessage(
      match.isActivated
        ? lang === 'ar'
          ? `تم ربط الجلسة بالمعرف ${match.id}: الاشتراك السنوي نشط (${matchSub.daysRemaining} يوماً متبقية).`
          : `Session connected to ${match.id}: Annual subscription active (${matchSub.daysRemaining} days remaining).`
        : match.isExpired
        ? lang === 'ar'
          ? `المعرف ${match.id}: انتهت فترة الاشتراك السنوي وتم إلغاء التفعيل تلقائياً.`
          : `ID ${match.id}: 1-Year subscription expired and was automatically deactivated.`
        : lang === 'ar'
          ? `المعرف ${match.id} محجوز وقيد مراجعة المشرف (الأخبار فقط).`
          : `ID ${match.id} is issued and awaiting Admin activation (News only).`
    );

    setTimeout(() => {
      onAccountCreated(match);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      {/* Bubble Glass Modal Container */}
      <div className="bubble-glass w-full max-w-lg p-4 sm:p-7 md:p-9 border border-white/90 shadow-2xl relative bg-white/95 rounded-2xl sm:rounded-3xl max-h-[92vh] max-h-[92dvh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 rtl:right-auto rtl:left-6 w-9 h-9 rounded-full bubble-glass-pill flex items-center justify-center text-slate-500 hover:text-black transition-all shadow-xs"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 mb-6 text-center sm:text-left rtl:sm:text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bubble-glass-pill text-emerald-900 text-xs font-mono font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{lang === 'ar' ? 'نظام العضوية السنوي والمحدد بحساب واحد' : '1-Year Subscription & Single Account Policy'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-headline tracking-tight">
            {lang === 'ar' ? 'إنشاء حساب وحجز معرف عضوية' : 'Claim Credential Account'}
          </h2>

          <p className="text-xs text-slate-600 font-mono leading-relaxed">
            {lang === 'ar'
              ? 'يُسمح لكل طبيب/متصفح بحساب واحد فقط. عند تفعيل الحساب من المشرف، يسري الاشتراك لمدة عام كامل (365 يوماً)، ويتم إيقافه تلقائياً فور انتهاء العام.'
              : 'Strict single account limit per user. Once activated by Admin, credentials are valid for a 1-year annual term, automatically deactivating after 365 days unless renewed.'}
          </p>
        </div>

        {/* State A: Newly Claimed ID Success */}
        {issuedResult ? (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-6 rounded-3xl bubble-glass-emerald text-center space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-900 font-bold block">
                {lang === 'ar' ? 'معرف العضوية المخصص لك (حسابك الوحيد)' : 'Your Assigned Credential ID (Single Account)'}
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-emerald-800 bg-white/90 py-3.5 px-6 rounded-2xl border border-emerald-300 shadow-sm inline-block">
                {issuedResult.id}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  {lang === 'ar' ? 'الحالة الأولية: مقيد بالأخبار حتى اعتماد المشرف' : 'Initial Status: Restricted to News until Activated'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bubble-glass border border-slate-200/80 text-xs text-slate-700 space-y-2 font-mono">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-700">timer</span>
                <span>{lang === 'ar' ? 'قاعدة الاشتراك السنوي' : 'Annual 1-Year Term Policy'}</span>
              </div>
              <p className="leading-relaxed">
                {lang === 'ar'
                  ? `بمجرد قيام المشرف باعتماد المعرف #${issuedResult.id}، ستحصل على صلاحية كاملة لمدة 365 يوماً. عند انقضاء العام يتم إيقاف الحساب تلقائياً.`
                  : `Once the Admin elevates ID #${issuedResult.id}, your account is active for 365 days. After 1 year, it automatically deactivates until annual renewal.`}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="c-btn c-btn--teal w-full py-3.5 rounded-2xl font-bold text-xs shadow-md"
            >
              <span>{lang === 'ar' ? 'المتابعة إلى صفحة الأخبار' : 'Proceed to News Bulletin'}</span>
              <div className="c-btn__arrow-box">
                <span className="c-btn__arrow c-btn__arrow--main">→</span>
                <span className="c-btn__arrow c-btn__arrow--slide">→</span>
              </div>
            </button>
          </div>
        ) : (
          /* State B: Initial Form or Existing Account Card */
          <div className="space-y-5">
            {/* If user ALREADY has an account, prevent second account */}
            {currentId && (
              <div className="p-4 rounded-2xl bubble-glass border border-slate-300 text-xs font-mono space-y-2 bg-white/70">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {lang === 'ar' ? 'الحساب المسجل على هذا الجهاز' : 'Registered Device Account'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    subInfo.isActivated
                      ? 'bg-emerald-100 text-emerald-800'
                      : subInfo.isExpired
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {subInfo.isActivated
                      ? lang === 'ar' ? 'اشتراك سنوي نشط' : '1-Yr Active'
                      : subInfo.isExpired
                      ? lang === 'ar' ? 'انتهى الاشتراك (معلق تلقائياً)' : 'Expired (Auto-Deactivated)'
                      : lang === 'ar' ? 'مقيد (بانتظار المشرف)' : 'Restricted (News Only)'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xl font-black text-slate-900 font-mono">#{currentId}</span>
                  {subInfo.expiresAt && (
                    <span className="text-[11px] text-slate-500">
                      {subInfo.daysRemaining !== null ? `${subInfo.daysRemaining} days remaining` : ''}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-600 border-t border-slate-200/80 pt-2">
                  {lang === 'ar'
                    ? '⚠️ لا يمكنك إنشاء حساب ثانٍ. يُسمح بحساب واحد فقط لكل طبيب على هذا الجهاز.'
                    : '⚠️ Single account restriction: You cannot register a second account simultaneously.'}
                </p>
              </div>
            )}

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-mono">
                {errorMessage}
              </div>
            )}

            {/* Action Box */}
            <div className="p-6 rounded-3xl bubble-glass border border-slate-200 text-center space-y-4 bg-white/60">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {currentId
                    ? lang === 'ar' ? 'حسابك مسجل بالفعل' : 'Account Already Claimed'
                    : lang === 'ar' ? 'حجز معرف سنوي غير مستخدم' : 'Claim Your 1-Year Unused ID'}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {lang === 'ar'
                    ? 'صرف فوري من مصفوفة الـ 4000. حساب واحد فقط لكل مستخدم.'
                    : 'Instant assignment from the 4,000 pool. Exactly one account per user.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClaimId}
                disabled={!accountCheck.allowed}
                className={`c-btn w-full py-2.5 px-4 rounded-xl justify-center font-bold text-xs tracking-wide shadow-xs transition-all ${
                  accountCheck.allowed
                    ? 'c-btn--teal'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                }`}
              >
                <span>
                  {accountCheck.allowed
                    ? lang === 'ar' ? 'إنشاء الحساب وسحب المعرف' : 'Press to Create Account & Get ID'
                    : lang === 'ar' ? 'تم بلوغ الحد (حساب واحد فقط)' : 'Limit Reached (1 Account Maximum)'}
                </span>
                {accountCheck.allowed && (
                  <div className="c-btn__arrow-box">
                    <span className="c-btn__arrow c-btn__arrow--main">→</span>
                    <span className="c-btn__arrow c-btn__arrow--slide">→</span>
                  </div>
                )}
              </button>
            </div>

            {/* Check/Verify Existing ID */}
            <form onSubmit={handleSwitchToExistingId} className="pt-2 border-t border-slate-200/80 space-y-2">
              <label className="block text-[11px] font-mono text-slate-600 uppercase font-bold">
                {lang === 'ar' ? 'فحص حالة اشتراك معرف مسبق' : 'Check Existing ID Subscription Status'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={existingIdInput}
                  onChange={(e) => setExistingIdInput(e.target.value)}
                  placeholder="e.g. SDI-0001"
                  className="bubble-glass-input flex-1 px-3 py-2 text-xs font-mono uppercase text-slate-900 rounded-lg border border-slate-300 focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-mono font-bold border border-slate-300 transition-colors shadow-2xs"
                >
                  {lang === 'ar' ? 'تحقق' : 'Verify'}
                </button>
              </div>
              {checkStatusMessage && (
                <p className="text-[11px] font-mono text-slate-700 pt-1 leading-relaxed">
                  {checkStatusMessage}
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
