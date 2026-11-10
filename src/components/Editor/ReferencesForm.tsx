import React from 'react';
import { Reference } from '../../types/cv';
import { Users, Plus, Trash2 } from 'lucide-react';

interface Props {
  references: Reference[];
  onChange: (items: Reference[]) => void;
  lang: 'en' | 'bn';
}

export const ReferencesForm: React.FC<Props> = ({ references, onChange, lang }) => {
  const isBn = lang === 'bn';

  const handleAdd = () => {
    const newItem: Reference = {
      id: `ref-${Date.now()}`,
      name: '',
      designation: '',
      organization: '',
      phone: '',
      email: '',
      relationship: '',
    };
    onChange([...references, newItem]);
  };

  const handleRemove = (index: number) => {
    onChange(references.filter((_, idx) => idx !== index));
  };

  const handleChange = (index: number, field: keyof Reference, value: string) => {
    const updated = [...references];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-lg text-blue-900 text-[11px] leading-relaxed">
        <strong>{isBn ? 'টিপস:' : 'Bangladeshi Standard Tip:'}</strong>{' '}
        {isBn
          ? 'বাংলাদেশের কর্পোরেট ও ব্যাংকিং খাতে সাধারণত ২ জন রেফারেন্স চাওয়া হয় (যেমন: বিশ্ববিদ্যালয়ের শিক্ষক অথবা বর্তমান/পূর্বতন ঊর্ধ্বতন কর্মকর্তা)।'
          : 'In Bangladesh, providing 2 professional or academic referees (e.g. University Professor, Thesis Supervisor, or Former Line Manager) is the industry benchmark.'}
      </div>

      {references.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-slate-200 rounded-lg">
          <Users className="w-6 h-6 text-slate-300 mx-auto mb-1" />
          <p className="text-slate-500 text-[11px]">
            {isBn ? 'কোনো রেফারেন্স যোগ করা হয়নি' : 'No references added yet'}
          </p>
        </div>
      ) : (
        references.map((item, index) => (
          <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative">
            <div className="flex justify-between items-center pb-1 border-b border-slate-200">
              <span className="font-semibold text-slate-800">
                {isBn ? `রেফারেন্স #${index + 1}` : `Reference #${index + 1}`}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-rose-500 hover:text-rose-700 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  {isBn ? 'নাম (Referee Name) *' : 'Referee Name *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Md. Mahfuzur Rahman"
                  value={item.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  className="w-full p-1.5 border rounded text-xs bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  {isBn ? 'পদবী (Designation) *' : 'Designation *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Professor & Head, Dept. of CSE"
                  value={item.designation}
                  onChange={(e) => handleChange(index, 'designation', e.target.value)}
                  className="w-full p-1.5 border rounded text-xs bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  {isBn ? 'প্রতিষ্ঠান (Organization) *' : 'Organization *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka University of Engineering & Technology (DUET)"
                  value={item.organization}
                  onChange={(e) => handleChange(index, 'organization', e.target.value)}
                  className="w-full p-1.5 border rounded text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  {isBn ? 'মোবাইল নম্বর (Phone) *' : 'Mobile / Phone *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. +880 1711-223344"
                  value={item.phone}
                  onChange={(e) => handleChange(index, 'phone', e.target.value)}
                  className="w-full p-1.5 border rounded text-xs bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  {isBn ? 'ইমেইল (Email)' : 'Email'}
                </label>
                <input
                  type="email"
                  placeholder="e.g. referee@organization.bd"
                  value={item.email}
                  onChange={(e) => handleChange(index, 'email', e.target.value)}
                  className="w-full p-1.5 border rounded text-xs bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  {isBn ? 'সম্পর্ক (Relationship / Context)' : 'Relationship / Context'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Undergraduate Thesis Supervisor / Former Line Manager"
                  value={item.relationship || ''}
                  onChange={(e) => handleChange(index, 'relationship', e.target.value)}
                  className="w-full p-1.5 border rounded text-xs bg-white"
                />
              </div>
            </div>
          </div>
        ))
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border border-slate-300 transition"
      >
        <Plus className="w-3.5 h-3.5" /> {isBn ? 'রেফারেন্স যোগ করুন' : 'Add Reference'}
      </button>
    </div>
  );
};
