import React, { useState } from 'react';
import { Sparkles, X, Check, Loader2, Wand2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { CVData } from '../types/cv';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  onApplyObjective: (objective: string) => void;
  lang: 'en' | 'bn';
}

export const AIAssistantModal: React.FC<Props> = ({ isOpen, onClose, cvData, onApplyObjective, lang }) => {
  if (!isOpen) return null;

  const isBn = lang === 'bn';
  const [activeTab, setActiveTab] = useState<'objective' | 'checklist'>('objective');

  // Objective Generator State
  const [targetRole, setTargetRole] = useState(cvData.personal.jobTitle || 'Software Engineer');
  const [industry, setIndustry] = useState('IT & Software');
  const [yearsOfExp, setYearsOfExp] = useState('3+ Years');
  const [genLanguage, setGenLanguage] = useState<'en' | 'bn'>('en');
  const [loading, setLoading] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);

  // Industry options
  const industries = [
    'IT & Software Development',
    'Commercial Banking & Finance',
    'Ready-Made Garments (RMG) & Textile',
    'Pharmaceuticals & Healthcare',
    'Telecommunications & ISP',
    'FMCG Sales & Distribution',
    'Education & University Academia',
    'Civil Engineering & Real Estate',
    'Government & Autonomous Service Aspirant',
  ];

  const handleGenerateObjective = async () => {
    setLoading(true);
    setGeneratedOptions([]);
    setAppliedIndex(null);

    try {
      const response = await fetch('/api/ai/objective', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: targetRole,
          industry,
          yearsOfExp,
          skills: cvData.skills.slice(0, 8).join(', '),
          language: genLanguage,
        }),
      });

      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      if (data.options && Array.isArray(data.options)) {
        setGeneratedOptions(data.options);
      }
    } catch (err) {
      console.error(err);
      // Fallback options
      if (genLanguage === 'bn') {
        setGeneratedOptions([
          `বাংলাদেশের ${industry} খাতে ${yearsOfExp} বাস্তব অভিজ্ঞতাসম্পন্ন নিবেদিতপ্রাণ ${targetRole}। প্রযুক্তিগত উৎকর্ষ ও নিয়মানুবর্তিতার মাধ্যমে প্রতিষ্ঠানের লক্ষ্য অর্জনে দৃঢ় প্রতিজ্ঞ।`,
          `দক্ষ ও দায়িত্বশীল পেশাজীবী, যিনি ইতিপূর্বে দলগত সমন্বয় ও সমস্যা সমাধানের মাধ্যমে উল্লেখযোগ্য সাফল্য অর্জন করেছেন। প্রতিষ্ঠানের দীর্ঘমেয়াদী উন্নতিতে অবদান রাখতে আগ্রহী।`,
        ]);
      } else {
        setGeneratedOptions([
          `Dynamic and results-driven ${targetRole} with ${yearsOfExp} of proven track record in the Bangladeshi ${industry} sector. Adept in cross-functional coordination, problem-solving, and driving operational efficiency.`,
          `Innovative and meticulous professional seeking to leverage expertise in ${targetRole} workflows to exceed performance benchmarks at a forward-thinking organization.`,
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Checklist Calculations
  const checks = [
    {
      title: isBn ? 'পূর্ণ নাম ও সঠিক পদবী' : 'Full Name & Professional Designation',
      passed: Boolean(cvData.personal.fullName && cvData.personal.jobTitle),
      tip: isBn ? 'সিভির শীর্ষে আপনার নাম ও কাঙ্ক্ষিত পদের নাম দিন' : 'Specify exact role like "Senior Officer (Credit)" or "React Developer"',
    },
    {
      title: isBn ? 'মোবাইল ও ইমেইল ঠিকানা' : 'Valid Phone & Professional Email',
      passed: Boolean(cvData.personal.phone && cvData.personal.email),
      tip: isBn ? 'বাংলাদেশের প্রচলিত +৮৮০ মোবাইল নম্বর দিন' : 'Use a professional email (name.surname@gmail.com) without nicknames',
    },
    {
      title: isBn ? 'ক্যারিয়ার অবজেক্টিভ (Career Objective)' : 'Tailored Career Objective',
      passed: Boolean(cvData.objective && cvData.objective.length > 30),
      tip: isBn ? 'অবজেক্টিভটি ২-৩ লাইনে সীমাবদ্ধ রাখুন' : 'Keep it 2-3 concise sentences stating specific value for the employer',
    },
    {
      title: isBn ? 'শিক্ষাগত যোগ্যতা (কমপক্ষে ১-২টি রেকর্ড)' : 'Academic Credentials with Results',
      passed: cvData.educations.length >= 1,
      tip: isBn ? 'বোর্ড, পাসের বছর ও সিজিপিএ/জিপিএ সঠিকভাবে উল্লেখ করুন' : 'Ensure Degree, Institution, Passing Year, and GPA are listed',
    },
    {
      title: isBn ? 'জাতীয় পরিচয়পত্র (NID) নম্বর' : 'National ID (NID No.) Provided',
      passed: Boolean(cvData.personal.nid && cvData.personal.nid.length >= 8),
      tip: isBn ? 'বাংলাদেশি অফিসিয়াল ও ব্যাংক সিভিতে এনআইডি নম্বর জরুরি' : 'Very important for BD background checks and HR verification',
    },
    {
      title: isBn ? 'স্থায়ী ও বর্তমান ঠিকানা' : 'Permanent & Present Addresses',
      passed: Boolean(cvData.personal.presentAddress && cvData.personal.permanentAddress),
      tip: isBn ? 'স্থায়ী ঠিকানায় গ্রাম, ডাকঘর, থানা ও জেলা উল্লেখ করুন' : 'Village, Post, Thana & District should be clearly written',
    },
    {
      title: isBn ? 'কমপক্ষে ১-২ জন রেফারেন্স (References)' : 'At Least 1-2 Verified Referees',
      passed: cvData.references.length >= 1 && Boolean(cvData.references[0]?.phone),
      tip: isBn ? 'রেফারেন্সের নাম, পদবী, প্রতিষ্ঠান ও ফোন নম্বর দিন' : 'Include supervisor/teacher name, designation, organization and mobile',
    },
    {
      title: isBn ? 'স্বঘোষণা ও তারিখ (Declaration)' : 'Formal Declaration & Signature',
      passed: Boolean(cvData.declaration.text && cvData.declaration.signatureName),
      tip: isBn ? 'সিভির শেষ পৃষ্ঠায় ঘোষণাপত্র সত্যতার প্রমাণ বহন করে' : 'Signifies truthfulness of submitted qualifications',
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const scorePercent = Math.round((passedCount / checks.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {isBn ? 'BD স্মার্ট ক্যারিয়ার অ্যাসিস্ট্যান্ট' : 'BD Smart Career Assistant'}
              </h2>
              <p className="text-[11px] text-emerald-200">
                {isBn ? 'AI দিয়ে অবজেক্টিভ জেনারেট করুন ও সিভি চেক করুন' : 'AI Career Optimization for Bangladeshi Job Market'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-800 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('objective')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'objective'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            {isBn ? 'AI অবজেক্টিভ জেনারেটর' : 'AI Objective Generator'}
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'checklist'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isBn ? 'বাংলাদেশি সিভি কোয়ালিটি অডিট' : 'BD CV Quality Audit'} ({scorePercent}%)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 text-xs">
          {activeTab === 'objective' ? (
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {isBn
                  ? 'আপনার পদবী ও ইন্ডাস্ট্রি নির্বাচন করে জেনারেট বাটনে চাপ দিন। AI স্বয়ংক্রিয়ভাবে ৩টি আকর্ষণীয় অবজেক্টিভ তৈরি করবে।'
                  : 'Specify your target role and sector. Gemini AI will create 3 professionally crafted executive summaries customized for Bangladeshi employers.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isBn ? 'টার্গেট পদবী (Target Role)' : 'Target Role'}
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white text-xs"
                    placeholder="e.g. Officer (General Banking)"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isBn ? 'ইন্ডাস্ট্রি / খাত' : 'Industry Sector'}
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white text-xs"
                  >
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isBn ? 'অভিজ্ঞতার পর্যায়' : 'Experience Level'}
                  </label>
                  <select
                    value={yearsOfExp}
                    onChange={(e) => setYearsOfExp(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white text-xs"
                  >
                    <option value="Fresh Graduate / Entry-Level">Fresh Graduate (সদ্য স্নাতক)</option>
                    <option value="1-2 Years (Junior)">1-2 Years Experience (জুনিয়র)</option>
                    <option value="3-5 Years (Mid-Level)">3-5 Years Experience (মিড-লেভেল)</option>
                    <option value="6+ Years (Senior / Lead)">6+ Years Experience (সিনিয়র / লিড)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isBn ? 'ভাষার ধরণ' : 'Output Language'}
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGenLanguage('en')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition ${
                        genLanguage === 'en'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenLanguage('bn')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition ${
                        genLanguage === 'bn'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      বাংলা (Bangla)
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateObjective}
                disabled={loading}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isBn ? 'AI তৈরি করছে...' : 'Generating with Gemini AI...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    {isBn ? 'অবজেক্টিভ তৈরি করুন' : 'Generate 3 AI Objectives'}
                  </>
                )}
              </button>

              {/* Results display */}
              {generatedOptions.length > 0 && (
                <div className="space-y-3 mt-4 pt-3 border-t border-slate-200">
                  <p className="font-bold text-slate-800">
                    {isBn ? 'তৈরিকৃত অবজেক্টিভ অপশনসমূহ:' : 'Generated Options (Click "Apply" to insert):'}
                  </p>
                  {generatedOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-emerald-500 transition"
                    >
                      <p className="text-slate-700 leading-relaxed text-xs">{opt}</p>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            onApplyObjective(opt);
                            setAppliedIndex(idx);
                          }}
                          className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition ${
                            appliedIndex === idx
                              ? 'bg-emerald-700 text-white'
                              : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
                          }`}
                        >
                          {appliedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> {isBn ? 'যুক্ত হয়েছে!' : 'Applied!'}
                            </>
                          ) : (
                            <>
                              <FileText className="w-3.5 h-3.5" /> {isBn ? 'সিভিতে যুক্ত করুন' : 'Apply to My CV'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    {isBn ? 'বাংলাদেশি সিভি প্রস্তুতি স্কোর:' : 'Bangladeshi CV Readiness Score:'}
                  </h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {passedCount} / {checks.length} {isBn ? 'টি মানদণ্ড সম্পন্ন হয়েছে' : 'criteria passed'}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-2xl font-extrabold ${
                      scorePercent >= 80 ? 'text-emerald-700' : scorePercent >= 50 ? 'text-amber-600' : 'text-rose-600'
                    }`}
                  >
                    {scorePercent}%
                  </span>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">
                    {scorePercent >= 80 ? 'Ready for Job' : 'Needs Details'}
                  </p>
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-2">
                {checks.map((chk, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-xs flex items-start gap-3 ${
                      chk.passed
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-amber-50/50 border-amber-200'
                    }`}
                  >
                    {chk.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`font-bold ${chk.passed ? 'text-emerald-950' : 'text-amber-950'}`}>
                        {chk.title}
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{chk.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition"
          >
            {isBn ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
