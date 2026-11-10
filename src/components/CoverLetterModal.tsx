import React, { useState } from 'react';
import { Mail, X, Copy, Check, Printer, Sparkles, Loader2, Download } from 'lucide-react';
import { CVData } from '../types/cv';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  lang: 'en' | 'bn';
}

export const CoverLetterModal: React.FC<Props> = ({ isOpen, onClose, cvData, lang }) => {
  if (!isOpen) return null;

  const isBn = lang === 'bn';
  const [targetCompany, setTargetCompany] = useState('Square Pharmaceuticals PLC');
  const [hiringManager, setHiringManager] = useState('The Head of Human Resources');
  const [letterLanguage, setLetterLanguage] = useState<'en' | 'bn'>('en');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const [letterContent, setLetterContent] = useState<string>(() => {
    return `Date: ${currentDate}

To,
${hiringManager}
${targetCompany}
Dhaka, Bangladesh.

Subject: Application for the position of "${cvData.personal.jobTitle || 'Professional Role'}".

Dear Sir/Madam,

I am writing to express my eager interest in the advertised position of "${cvData.personal.jobTitle || 'Professional'}" at ${targetCompany}. With my solid background and proven competencies in ${cvData.skills.slice(0, 5).join(', ')}, I am confident in my capacity to contribute meaningfully toward your strategic objectives.

Throughout my career, I have continually aimed to drive measurable results, maintain strict regulatory and quality standards, and collaborate transparently within team environments. My academic training from ${cvData.educations[0]?.institution || 'reputable institution'} alongside hands-on practical milestones has equipped me with the resilience and expertise required to thrive in high-standard environments.

Enclosed is my Curriculum Vitae (CV) for your kind perusal. I welcome the opportunity to meet with your interview panel to discuss how my qualifications align with your organizational goals.

Thank you very much for your time and kind consideration.

Sincerely yours,

${cvData.personal.fullName || '[Your Full Name]'}
Contact: ${cvData.personal.phone || '+880 1712-345678'}
Email: ${cvData.personal.email || 'example@gmail.com'}`;
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName: cvData.personal.fullName,
          targetRole: cvData.personal.jobTitle,
          companyName: targetCompany,
          hiringManager,
          experienceSummary: cvData.objective,
          keySkills: cvData.skills.slice(0, 6).join(', '),
          language: letterLanguage,
        }),
      });

      if (!response.ok) throw new Error('Cover letter generation failed');
      const data = await response.json();
      if (data.letter) {
        setLetterContent(data.letter);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(isBn ? 'AI সার্ভার ব্যাস্ত, ডিফল্ট টেমপ্লেট ব্যবহার করা হচ্ছে' : 'AI busy, using standard template');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDoc = () => {
    const element = document.createElement('a');
    const file = new Blob([letterContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${cvData.personal.fullName.replace(/\s+/g, '_') || 'Applicant'}.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    // Print directly using standard browser print with print-only cover letter overlay
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 md:p-5 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {isBn ? 'চাকরির আবেদন পত্র / কভার লেটার জেনারেটর' : 'BD Job Application Cover Letter Builder'}
              </h2>
              <p className="text-[11px] text-slate-300">
                {isBn ? 'স্বনামধন্য প্রতিষ্ঠানের জন্য প্রাতিষ্ঠানিক ফরোয়ার্ডিং লেটার' : 'Formal forwarding letter customized to your CV profile'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'প্রতিষ্ঠানের নাম (Company Name)' : 'Target Company Name'}
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white text-xs"
              placeholder="e.g. Beximco / Eastern Bank PLC"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'বরাবর (Hiring Authority)' : 'Addressed To (Hiring Title)'}
            </label>
            <input
              type="text"
              value={hiringManager}
              onChange={(e) => setHiringManager(e.target.value)}
              className="w-full p-2 border rounded-lg bg-white text-xs"
              placeholder="e.g. The Head of HR / The Managing Director"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'লেটারের ভাষা' : 'Letter Language'}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLetterLanguage('en')}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition ${
                  letterLanguage === 'en' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-700'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLetterLanguage('bn')}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition ${
                  letterLanguage === 'bn' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-slate-700'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          <div className="md:col-span-3 flex flex-wrap items-center justify-between gap-2">
            {errorMessage && (
              <p className="text-[11px] text-amber-600 font-medium">{errorMessage}</p>
            )}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="ml-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {isBn ? 'AI তৈরি করছে...' : 'Generating tailored letter...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  {isBn ? 'AI দিয়ে নতুন কভার লেটার লিখুন' : 'Regenerate with AI'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          <textarea
            rows={14}
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none text-xs leading-relaxed bg-white font-sans text-slate-800"
          />
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-[11px] text-slate-500">
            {isBn ? 'প্রয়োজনে উপরের টেক্সটবক্সে সরাসরি এডিট করতে পারেন' : 'You can directly edit the text above before copying or printing'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5 transition shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> {isBn ? 'কপি হয়েছে!' : 'Copied!'}
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> {isBn ? 'ক্লিপবোর্ডে কপি' : 'Copy Text'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownloadDoc}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg flex items-center gap-1.5 transition shadow-sm"
              title="Download as Word Doc"
            >
              <Download className="w-3.5 h-3.5" /> {isBn ? '.DOC ডাউনলোড' : 'Download .DOC'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> {isBn ? 'প্রিন্ট / PDF' : 'Print / PDF'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
