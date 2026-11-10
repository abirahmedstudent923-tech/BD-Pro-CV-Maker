import React from 'react';
import { Certification } from '../../types/cv';
import { Award, Plus, Trash2 } from 'lucide-react';

interface Props {
  certifications: Certification[];
  onChange: (items: Certification[]) => void;
  lang: 'en' | 'bn';
}

export const CertificationsForm: React.FC<Props> = ({ certifications, onChange, lang }) => {
  const isBn = lang === 'bn';

  const handleAdd = () => {
    const newItem: Certification = {
      id: `cert-${Date.now()}`,
      name: '',
      institution: '',
      year: new Date().getFullYear().toString(),
    };
    onChange([...certifications, newItem]);
  };

  const handleRemove = (index: number) => {
    onChange(certifications.filter((_, idx) => idx !== index));
  };

  const handleChange = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3 text-xs">
      {certifications.length === 0 ? (
        <div className="text-center py-4 border border-dashed border-slate-200 rounded-lg">
          <Award className="w-6 h-6 text-slate-300 mx-auto mb-1" />
          <p className="text-slate-500 text-[11px]">
            {isBn ? 'কোনো ট্রেনিং বা সার্টিফিকেট যোগ করা হয়নি' : 'No training or certifications added yet'}
          </p>
        </div>
      ) : (
        certifications.map((item, index) => (
          <div key={item.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 relative">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">
                {isBn ? `সার্টিফিকেশন #${index + 1}` : `Certification #${index + 1}`}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-rose-500 hover:text-rose-700 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Certificate Name (e.g. Full Stack Web Development)"
                  value={item.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  className="w-full p-1.5 border rounded text-xs bg-white"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Passing Year (e.g. 2023)"
                  value={item.year}
                  onChange={(e) => handleChange(index, 'year', e.target.value)}
                  className="w-full p-1.5 border rounded text-xs bg-white font-mono"
                />
              </div>
              <div className="md:col-span-3">
                <input
                  type="text"
                  placeholder="Issuing Organization (e.g. BASIS / BITM / Coursera / NBR)"
                  value={item.institution}
                  onChange={(e) => handleChange(index, 'institution', e.target.value)}
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
        <Plus className="w-3.5 h-3.5" /> {isBn ? 'সার্টিফিকেশন যোগ করুন' : 'Add Certification / Training'}
      </button>
    </div>
  );
};
