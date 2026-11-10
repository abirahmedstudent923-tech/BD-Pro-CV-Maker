import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

interface Props {
  lang: 'en' | 'bn';
}

export const OfflineIndicator: React.FC<Props> = ({ lang }) => {
  const isOnline = useOnlineStatus();
  const isBn = lang === 'bn';

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl animate-fade-in no-print border border-amber-400/40">
      <WifiOff className="w-4 h-4 shrink-0 text-amber-100" />
      <span>
        {isBn
          ? 'অফলাইন মোড — কোনো ইন্টারনেট সংযোগ নেই, তবে আপনি নিরাপদে সিভি তৈরি ও এডিট করতে পারবেন।'
          : 'Offline Mode — Saved locally. You can continue creating your CV without internet.'}
      </span>
    </div>
  );
};
