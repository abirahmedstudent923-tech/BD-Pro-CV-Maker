import React, { useState } from 'react';
import { Smartphone, Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface Props {
  lang: 'en' | 'bn';
}

export const MobileInstallBanner: React.FC<Props> = ({ lang }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isBn = lang === 'bn';

  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-emerald-800 via-[#006a4e] to-emerald-900 text-white px-3 py-2 border-b border-emerald-600/50 shadow-sm flex items-center justify-between gap-3 text-xs no-print">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <Smartphone className="w-4 h-4 text-amber-300" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white text-[11px] truncate">
              {isBn ? 'আপনার মোবাইলে ইনস্টল করুন (Mobile App)' : 'Install as Mobile App'}
            </p>
            <p className="text-[10px] text-emerald-100 truncate">
              {isBn ? 'হোম স্ক্রিন থেকে সহজে ও অফলাইনে সিভি তৈরি করুন' : 'Create CV offline with 1-tap from Home Screen'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-md flex items-center gap-1 shadow-sm text-[11px] transition"
          >
            <Download className="w-3 h-3 text-slate-900" />
            <span>{isBn ? 'ইনস্টল' : 'Install'}</span>
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/10 rounded text-emerald-200 hover:text-white transition"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
      />
    </>
  );
};
