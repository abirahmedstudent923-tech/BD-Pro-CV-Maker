import React, { useState } from 'react';
import { Sparkles, Check, Wand2 } from 'lucide-react';

interface Props {
  objective: string;
  onChange: (val: string) => void;
  lang: 'en' | 'bn';
  onOpenAIAssistant: () => void;
}

export const ObjectiveForm: React.FC<Props> = ({ objective, onChange, lang, onOpenAIAssistant }) => {
  const isBn = lang === 'bn';
  const [selectedQuickPreset, setSelectedQuickPreset] = useState<string | null>(null);

  const quickObjectives = [
    {
      titleEn: 'Fresh Graduate (Corporate/General)',
      titleBn: 'সদ্য স্নাতক (জেনারেল/কর্পোরেট)',
      text: 'Enthusiastic and self-motivated graduate seeking an entry-level position at a reputable organization in Bangladesh. Eager to contribute academic knowledge, strong communication skills, and an adaptable mindset toward driving team goals and learning industry standards.',
    },
    {
      titleEn: 'Experienced Professional (Growth & Impact)',
      titleBn: 'অভিজ্ঞ প্রফেশনাল (গ্রোথ ও লিডারশিপ)',
      text: 'Results-driven professional with over 3+ years of progressive industry experience in Bangladesh. Proven record of optimizing operational procedures, managing cross-functional stakeholder collaborations, and meeting aggressive organizational milestones.',
    },
    {
      titleEn: 'Banking & Financial Sector',
      titleBn: 'ব্যাংক ও আর্থিক খাত',
      text: 'Diligent and analytically sound banking aspirant with comprehensive understanding of retail operations, regulatory compliance, and risk evaluation. Aiming to deliver exceptional customer service and foster branch portfolio expansion.',
    },
    {
      titleEn: 'IT & Software Engineering',
      titleBn: 'আইটি ও সফটওয়্যার ইঞ্জিনিয়ারিং',
      text: 'Passionate and detail-oriented Software Engineer with a solid background in scalable application design, clean code architecture, and modern agile practices. Dedicated to creating high-performance digital products for local and international markets.',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {isBn ? 'ক্যারিয়ার অবজেক্টিভ / প্রফেশনাল সামারি' : 'Career Objective / Professional Summary'}
        </label>
        
        <button
          type="button"
          onClick={onOpenAIAssistant}
          className="text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5 font-medium transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {isBn ? 'AI দিয়ে অবজেক্টিভ বানান' : 'AI Objective Enhancer'}
        </button>
      </div>

      <textarea
        rows={4}
        value={objective}
        onChange={(e) => onChange(e.target.value)}
        placeholder={isBn ? 'আপনার ক্যারিয়ারের লক্ষ্য ও প্রধান যোগ্যতার সংক্ষিপ্ত বিবরণ লিখুন...' : 'Write 2-4 sentences summarizing your core skills, experience, and value proposition for the employer...'}
        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none text-xs leading-relaxed bg-white"
      />

      {/* Quick Bangladesh Standard Objective Suggestions */}
      <div className="pt-2 border-t border-slate-100">
        <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
          <Wand2 className="w-3 h-3 text-slate-400" />
          {isBn ? 'তাত্ক্ষণিক অবজেক্টিভ টেমপ্লেট (এক ক্লিকে ব্যবহার করুন):' : 'Quick Presets (Click to insert):'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {quickObjectives.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange(item.text);
                setSelectedQuickPreset(item.titleEn);
                setTimeout(() => setSelectedQuickPreset(null), 2000);
              }}
              className="text-left p-2 rounded border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 text-[11px] text-slate-600 transition flex items-start justify-between gap-1 group"
            >
              <span className="font-medium text-slate-800 group-hover:text-emerald-900">
                {isBn ? item.titleBn : item.titleEn}
              </span>
              {selectedQuickPreset === item.titleEn ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <span className="text-[10px] text-slate-400 group-hover:text-emerald-700">ব্যবহার করুন</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
