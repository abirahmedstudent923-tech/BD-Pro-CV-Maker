import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface Props {
  lang: 'en' | 'bn';
}

export const PWAInstallButton: React.FC<Props> = ({ lang }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isBn = lang === 'bn';

  // If already running in standalone mode (already installed), no need for install button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 shadow-md transition active:scale-95 animate-pulse text-xs border border-amber-300"
        title={isBn ? 'মোবাইলে ইনস্টল করুন' : 'Install on Mobile'}
      >
        <Smartphone className="w-4 h-4 text-slate-900" />
        <span>{isBn ? 'মোবাইলে ইনস্টল করুন' : 'Install Mobile App'}</span>
      </button>

      <PWAInstallModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lang={lang}
      />
    </>
  );
};
