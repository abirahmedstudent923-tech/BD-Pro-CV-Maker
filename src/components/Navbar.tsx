import React, { useRef } from 'react';
import { ROLE_PRESETS } from '../data/presets';
import { CVData, CVStyling } from '../types/cv';
import {
  Sparkles,
  Printer,
  Mail,
  Download,
  Upload,
  RefreshCw,
  Palette,
  FileCheck2,
  Languages,
  Smartphone,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { downloadCVAsPDF, triggerNativePrint } from '../utils/pdfExport';

interface Props {
  cvData: CVData;
  onUpdateStyling: (styling: Partial<CVStyling>) => void;
  onApplyPreset: (presetId: string) => void;
  onOpenCoverLetter: () => void;
  onOpenAIAssistant: () => void;
  onOpenSurveyGuide: () => void;
  onReset: () => void;
  onLoadSample: () => void;
  lang: 'en' | 'bn';
  onToggleLang: () => void;
  onExportJSON: () => void;
  onImportJSON: (imported: CVData) => void;
  onToast: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  onOpenPrintGuide: () => void;
}

export const Navbar: React.FC<Props> = ({
  cvData,
  onUpdateStyling,
  onApplyPreset,
  onOpenCoverLetter,
  onOpenAIAssistant,
  onOpenSurveyGuide,
  onReset,
  onLoadSample,
  lang,
  onToggleLang,
  onExportJSON,
  onImportJSON,
  onToast,
  onOpenPrintGuide,
}) => {
  const isBn = lang === 'bn';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExportingPDF, setIsExportingPDF] = React.useState(false);

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    try {
      await downloadCVAsPDF('printable-cv-sheet', cvData.personal.fullName || 'Bangladeshi_CV');
      onToast(isBn ? 'PDF সফলভাবে ডাউনলোড হয়েছে!' : 'PDF downloaded successfully!', 'success');
    } catch {
      onToast(isBn ? 'PDF ডাউনলোড ব্যর্থ, প্রিন্ট অপশন ব্যবহার করুন' : 'PDF download failed, using print dialog', 'warning');
      triggerNativePrint();
    } finally {
      setIsExportingPDF(false);
    }
  };

  const colors = [
    { label: 'BD Green', value: '#006a4e' },
    { label: 'Deep Navy', value: '#0f2942' },
    { label: 'Royal Blue', value: '#1d4ed8' },
    { label: 'Maroon', value: '#831843' },
    { label: 'Charcoal', value: '#1e293b' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.personal && parsed.educations) {
            onImportJSON(parsed);
            onToast(isBn ? 'ডাটা সফলভাবে ইম্পোর্ট হয়েছে!' : 'CV data imported successfully!', 'success');
          } else {
            onToast(isBn ? 'ভুল ফরম্যাটের ফাইল!' : 'Invalid CV JSON format', 'error');
          }
        } catch {
          onToast(isBn ? 'ফাইল পড়তে সমস্যা হয়েছে' : 'Failed to parse JSON file', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="bg-[#006a4e] text-white shadow-md sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#006a4e] font-black text-lg shadow-sm relative">
            <span className="text-[#006a4e]">BD</span>
            <div className="w-2.5 h-2.5 bg-[#f42a41] rounded-full absolute -top-0.5 -right-0.5 ring-2 ring-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-white">
                BD Pro CV Maker
              </h1>
              <span className="text-[10px] bg-emerald-950/70 text-emerald-200 border border-emerald-600/40 px-1.5 py-0.2 rounded font-mono">
                v2.5 Pro
              </span>
            </div>
            <p className="text-[11px] text-emerald-100">
              {isBn ? 'স্মার্ট ও প্রফেশনাল বাংলাদেশি সিভি বিল্ডার' : 'Bangladeshi Professional CV & Resume Builder'}
            </p>
          </div>
        </div>

        {/* Quick Role Preset Picker */}
        <div className="flex items-center gap-2 bg-emerald-950/60 px-2.5 py-1.5 rounded-lg border border-emerald-600/40 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="text-emerald-100 font-medium whitespace-nowrap">
            {isBn ? 'অটো-ফিল (Preset):' : 'Role Preset:'}
          </span>
          <select
            onChange={(e) => onApplyPreset(e.target.value)}
            defaultValue=""
            className="bg-emerald-900/90 text-white text-xs rounded border border-emerald-500/40 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
          >
            <option value="" disabled>
              -- {isBn ? 'পেশা নির্বাচন করুন' : 'Select Profession'} --
            </option>
            {ROLE_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {isBn ? preset.labelBn : preset.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex flex-wrap items-center gap-2 text-xs">

          {/* Mobile PWA Install Button */}
          <PWAInstallButton lang={lang} />
          
          {/* Cover Letter Button */}
          <button
            type="button"
            onClick={onOpenCoverLetter}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-50 border border-emerald-600/60 rounded-lg flex items-center gap-1.5 font-medium transition shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-200" />
            <span className="hidden sm:inline">{isBn ? 'কভার লেটার' : 'Cover Letter'}</span>
          </button>

          {/* AI Career Assistant Button */}
          <button
            type="button"
            onClick={onOpenAIAssistant}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 rounded-lg flex items-center gap-1.5 font-semibold transition shadow-xs border border-emerald-600/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isBn ? 'AI অ্যাসিস্ট্যান্ট' : 'AI Assistant'}</span>
          </button>

          {/* Online Survey Guide Button */}
          <button
            type="button"
            onClick={onOpenSurveyGuide}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg flex items-center gap-1.5 font-bold transition shadow-xs text-xs border border-amber-300"
          >
            <DollarSign className="w-3.5 h-3.5 text-slate-950" />
            <span>{isBn ? 'অনলাইন সার্ভে আর্ন' : 'Survey Earn Guide'}</span>
          </button>

          {/* 1. Direct PDF File Download */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition shadow-xs border border-emerald-500/50 disabled:opacity-50"
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

          {/* 2. Direct Native Print / Save as PDF Dialog */}
          <button
            type="button"
            onClick={triggerNativePrint}
            className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-[#006a4e] rounded-lg font-bold flex items-center gap-1.5 transition shadow-xs"
            title={isBn ? 'প্রিন্ট অথবা Save as PDF করুন' : 'Print or Save as PDF Dialog'}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isBn ? 'প্রিন্ট / PDF' : 'Print / PDF'}</span>
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={onToggleLang}
            className="px-2.5 py-1.5 bg-emerald-950/60 hover:bg-emerald-950 text-emerald-100 rounded-lg border border-emerald-600/40 flex items-center gap-1 text-[11px] font-semibold transition"
            title="Toggle Bangla / English UI"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isBn ? 'English' : 'বাংলা'}</span>
          </button>

          {/* More options menu */}
          <div className="flex items-center gap-1 bg-emerald-950/40 p-1 rounded-lg border border-emerald-600/30">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={onExportJSON}
              className="p-1.5 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded transition"
              title={isBn ? 'JSON ব্যাকআপ ডাউনলোড' : 'Export JSON Backup'}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 hover:bg-emerald-800 text-emerald-200 hover:text-white rounded transition"
              title={isBn ? 'JSON ব্যাকআপ ইম্পোর্ট' : 'Import JSON Backup'}
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 hover:bg-rose-900/60 text-emerald-200 hover:text-rose-200 rounded transition"
              title={isBn ? 'সব তথ্য রিসেট করুন' : 'Reset All CV Data'}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Sub-Header Toolbar (Format, Template, Colors) */}
      <div className="bg-emerald-950/90 border-t border-emerald-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          
          {/* Format Selector: 1-Page vs 2-Page */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-emerald-200/80 font-bold">
              {isBn ? 'সিভির ধরন:' : 'Format:'}
            </span>
            <div className="flex rounded-md bg-emerald-900/80 p-0.5 border border-emerald-700/60">
              <button
                type="button"
                onClick={() => onUpdateStyling({ format: '1page' })}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  cvData.styling.format === '1page'
                    ? 'bg-white text-[#006a4e] shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                {isBn ? '১ পৃষ্ঠা (Resume)' : '1 Page (Resume)'}
              </button>
              <button
                type="button"
                onClick={() => onUpdateStyling({ format: '2page' })}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${
                  cvData.styling.format === '2page'
                    ? 'bg-white text-[#006a4e] shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                {isBn ? '২ পৃষ্ঠা (Official CV)' : '2 Pages (Detailed BD CV)'}
              </button>
            </div>
          </div>

          {/* Template Style Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-emerald-200/80 font-bold">
              {isBn ? 'টেমপ্লেট:' : 'Template:'}
            </span>
            <select
              value={cvData.styling.template}
              onChange={(e) => onUpdateStyling({ template: e.target.value as any })}
              className="bg-emerald-900 text-white text-xs rounded border border-emerald-600/60 px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
            >
              <option value="classic">Classic Official Bangladeshi (Govt/Bank)</option>
              <option value="modern">Modern Minimalist (Tech/Startups)</option>
              <option value="corporate">Corporate Executive (Two-Column)</option>
              <option value="academic">Academic & Research (Lecturer/Doctor)</option>
            </select>
          </div>

          {/* Accent Color Picker */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-emerald-200/80 font-bold flex items-center gap-1">
              <Palette className="w-3 h-3" />
              {isBn ? 'কালার থিম:' : 'Accent Color:'}
            </span>
            <div className="flex items-center gap-1.5">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => onUpdateStyling({ primaryColor: c.value })}
                  style={{ backgroundColor: c.value }}
                  className={`w-5 h-5 rounded-full border-2 transition transform hover:scale-110 ${
                    cvData.styling.primaryColor === c.value ? 'border-amber-400 ring-2 ring-white/50 scale-110' : 'border-white/40'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
