import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface Props {
  skills: string[];
  onChange: (skills: string[]) => void;
  lang: 'en' | 'bn';
}

export const SkillsForm: React.FC<Props> = ({ skills, onChange, lang }) => {
  const isBn = lang === 'bn';
  const [newSkill, setNewSkill] = useState('');

  const quickPopularSkills = [
    'Microsoft Excel (Advanced)',
    'English Communication',
    'Presentation Skills',
    'Team Leadership',
    'JavaScript',
    'React.js',
    'Python',
    'PostgreSQL / SQL',
    'Tally Prime',
    'Tax & VAT Compliance',
    'Figma & UI Design',
    'AutoCAD',
    'Digital Marketing',
    'Customer Service',
    'Problem Solving',
  ];

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    onChange(skills.filter((_, idx) => idx !== index));
  };

  const handleBulkInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value;
    const split = raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    onChange(split);
  };

  return (
    <div className="space-y-3 text-xs">
      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          {isBn ? 'দক্ষতা সমূহ (কমা দিয়ে আলাদা করুন)' : 'Skills (Comma or Newline separated)'}
        </label>
        <textarea
          rows={3}
          value={skills.join(', ')}
          onChange={handleBulkInput}
          placeholder="e.g. JavaScript, React, Node.js, Problem Solving, Team Leadership"
          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs leading-relaxed"
        />
      </div>

      {/* Badges preview */}
      <div>
        <p className="text-[11px] font-medium text-slate-500 mb-1.5">
          {isBn ? 'বর্তমানে যুক্ত স্কিল:' : 'Active Skills:'}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md font-medium text-xs"
            >
              <Tag className="w-3 h-3 text-emerald-600" />
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="hover:text-rose-600 ml-1 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Quick Add Suggestions */}
      <div className="pt-2 border-t border-slate-100">
        <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
          {isBn ? 'জনপ্রিয় স্কিল (ক্লিক করে যোগ করুন):' : 'Suggested Popular Skills in Bangladesh:'}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickPopularSkills
            .filter((s) => !skills.includes(s))
            .map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddSkill(s)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded text-[11px] inline-flex items-center gap-1 transition"
              >
                <Plus className="w-2.5 h-2.5 text-slate-500" /> {s}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
