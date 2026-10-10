import React, { useState } from 'react';
import { NewsItem, Language } from '../types';

interface NewsModalProps {
  news: NewsItem | null;
  onClose: () => void;
  lang: Language;
}

function parseVideoEmbed(url?: string): { type: 'youtube' | 'vimeo' | 'direct' | 'link'; embedUrl?: string } {
  if (!url) return { type: 'link' };
  const trimmed = url.trim();

  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return { type: 'youtube', embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}` };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return { type: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  if (trimmed.endsWith('.mp4') || trimmed.endsWith('.webm')) {
    return { type: 'direct', embedUrl: trimmed };
  }

  return { type: 'link', embedUrl: trimmed };
}

export const NewsModal: React.FC<NewsModalProps> = ({ news, onClose, lang }) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const isArabic = lang === 'ar';

  if (!news) return null;

  const videoInfo = parseVideoEmbed(news.recordingUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 backdrop-blur-sm animate-fadeIn">
      <div className="bubble-glass w-full max-w-2xl rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-7 md:p-9 bg-white/95 border border-slate-200 shadow-2xl relative overflow-hidden text-slate-900 max-h-[92vh] max-h-[92dvh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-black transition-all shadow-xs z-20"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        {/* Date and Category Badges */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-600 mb-3">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-300">
            {isArabic && news.dateAr ? news.dateAr : news.date} • {isArabic && news.locationAr ? news.locationAr : news.location}
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-bold border border-blue-200">
            {isArabic && news.categoryAr ? news.categoryAr : news.category}
          </span>
        </div>

        {/* Image Banner if uploaded */}
        {news.imageUrl && (
          <div className="mb-4 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm max-h-64">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h3 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 mb-3 leading-tight">
          {isArabic && news.titleAr ? news.titleAr : news.title}
        </h3>

        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 mb-4 text-xs font-medium text-slate-700 leading-relaxed font-mono">
          {isArabic && news.summaryAr ? news.summaryAr : news.summary}
        </div>

        {/* Video / Speech Recording if available */}
        {news.recordingUrl && (
          <div className="mb-5 rounded-2xl overflow-hidden border border-slate-300 bg-slate-950 shadow-md">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-white font-mono">
              <span className="font-bold flex items-center gap-1.5 text-rose-400">
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                <span>{isArabic ? 'التسجيل المرئي أو الصوتي للبيان' : 'Video/Audio Briefing'}</span>
              </span>
              <a
                href={news.recordingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-emerald-400 hover:underline"
              >
                {isArabic ? 'فتح في نافذة مستقلة' : 'Open Video'}
              </a>
            </div>

            {videoInfo.type === 'youtube' && videoInfo.embedUrl && (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={videoInfo.embedUrl}
                  title="News Briefing"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            )}

            {videoInfo.type === 'vimeo' && videoInfo.embedUrl && (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={videoInfo.embedUrl}
                  title="News Briefing"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            )}

            {videoInfo.type === 'direct' && videoInfo.embedUrl && (
              <div className="aspect-video w-full bg-black">
                <video controls className="w-full h-full" src={videoInfo.embedUrl} />
              </div>
            )}

            {videoInfo.type === 'link' && (
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3">
                <div className="text-xs truncate">{news.recordingUrl}</div>
                <a
                  href={news.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0"
                >
                  {isArabic ? 'مشاهدة' : 'Watch'}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Official PDF Circular / Decree Document */}
        {news.pdfUrl && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-800 block">
                  {isArabic ? 'نسخة القرار / البيان الرسمي (PDF)' : 'Official Decree Circular (PDF)'}
                </span>
                <p className="text-xs font-bold text-slate-800 break-all">{news.pdfName || 'Official-Decree.pdf'}</p>
              </div>
            </div>

            <a
              href={news.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={news.pdfName || 'Official-Decree.pdf'}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>{isArabic ? 'تحميل الوثيقة الرسمية' : 'Download Document'}</span>
            </a>
          </div>
        )}

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed mb-6 font-mono">
          <p>{isArabic && news.detailsAr ? news.detailsAr : news.details}</p>
          <p>
            {isArabic 
              ? 'تلتزم الرابطة بإتاحة التقارير الرسمية والبيانات الدورية لكافة الأطباء المسجلين عبر البوابة الرقمية المعتمدة.'
              : 'Official transcripts, governance proceedings, and verified committee memorandums are archived within the SDI Cryptographic Registry Vault.'}
          </p>
        </div>

        {acknowledged && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
            <span>{isArabic ? 'تم تأكيد القراءة وتسجيل التفاعل بنجاح.' : 'Dispatch acknowledged. Activity recorded in session.'}</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500 font-bold">
            {isArabic && news.categoryAr ? news.categoryAr : news.category}
          </span>
          <button
            onClick={() => setAcknowledged(true)}
            className="px-6 py-2.5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
          >
            <span>{isArabic && news.actionTextAr ? news.actionTextAr : news.actionText}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
