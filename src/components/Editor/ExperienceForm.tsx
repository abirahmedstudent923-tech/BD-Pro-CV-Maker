import React, { useState } from 'react';
import { WorkExperience } from '../../types/cv';
import { Plus, Trash2, Briefcase, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  experiences: WorkExperience[];
  onChange: (items: WorkExperience[]) => void;
  lang: 'en' | 'bn';
}

export const ExperienceForm: React.FC<Props> = ({ experiences, onChange, lang }) => {
  const isBn = lang === 'bn';
  const [polishingIndex, setPolishingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const newItem: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: '',
      designation: '',
      employmentType: 'Full-time',
      duration: '',
      location: 'Dhaka, Bangladesh',
      details: '',
    };
    onChange([...experiences, newItem]);
  };

  const handleRemove = (index: number) => {
    const updated = experiences.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleChange = (index: number, field: keyof WorkExperience, value: string) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const [polishMessage, setPolishMessage] = useState<{ index: number; text: string; isError?: boolean } | null>(null);

  const handleAIBulletPolish = async (index: number) => {
    const exp = experiences[index];
    setPolishMessage(null);
    if (!exp.details.trim()) {
      setPolishMessage({
        index,
        text: isBn ? 'প্রথমে কিছু কাজের দায়িত্ব বা বিবরণ লিখুন' : 'Please enter responsibilities first',
        isError: true,
      });
      return;
    }

    setPolishingIndex(index);
    try {
      const response = await fetch('/api/ai/bullet-polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textToPolish: exp.details,
          role: exp.designation,
          company: exp.company,
        }),
      });

      if (!response.ok) throw new Error('Failed to polish');
      const data = await response.json();
      if (data.polished) {
        handleChange(index, 'details', data.polished);
        setPolishMessage({
          index,
          text: isBn ? 'AI বুলেট সফলভাবে পলিশ হয়েছে!' : 'Bullet points successfully polished!',
        });
      }
    } catch (err) {
      console.error(err);
      setPolishMessage({
        index,
        text: isBn ? 'AI সার্ভার ব্যাস্ত, ডিফল্ট বুলেট ব্যবহার করুন' : 'AI busy, try again shortly',
        isError: true,
      });
    } finally {
      setPolishingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      {experiences.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">
            {isBn ? 'এখনো কোনো কাজের অভিজ্ঞতা যোগ করা হয়নি' : 'No work experience added yet'}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-3 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200 hover:bg-emerald-100 transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> {isBn ? 'অভিজ্ঞতা যোগ করুন' : 'Add First Experience'}
          </button>
        </div>
      ) : (
        experiences.map((exp, index) => (
          <div key={exp.id} className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-lg space-y-3 relative text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
                {isBn ? `অভিজ্ঞতা #${index + 1}` : `Experience #${index + 1}`}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-rose-500 hover:text-rose-700 transition p-1 hover:bg-rose-50 rounded"
                title="Remove Experience"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  {isBn ? 'প্রতিষ্ঠানের নাম (Company) *' : 'Company Name *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brain Station 23 / Square Pharma"
                  value={exp.company}
                  onChange={(e) => handleChange(index, 'company', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  {isBn ? 'পদবী (Designation) *' : 'Designation *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  value={exp.designation}
                  onChange={(e) => handleChange(index, 'designation', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  {isBn ? 'সময়কাল (Duration) *' : 'Duration *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jan 2022 - Present"
                  value={exp.duration}
                  onChange={(e) => handleChange(index, 'duration', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  {isBn ? 'কর্মস্থল (Location)' : 'Location'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mohakhali DOHS, Dhaka"
                  value={exp.location}
                  onChange={(e) => handleChange(index, 'location', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium text-slate-600">
                  {isBn ? 'দায়িত্ব ও অর্জন (Responsibilities & Key Achievements)' : 'Responsibilities & Key Achievements'}
                </label>
                <button
                  type="button"
                  onClick={() => handleAIBulletPolish(index)}
                  disabled={polishingIndex === index}
                  className="text-[11px] text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 font-medium border border-emerald-300/60 transition disabled:opacity-50"
                >
                  {polishingIndex === index ? (
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-700" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-amber-600" />
                  )}
                  {isBn ? 'AI বুলেট পলিশ' : 'AI Polish Bullets'}
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="• Led core development of payment system...&#10;• Mentored junior engineers and increased team productivity by 25%..."
                value={exp.details}
                onChange={(e) => handleChange(index, 'details', e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs leading-relaxed"
              />
              {polishMessage && polishMessage.index === index && (
                <p className={`text-[11px] font-medium mt-1 ${polishMessage.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {polishMessage.text}
                </p>
              )}
            </div>
          </div>
        ))
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-slate-300 transition"
      >
        <Plus className="w-3.5 h-3.5" /> {isBn ? 'নতুন অভিজ্ঞতা যোগ করুন' : 'Add Another Experience'}
      </button>
    </div>
  );
};
