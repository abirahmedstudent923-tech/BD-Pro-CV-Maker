import React, { useState } from 'react';
import { Smartphone, Download, X, Share2, PlusSquare, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
}

export const PWAInstallModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isBn = lang === 'bn';
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setInstallSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2500);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#006a4e] to-[#004d38] p-5 text-white flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#006a4e] shadow-md shrink-0 relative">
              <span className="font-black text-xl text-[#006a4e]">BD</span>
              <div className="w-3 h-3 bg-[#f42a41] rounded-full absolute -top-1 -right-1 ring-2 ring-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {isBn ? 'মোবাইলে ইনস্টল করুন' : 'Install on Mobile'}
              </h2>
              <p className="text-xs text-emerald-100">
                {isBn ? 'অ্যাপের মতো সরাসরি হোম স্ক্রিন থেকে ব্যবহার করুন' : 'Fast, native app experience on your phone'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-emerald-800 text-emerald-200 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* Benefits strip */}
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-center">
              <Zap className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
              <p className="font-bold text-slate-800 text-[11px]">{isBn ? 'সুপার ফাস্ট' : 'Super Fast'}</p>
              <p className="text-[10px] text-slate-500">{isBn ? 'কোনো লোডিং নেই' : 'Instant launch'}</p>
            </div>
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
              <p className="font-bold text-slate-800 text-[11px]">{isBn ? 'অফলাইন মোড' : 'Works Offline'}</p>
              <p className="text-[10px] text-slate-500">{isBn ? 'ইন্টারনেট ছাড়াই' : 'Full storage'}</p>
            </div>
            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100 text-center">
              <Smartphone className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
              <p className="font-bold text-slate-800 text-[11px]">{isBn ? '০ এমবি স্টোরেজ' : 'Lightweight'}</p>
              <p className="text-[10px] text-slate-500">{isBn ? 'ফোন ভারী হয় না' : '< 1 MB size'}</p>
            </div>
          </div>

          {/* Already installed banner */}
          {isInstalled && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center gap-2.5 text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <p className="font-bold">{isBn ? 'অ্যাপটি ইতিমধ্যে ইনস্টল করা আছে!' : 'App is already installed!'}</p>
                <p className="text-[11px] text-emerald-800">
                  {isBn
                    ? 'আপনার মোবাইলের হোম স্ক্রিনের অ্যাপ আইকন থেকে সরাসরি ওপেন করতে পারেন।'
                    : 'You can launch it directly from your mobile home screen.'}
                </p>
              </div>
            </div>
          )}

          {/* Direct Install Button (Android / Chromium) */}
          {isInstallable && !isInstalled && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3 bg-[#006a4e] hover:bg-[#00523c] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>{isBn ? 'এখনই ইনস্টল করুন (Install Now)' : 'Install App Now'}</span>
              </button>
              <p className="text-[11px] text-center text-slate-500">
                {isBn
                  ? 'এক ক্লিকেই আপনার ফোনে অ্যাপ হিসেবে যুক্ত হয়ে যাবে।'
                  : 'Instantly adds the app icon to your phone launcher.'}
              </p>
            </div>
          )}

          {/* iOS Safari Guide */}
          {isIOS && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <Smartphone className="w-4 h-4 text-slate-700" />
                {isBn ? 'iPhone / iPad (Safari) এ ইনস্টল করার নিয়ম:' : 'How to install on iPhone / iPad (Safari):'}
              </p>
              <ol className="space-y-2 text-slate-700 text-xs pl-1">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    ১
                  </span>
                  <div>
                    {isBn ? (
                      <>Safari ব্রাউজারের নিচে থাকা <strong className="text-slate-900 inline-flex items-center gap-0.5"><Share2 className="w-3 h-3 text-blue-600 inline" /> Share (শেয়ার)</strong> বাটনে চাপুন।</>
                    ) : (
                      <>Tap the <strong className="text-slate-900 inline-flex items-center gap-0.5"><Share2 className="w-3 h-3 text-blue-600 inline" /> Share</strong> button in Safari toolbar.</>
                    )}
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    ২
                  </span>
                  <div>
                    {isBn ? (
                      <>একটু নিচে স্ক্রল করে <strong className="text-slate-900 inline-flex items-center gap-0.5"><PlusSquare className="w-3 h-3 text-emerald-700 inline" /> Add to Home Screen (হোম স্ক্রিনে যোগ করুন)</strong> নির্বাচন করুন।</>
                    ) : (
                      <>Scroll down and tap <strong className="text-slate-900 inline-flex items-center gap-0.5"><PlusSquare className="w-3 h-3 text-emerald-700 inline" /> Add to Home Screen</strong>.</>
                    )}
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    ৩
                  </span>
                  <div>
                    {isBn ? (
                      <>উপরে ডান কোনায় <strong className="text-slate-900">Add</strong> বাটনে ট্যাপ করুন। ব্যাস, আপনার অ্যাপ তৈরি!</>
                    ) : (
                      <>Tap <strong className="text-slate-900">Add</strong> in top-right. Your mobile app is ready!</>
                    )}
                  </div>
                </li>
              </ol>
            </div>
          )}

          {/* Android Chrome Manual Guide (if beforeinstallprompt didn't fire or on other browsers) */}
          {!isIOS && !isInstallable && !isInstalled && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              <p className="font-bold text-slate-800 text-xs">
                {isBn ? 'Android / Chrome ব্রাউজারে ইনস্টল করার নিয়ম:' : 'How to install on Android Chrome:'}
              </p>
              <ol className="space-y-1.5 text-slate-700 text-xs pl-1">
                <li>১. Chrome ব্রাউজারের উপরে ডান পাশের <strong>তিনটি বিন্দু (⋮)</strong> মেনু চাপুন।</li>
                <li>২. <strong>"Install app"</strong> অথবা <strong>"Add to Home screen"</strong> (হোম স্ক্রিনে যোগ করুন) চাপুন।</li>
                <li>৩. <strong>Install</strong> বাটন চাপুন। আপনার মোবাইলে অ্যাপ তৈরি হয়ে যাবে!</li>
              </ol>
            </div>
          )}

          {installSuccess && (
            <div className="p-3 bg-emerald-600 text-white rounded-xl text-center font-bold">
              🎉 {isBn ? 'সফলভাবে ইনস্টল হয়েছে!' : 'Successfully Installed!'}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition"
          >
            {isBn ? 'ঠিক আছে' : 'Got it'}
          </button>
        </div>

      </div>
    </div>
  );
};
