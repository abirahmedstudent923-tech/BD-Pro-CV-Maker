import React from 'react';
import { Printer, X, CheckCircle2, FileDown, Settings, MonitorCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProceedPrint: () => void;
  lang: 'en' | 'bn';
}

export const PrintGuideModal: React.FC<Props> = ({ isOpen, onClose, onProceedPrint, lang }) => {
  if (!isOpen) return null;

  const isBn = lang === 'bn';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 no-print animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {isBn ? 'সঠিকভাবে PDF হিসেবে সেভ করার নিয়ম' : 'How to Export Perfect A4 PDF'}
              </h3>
              <p className="text-[11px] text-emerald-200">
                {isBn ? '১০০% নিখুঁত প্রিন্ট ও কালার পেতে ৩টি সেটিংস চেক করুন' : 'Ensure proper colors and zero margin clipping'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <div className="p-5 text-xs space-y-3.5 text-slate-700">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
            <MonitorCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-emerald-950 text-xs">
                {isBn ? 'প্রিন্ট ডায়ালগ ওপেন হলে নিচের অপশনগুলো নির্বাচন করুন:' : 'When the browser print dialog appears, set:'}
              </p>
              <ul className="space-y-1 text-[11px] text-emerald-900">
                <li>• <strong>Destination:</strong> Save as PDF (পিডিএফ হিসেবে সংরক্ষণ)</li>
                <li>• <strong>Paper Size:</strong> A4 (এ৪ পেপার সাইজ)</li>
                <li>• <strong>Margins:</strong> None বা Default (মার্জিন শূন্য বা স্বাভাবিক)</li>
                <li>• <strong>Options / More settings:</strong> 'Background graphics' চেক বক্সে টিক দিন</li>
              </ul>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            {isBn
              ? 'মোবাইল ব্রাউজারে থাকলে "Share > Print" অথবা থ্রি-ডট মেন্যু থেকে "Print" এ চাপ দিয়ে PDF আকারে সেভ করতে পারেন।'
              : 'On mobile, use your browser\'s "Share > Print" or "Print to PDF" option.'}
          </p>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5 text-xs font-semibold">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition"
          >
            {isBn ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onProceedPrint();
            }}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isBn ? 'এখনই প্রিন্ট / PDF ওপেন করুন' : 'Open Print / Save PDF'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
