import React, { useState, useEffect } from 'react';
import { CVData } from '../../types/cv';
import { ClassicTemplate } from '../Templates/ClassicTemplate';
import { ModernTemplate } from '../Templates/ModernTemplate';
import { CorporateTemplate } from '../Templates/CorporateTemplate';
import { AcademicTemplate } from '../Templates/AcademicTemplate';
import { downloadCVAsPDF, triggerNativePrint } from '../../utils/pdfExport';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  FileText,
  Smartphone,
  Download,
  Loader2,
  HelpCircle,
} from 'lucide-react';

interface Props {
  data: CVData;
  lang: 'en' | 'bn';
  onOpenPrintGuide?: () => void;
}

export const CVPreview: React.FC<Props> = ({ data, lang, onOpenPrintGuide }) => {
  const isBn = lang === 'bn';
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Responsive default zoom: 0.55 on mobile, 0.95 on desktop
  const [zoomLevel, setZoomLevel] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 0.55;
    }
    return 0.95;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && zoomLevel > 0.7) {
        setZoomLevel(0.55);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [zoomLevel]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.1, 1.4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.1, 0.4));
  const handleFitScreen = () => {
    if (window.innerWidth < 768) {
      setZoomLevel(0.52);
    } else {
      setZoomLevel(0.95);
    }
  };

  const handleDirectPrint = () => {
    triggerNativePrint();
  };

  const handleDirectDownloadPDF = async () => {
    setIsExportingPDF(true);
    try {
      await downloadCVAsPDF('printable-cv-sheet', data.personal.fullName || 'Bangladeshi_CV');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const renderSelectedTemplate = () => {
    switch (data.styling.template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'corporate':
        return <CorporateTemplate data={data} />;
      case 'academic':
        return <AcademicTemplate data={data} />;
      case 'classic':
      default:
        return <ClassicTemplate data={data} />;
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Top Floating Control Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2.5 mb-3 px-1 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-700" />
            {isBn ? 'লাইভ এ৪ প্রিভিউ (A4 Format)' : 'Live A4 Preview'}
          </span>
          <span className="text-[11px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded-full">
            {data.styling.format === '1page'
              ? isBn ? '১ পৃষ্ঠা (Resume)' : '1 Page (Resume)'
              : isBn ? '২ পৃষ্ঠা (Official CV)' : '2 Pages (Detailed BD CV)'}
          </span>
        </div>

        {/* Zoom & Quick Print Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs text-xs">
          
          {/* Zoom Buttons */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-semibold px-1 text-slate-700 min-w-[38px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleFitScreen}
              className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition border-l border-slate-200"
              title={isBn ? 'স্ক্রিনে ফিট করুন' : 'Fit to Screen'}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 1. Direct Download PDF File Button */}
          <button
            type="button"
            onClick={handleDirectDownloadPDF}
            disabled={isExportingPDF}
            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
            title={isBn ? 'সরাসরি PDF ফাইল ডাউনলোড করুন' : 'Direct Download PDF File'}
          >
            {isExportingPDF ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{isBn ? 'ডাউনলোড হচ্ছে...' : 'Saving PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{isBn ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
              </>
            )}
          </button>

          {/* 2. Direct Print / Save as PDF Dialog Button */}
          <button
            type="button"
            onClick={handleDirectPrint}
            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition"
            title={isBn ? 'প্রিন্ট অথবা PDF হিসেবে সেভ করুন' : 'Print or Save as PDF Dialog'}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isBn ? 'প্রিন্ট / PDF' : 'Print / PDF'}</span>
          </button>

          {/* Optional Print Settings Help */}
          {onOpenPrintGuide && (
            <button
              type="button"
              onClick={onOpenPrintGuide}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition"
              title={isBn ? 'প্রিন্ট সেটিংস গাইড' : 'Print Settings Guide'}
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          )}

        </div>
      </div>

      {/* CV Scroll Canvas Wrapper */}
      <div className="w-full overflow-x-auto pb-12 flex justify-center bg-slate-200/50 p-2 md:p-6 rounded-2xl border border-slate-200/80">
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="print-container"
        >
          {/* Printable A4 Container with ID for direct PDF engine */}
          <div id="printable-cv-sheet" className="a4-sheet border border-slate-200/80 bg-white">
            {renderSelectedTemplate()}
          </div>
        </div>
      </div>

    </div>
  );
};
