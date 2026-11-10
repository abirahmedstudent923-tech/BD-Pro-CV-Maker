import React, { useState } from 'react';
import {
  DollarSign,
  X,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Calculator,
  ArrowRight,
  TrendingUp,
  Layers,
  Award,
  Wallet,
  Smartphone,
  Check,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
}

export const SurveyGuideModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const isBn = lang === 'bn';
  const [activeTab, setActiveTab] = useState<'steps' | 'sites' | 'tricks' | 'calculator'>('steps');

  // Interactive Step Checklist Progress
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('survey_guide_steps_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleStep = (stepNum: number) => {
    setCheckedSteps((prev) => {
      const next = { ...prev, [stepNum]: !prev[stepNum] };
      try {
        localStorage.setItem('survey_guide_steps_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Calculator State
  const [dailyHours, setDailyHours] = useState<number>(2);
  const [activeSites, setActiveSites] = useState<number>(3);

  // Approximate estimation: 1-2 hours across 3 sites = ~$1.5 - $3 per day -> ~$45 - $90/month (৳5,000 - ৳11,000)
  const estimatedDailyUsd = Math.round((dailyHours * 0.9 + activeSites * 0.4) * 10) / 10;
  const estimatedMonthlyUsd = Math.round(estimatedDailyUsd * 26);
  const estimatedBdt = Math.round(estimatedMonthlyUsd * 122); // ~122 BDT per USD

  // Trusted Platforms List
  const platforms = [
    {
      name: 'ySense',
      rating: '৪.৯ / ৫.০',
      bdSupport: 'বাংলাদেশ থেকে ১০০% কাজ করে',
      paymentMethods: 'Airtm, Payoneer, Skrill, Reward Link',
      minPayout: '$5.00 বা $10.00',
      description: 'সার্ভে জগতের সবচেয়ে জনপ্রিয় ও নির্ভরযোগ্য প্ল্যাটফর্ম। প্রতিদিন একাধিক সার্ভে আসে এবং Airtm দিয়ে সরাসরি বিকাশে টাকা নেওয়া যায়।',
      bestFor: 'নিয়মিত সার্ভে ও বিভিন্ন টাস্ক',
      badge: 'টপ রিকমেন্ডেড',
    },
    {
      name: 'Toluna Influencers Bangladesh',
      rating: '৪.৭ / ৫.০',
      bdSupport: 'বাংলা ও ইংরেজি ভাষায় সার্ভে',
      paymentMethods: 'PayPal, Gift Cards, Direct Vouchers',
      minPayout: '$10.00 সমমূল্য পয়েন্ট',
      description: 'বিশেষভাবে বাংলাদেশিদের জন্য তৈরি লোকাল অপিনিয়ন প্যানেল। এখানে দেশের পণ্য ও ব্র্যান্ড সম্পর্কিত মতামত দিয়ে পয়েন্ট আয় করা যায়।',
      bestFor: 'সহজ বাংলা প্রশ্ন ও লোকাল ব্র্যান্ড সার্ভে',
      badge: 'বাংলা ভাষা সাপোর্ট',
    },
    {
      name: 'Timebucks',
      rating: '৪.৬ / ৫.০',
      bdSupport: 'বাংলাদেশি প্রচুর ইউজার সক্রিয়',
      paymentMethods: 'Airtm, Litecoin, Payeer, Skrill',
      minPayout: '$5.00 (প্রতি বৃহস্পতিবার অটো-পেমেন্ট)',
      description: 'সার্ভের পাশাপাশি ক্লিক, ভিডিও ওয়াচ ও ছোট ছোট মাইক্রো-টাস্ক করে প্রতিদিন পয়েন্ট আয় করা যায়। বিকাশ সাপোর্টেড ওয়ালেটে ক্যাশআউট সহজ।',
      bestFor: 'সার্ভে না পেলেও অন্যান্য টাস্ক দিয়ে আয়',
      badge: 'সহজ পেমেন্ট',
    },
    {
      name: 'YouGov Asia / MENA',
      rating: '৪.৮ / ৫.০',
      bdSupport: 'আন্তর্জাতিক সোশ্যাল ও মার্কেট রিসার্চ',
      paymentMethods: 'Bank Transfer / Gift Cards',
      minPayout: '৫,০০০ পয়েন্ট ($50 সমমূল্য)',
      description: 'খুবই মানসম্পন্ন ব্রিটিশ রিসার্চ কোম্পানি। কোনো সার্ভে থেকে ডিসকোয়ালিফাই করে না, পয়েন্ট সম্পূর্ণ দেয়।',
      bestFor: '১০০% ডিসকোয়ালিফিকেশন-মুক্ত সার্ভে',
      badge: 'উচ্চ সম্মানজনক',
    },
    {
      name: 'Surveoo Bangladesh',
      rating: '৪.৫ / ৫.০',
      bdSupport: 'বাংলাদেশি টাকায় হিসেব দেখায়',
      paymentMethods: 'Bank Transfer, PayPal, Gift Cards',
      minPayout: '৳২,৪০০ সমমূল্য',
      description: 'নতুন ও সহজে ব্যবহারযোগ্য ইন্টারফেস। প্রতিটি সার্ভের জন্য ৫০ টাকা থেকে ২০০ টাকা পর্যন্ত রিওয়ার্ড অফার করে।',
      bestFor: 'নতুন ইউজারদের জন্য সহজ',
      badge: 'নতুন ও দ্রুত',
    },
    {
      name: 'PrizeRebel',
      rating: '৪.৬ / ৫.০',
      bdSupport: 'সার্ভে ও অফারওয়াল সক্রিয়',
      paymentMethods: 'Airtm, Crypto, Gift Cards',
      minPayout: '$5.00',
      description: 'বিশ্বস্ত ও পুরোনো সার্ভে প্ল্যাটফর্ম। নিয়মিত সক্রিয় থাকলে লেভেল আপ হয় এবং আরও বেশি দামের সার্ভে পাওয়া যায়।',
      bestFor: 'অফারওয়াল ও ডেইলি চ্যালেঞ্জ',
      badge: 'লেভেল আপ রিওয়ার্ড',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-3 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-4 md:p-5 bg-gradient-to-r from-emerald-800 to-slate-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg shadow-md shrink-0">
              ৳
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold tracking-tight">
                  {isBn ? 'অনলাইন সার্ভে আর্নিং মাস্টার গাইড' : 'Online Survey Earning Master Guide'}
                </h2>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded font-semibold uppercase">
                  বাংলাদেশ স্পেশাল
                </span>
              </div>
              <p className="text-xs text-emerald-200/90">
                {isBn
                  ? 'বাস্তবসম্মত স্টেপ বাই স্টেপ নিয়ম, বিশ্বস্ত সাইট ও বিকাশে টাকা আনার কৌশল'
                  : 'Legit platforms, profile tricks, and bKash withdrawal for Bangladesh'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('steps')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'steps'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {isBn ? '১. স্টেপ-বাই-স্টেপ শুরু করুন' : '1. Step-by-Step Blueprint'}
          </button>

          <button
            onClick={() => setActiveTab('sites')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'sites'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            {isBn ? '২. সেরা বিশ্বস্ত সাইটসমূহ' : '2. Verified Legit Sites'}
          </button>

          <button
            onClick={() => setActiveTab('tricks')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'tricks'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {isBn ? '৩. গোপন ট্রিকস ও সতর্কতা' : '3. Qualification Tricks & Scams'}
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === 'calculator'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            {isBn ? '৪. সম্ভাব্য আয়ের ক্যালকুলেটর' : '4. Earnings Calculator'}
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 text-xs space-y-6">
          
          {/* TAB 1: STEP BY STEP BLUEPRINT */}
          {activeTab === 'steps' && (
            <div className="space-y-5">
              
              {/* Reality Check Banner */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-xs">
                    {isBn ? 'বাস্তব সত্য (Reality Check):' : 'Realistic Expectations:'}
                  </p>
                  <p className="text-[11px] leading-relaxed text-amber-900">
                    {isBn
                      ? 'অনলাইন সার্ভে করে কেউ লাখপতি হতে পারে না। তবে প্রতিদিন ১-২ ঘণ্টা সময় দিলে মাসে ৪,০০০ থেকে ১২,০০০ টাকা পকেট মানি বা ইন্টারনেটের খরচ উপার্জন করা সম্ভব। যারা বলে "প্রতিদিন ৫০০০ টাকা ইনকাম করুন"—তারা ১০০% ভুয়া প্রতারক!'
                      : 'Paid surveys will not replace a full-time career, but can generate $40-$100 (৳4,500 - ৳12,000) per month in student pocket money with zero upfront cost.'}
                  </p>
                </div>
              </div>

              {/* Progress Tracker Bar */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-emerald-950">
                    {isBn ? 'আপনার অগ্রগতি ট্র্যাকার:' : 'Your Setup Progress:'}
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    {Object.values(checkedSteps).filter(Boolean).length} / 5 {isBn ? 'টি ধাপ সম্পন্ন হয়েছে' : 'steps completed'}
                  </p>
                </div>
                <div className="w-32 bg-emerald-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full transition-all duration-300"
                    style={{
                      width: `${(Object.values(checkedSteps).filter(Boolean).length / 5) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* 5 Sequential Steps */}
              <div className="space-y-3.5">
                
                {/* Step 1 */}
                <div
                  onClick={() => toggleStep(1)}
                  className={`cursor-pointer flex items-start gap-3.5 p-3.5 rounded-xl border transition ${
                    checkedSteps[1]
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center shrink-0 text-xs shadow-xs transition ${
                      checkedSteps[1] ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {checkedSteps[1] ? <Check className="w-4 h-4" /> : '১'}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-bold text-xs md:text-sm ${checkedSteps[1] ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                        একটি ডেডিকেটেড জিমেইল (Gmail) অ্যাকাউন্ট তৈরি করুন
                      </h3>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {checkedSteps[1] ? '✓ সম্পন্ন' : 'ক্লিক করে চেক দিন'}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      আপনার ব্যক্তিগত মেইল ব্যবহার না করে সার্ভে কাজের জন্য আলাদা একটি ফ্রেশ জিমেইল (যেমন: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">yourname.work@gmail.com</code>) তৈরি করুন। কারণ সার্ভে সাইটগুলো থেকে দিনে একাধিক ইনভাইটেশন ও নোটিফিকেশন আসবে।
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  onClick={() => toggleStep(2)}
                  className={`cursor-pointer flex items-start gap-3.5 p-3.5 rounded-xl border transition ${
                    checkedSteps[2]
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center shrink-0 text-xs shadow-xs transition ${
                      checkedSteps[2] ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {checkedSteps[2] ? <Check className="w-4 h-4" /> : '২'}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-bold text-xs md:text-sm ${checkedSteps[2] ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                        একসাথে ৩-৪টি বিশ্বস্ত সার্ভে প্ল্যাটফর্মে ফ্রি একাউন্ট খুলুন
                      </h3>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {checkedSteps[2] ? '✓ সম্পন্ন' : 'ক্লিক করে চেক দিন'}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      একটি সাইটের ওপর নির্ভর করলে কাজ কম পাওয়া যায়। তাই শীর্ষ সাইটগুলো—যেমন <strong>ySense, Toluna Bangladesh, Timebucks এবং YouGov</strong>-এ সম্পূর্ণ ফ্রিতে অ্যাকাউন্ট খুলুন। (কোনো সাইটে ১ টাকাও দেওয়ার প্রয়োজন নেই)।
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div
                  onClick={() => toggleStep(3)}
                  className={`cursor-pointer flex items-start gap-3.5 p-3.5 rounded-xl border transition ${
                    checkedSteps[3]
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center shrink-0 text-xs shadow-xs transition ${
                      checkedSteps[3] ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {checkedSteps[3] ? <Check className="w-4 h-4" /> : '৩'}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-bold text-xs md:text-sm ${checkedSteps[3] ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                        প্রোফাইল ১০০% সম্পন্ন করুন (Profile Optimization)
                      </h3>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {checkedSteps[3] ? '✓ সম্পন্ন' : 'ক্লিক করে চেক দিন'}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      লগইন করার পরই "Profile Surveys" বা ডেমোগ্রাফিক প্রশ্ন পূরণ করুন। কোম্পানিগুলো নির্দিষ্ট বয়স, শিক্ষাগত যোগ্যতা ও পেশার মানুষদের সার্ভে পাঠায়। প্রোফাইল অপূর্ণ থাকলে আপনি কোনো ইনভাইট পাবেন না।
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div
                  onClick={() => toggleStep(4)}
                  className={`cursor-pointer flex items-start gap-3.5 p-3.5 rounded-xl border transition ${
                    checkedSteps[4]
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center shrink-0 text-xs shadow-xs transition ${
                      checkedSteps[4] ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {checkedSteps[4] ? <Check className="w-4 h-4" /> : '৪'}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-bold text-xs md:text-sm ${checkedSteps[4] ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                        ধৈর্য্যের সাথে সার্ভে প্রশ্নগুলোর উত্তর দিন (Qualifying Strategy)
                      </h3>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {checkedSteps[4] ? '✓ সম্পন্ন' : 'ক্লিক করে চেক দিন'}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      সার্ভে শুরু হলে তাড়াহুড়া করবেন না। মাঝে মাঝে রোবট ফিল্টার করার জন্য ট্রিকি প্রশ্ন থাকে (যেমন: "Please select blue to confirm you are reading")। মনোযোগ দিয়ে উত্তর দিন যাতে সার্ভে মাঝপথে বাতিল বা ডিসকোয়ালিফাই না হয়।
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div
                  onClick={() => toggleStep(5)}
                  className={`cursor-pointer flex items-start gap-3.5 p-3.5 rounded-xl border transition ${
                    checkedSteps[5]
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full font-bold flex items-center justify-center shrink-0 text-xs shadow-xs transition ${
                      checkedSteps[5] ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {checkedSteps[5] ? <Check className="w-4 h-4" /> : '৫'}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className={`font-bold text-xs md:text-sm ${checkedSteps[5] ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                        উপার্জিত ডলার Airtm বা Binance দিয়ে বিকাশে ক্যাশআউট করুন
                      </h3>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {checkedSteps[5] ? '✓ সম্পন্ন' : 'ক্লিক করে চেক দিন'}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      ন্যূনতম ৫ ডলার বা ১০ ডলার জমা হলেই <strong>Airtm</strong> বা <strong>Payoneer</strong> দিয়ে ক্যাশআউট রিকোয়েস্ট দিন। Airtm থেকে ৫ মিনিটে পি-টু-পি (P2P) এর মাধ্যমে সরাসরি বিকাশ বা নগদে টাকা চলে আসে।
                    </p>
                  </div>
                </div>

              </div>

              {/* Bottom Quick Action */}
              <div className="p-4 bg-emerald-950 text-white rounded-xl flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-xs">কোন কোন সাইটে আগে অ্যাকাউন্ট খুলবেন?</p>
                  <p className="text-[11px] text-emerald-200">বাংলাদেশিদের জন্য ভেরিফাইড প্ল্যাটফর্মের তালিকা দেখতে নিচের ট্যাবে যান।</p>
                </div>
                <button
                  onClick={() => setActiveTab('sites')}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition"
                >
                  <span>সাইটগুলোর তালিকা দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: VERIFIED LEGIT SITES */}
          {activeTab === 'sites' && (
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {isBn
                  ? 'নিচের প্রতিটি সাইট আন্তর্জাতিকভাবে স্বীকৃত এবং বাংলাদেশ থেকে বৈধভাবে কাজ করা ও টাকা উত্তোলন করা যায়। কোনো সাইটেই কোনো প্রকার ডিপোজিট বা ফি দিতে হয় না।'
                  : 'All verified platforms that accept registrations from Bangladesh with tested cashout channels.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {platforms.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-500 hover:shadow-sm transition space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            {p.name}
                          </h4>
                          <span className="text-[10px] text-slate-500">রেটিং: {p.rating}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {p.badge}
                        </span>
                      </div>

                      <p className="text-slate-600 text-[11px] leading-relaxed mt-1">{p.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-[11px] space-y-1">
                      <p className="text-slate-700">
                        <strong className="text-slate-900">পেমেন্ট মেথড:</strong> {p.paymentMethods}
                      </p>
                      <p className="text-slate-700">
                        <strong className="text-slate-900">মিনিমাম ক্যাশআউট:</strong> {p.minPayout}
                      </p>
                      <p className="text-emerald-800 font-medium text-[10px]">
                        ✓ {p.bestFor}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cashout Flow Box */}
              <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 text-slate-800 space-y-2">
                <h4 className="font-bold text-xs flex items-center gap-1.5 text-slate-900">
                  <Wallet className="w-4 h-4 text-emerald-700" />
                  বাংলাদেশে টাকা আনার সহজ উপায় (Payment Route):
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="px-2.5 py-1 bg-white border rounded text-slate-800 shadow-xs">১. সার্ভে সাইট ডলার</span>
                  <span className="text-slate-400">➔</span>
                  <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-900 rounded shadow-xs">২. Airtm / Payoneer</span>
                  <span className="text-slate-400">➔</span>
                  <span className="px-2.5 py-1 bg-pink-50 border border-pink-200 text-pink-700 rounded shadow-xs">৩. বিকাশ / নগদ (bKash/Nagad)</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Airtm-এ কোনো ব্যাংক অ্যাকাউন্ট ছাড়াই সরাসরি বিকাশ ওয়ালেটে পি-টু-পি এক্সচেঞ্জ করা যায়।
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: TRICKS & SCAM PRECAUTIONS */}
          {activeTab === 'tricks' && (
            <div className="space-y-5">
              
              {/* Profile Qualification Rules */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-3">
                <h3 className="font-bold text-xs md:text-sm text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  সার্ভে কোয়ালিফাই করার শীর্ষ গোপন ট্রিকস (Profile Secrets):
                </h3>
                
                <ul className="space-y-2 text-[11px] text-slate-700 leading-relaxed pl-1">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <div>
                      <strong>বয়স ২৫ থেকে ৩৫ বছরের মধ্যে দিন:</strong> রিসার্চ কোম্পানিগুলো এমন মানুষদের চায় যারা নিজের টাকায় সিদ্ধান্ত নেয়। ১৮-এর নিচে বয়স দিলে কাজ পাওয়া যায় না।
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <div>
                      <strong>পরিবারের প্রধান সিদ্ধান্তকারী (Decision Maker):</strong> যখন জিজ্ঞাসা করবে আপনি ঘরের শপিং, গ্যাজেট বা মুদি বাজার কেনার সিদ্ধান্ত নেন কিনা—সবসময় বলুন <em>"Yes, I am the primary decision maker"</em>।
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <div>
                      <strong>চাকরির ধরন:</strong> পেশায় "Full-time Employee" সিলেক্ট করুন (IT, Telecom, Banking, Retail ইত্যাদি)।
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <div>
                      <strong>কখনই বলবেন না আপনি Market Research এ কাজ করেন:</strong> যদি প্রশ্ন আসে "আপনার পরিবারের কেউ কি Marketing, Market Research বা Media এজেন্সিতে কাজ করে?"—অবশ্যই <em>"None of the above"</em> দিবেন। অন্যথায় সাথে সাথে সার্ভে বাতিল হবে।
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <div>
                      <strong>সব সাইটে একই তথ্য বজায় রাখুন:</strong> এক সাইটে বয়স ২৫ দিয়ে অন্যটিতে ৩৫ দিলে ডিভাইসের হিস্টোরি ট্র্যাক করে বাতিল করা হতে পারে।
                    </div>
                  </li>
                </ul>
              </div>

              {/* Scam Warnings */}
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
                <h3 className="font-bold text-xs md:text-sm text-rose-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  যেসব প্রতারণা ও ভুল থেকে ১০০% সতর্ক থাকবেন:
                </h3>

                <ul className="space-y-2 text-[11px] text-slate-700 leading-relaxed pl-1">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold shrink-0">✕</span>
                    <div>
                      <strong>কখনই ১ টাকাও কাউকে ফি বা ডিপোজিট দেবেন না:</strong> কোনো ফেসবুক পেজ বা টেলিগ্রাম গ্রুপ যদি বলে "১০০০ টাকা দিয়ে সার্ভে আইডি কিনুন বা কোর্স কিনুন"—তারা ৯৯% বাটপারি। আসল সার্ভে সাইটগুলো ১০০% ফ্রি।
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold shrink-0">✕</span>
                    <div>
                      <strong>সস্তা ফ্রি ভিপিএন (VPN) ব্যবহার নিষিদ্ধ:</strong> আমেরিকান সার্ভে করার লোভে অনেকে ফ্রি ভিপিএন ব্যবহার করে। সার্ভে সাইটগুলোর ফ্রড ডিটেকশন অত্যন্ত কঠোর। ধরা পড়লে জমানো টাকাসহ আইডি চিরতরে ব্যান হয়ে যাবে।
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold shrink-0">✕</span>
                    <div>
                      <strong>ফেক আইডি ও স্পিড-ক্লিকের অভ্যাস বাদ দিন:</strong> ৫ মিনিটের সার্ভে ৩০ সেকেন্ডে ক্লিক করে শেষ করলে অ্যাকাউন্ট সাসপেন্ড হবে।
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          )}

          {/* TAB 4: CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-5">
              <p className="text-slate-600 leading-relaxed text-[11px]">
                {isBn
                  ? 'আপনার দৈনিক সময় ও সক্রিয় সাইটের সংখ্যা অনুযায়ী সম্ভাব্য মাসিক আয়ের হিসাব দেখুন:'
                  : 'Estimate your monthly earnings based on time spent and active survey platforms:'}
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                
                {/* Hours Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-slate-700">দৈনিক কত সময় কাজ করবেন?</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {dailyHours} ঘণ্টা / দিন
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                    className="w-full accent-emerald-700"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>১ ঘণ্টা (পার্ট-টাইম)</span>
                    <span>৩ ঘণ্টা</span>
                    <span>৫ ঘণ্টা (ম্যাক্সিমাম)</span>
                  </div>
                </div>

                {/* Sites Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-slate-700">কয়টি সাইটে একাউন্ট থাকবে?</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {activeSites} টি প্ল্যাটফর্ম
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={activeSites}
                    onChange={(e) => setActiveSites(parseInt(e.target.value))}
                    className="w-full accent-emerald-700"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>১টি সাইট</span>
                    <span>৩টি (সুপারিশকৃত)</span>
                    <span>৬টি সাইট</span>
                  </div>
                </div>

              </div>

              {/* Output Result Card */}
              <div className="p-5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white/10 rounded-xl border border-white/15">
                  <p className="text-[11px] text-emerald-200 uppercase font-semibold">দৈনিক সম্ভাব্য আয়</p>
                  <p className="text-xl font-extrabold text-amber-300 mt-1">${estimatedDailyUsd}</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">প্রায় ৳{Math.round(estimatedDailyUsd * 122)} টাকা</p>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/15">
                  <p className="text-[11px] text-emerald-200 uppercase font-semibold">মাসিক সম্ভাব্য আয় (ডলারে)</p>
                  <p className="text-xl font-extrabold text-emerald-300 mt-1">${estimatedMonthlyUsd}</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">২৬ কর্মদিবসের হিসেবে</p>
                </div>

                <div className="p-3 bg-emerald-600/40 rounded-xl border border-emerald-400/30">
                  <p className="text-[11px] text-amber-200 uppercase font-bold">বাংলাদেশি টাকায় (বিকাশ/নগদ)</p>
                  <p className="text-2xl font-black text-amber-300 mt-0.5">৳ {estimatedBdt.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-100 mt-0.5">পকেট মানি ও পড়াশোনার খরচ</p>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed text-center">
                * মনে রাখবেন: সার্ভের সংখ্যা ও মূল্য প্রতিদিন একই রকম থাকে না। উৎসব ও বছরের শুরুতে সার্ভে বেশি আসে। নিয়মিত কাজ করলে রেটিং বাড়ে ও বেশি মূল্যের কাজ আসে।
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            সতর্কতা: কোনো সার্ভে সাইটে কোনো রেজিস্ট্রেশন ফি দেবেন না।
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition ml-auto"
          >
            {isBn ? 'বুঝেছি, ধন্যবাদ' : 'Understood, Thanks'}
          </button>
        </div>

      </div>
    </div>
  );
};
