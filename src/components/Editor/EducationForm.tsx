import React from 'react';
import { Education } from '../../types/cv';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

interface Props {
  educations: Education[];
  onChange: (items: Education[]) => void;
  lang: 'en' | 'bn';
}

export const EducationForm: React.FC<Props> = ({ educations, onChange, lang }) => {
  const isBn = lang === 'bn';

  const commonBoards = [
    'Dhaka Board',
    'Rajshahi Board',
    'Chattogram Board',
    'Cumilla Board',
    'Jashore Board',
    'Barishal Board',
    'Sylhet Board',
    'Dinajpur Board',
    'Mymensingh Board',
    'Madrasah Board',
    'Technical Board (BTEB)',
    'National University (NU)',
    'University of Dhaka (DU)',
    'BUET',
    'DUET',
    'RUET',
    'KUET',
    'CUET',
    'Jahangirnagar University',
    'Rajshahi University',
    'Chittagong University',
    'Shahjalal University (SUST)',
    'North South University (NSU)',
    'BRAC University',
    'AIUB',
    'Independent University (IUB)',
  ];

  const handleAdd = () => {
    const newItem: Education = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      boardOrUniversity: 'Dhaka Board',
      year: '',
      result: '',
      majorOrGroup: '',
    };
    onChange([...educations, newItem]);
  };

  const handleRemove = (index: number) => {
    const updated = educations.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleChange = (index: number, field: keyof Education, value: string) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {educations.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
          <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500">
            {isBn ? 'কোনো শিক্ষাগত যোগ্যতা যোগ করা হয়নি' : 'No education records added yet'}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-3 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200 hover:bg-emerald-100 transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> {isBn ? 'শিক্ষা যোগ করুন' : 'Add First Education'}
          </button>
        </div>
      ) : (
        educations.map((edu, index) => (
          <div key={edu.id} className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-lg space-y-2.5 relative text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                {isBn ? `শিক্ষাগত যোগ্যতা #${index + 1}` : `Education #${index + 1}`}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-rose-500 hover:text-rose-700 transition p-1 hover:bg-rose-50 rounded"
                title="Remove Education"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  {isBn ? 'ডিগ্রী / পরীক্ষার নাম (Exam/Degree) *' : 'Degree / Examination *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.Sc. in CSE / H.S.C / S.S.C"
                  value={edu.degree}
                  onChange={(e) => handleChange(index, 'degree', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  {isBn ? 'বিভাগ / মেজর (Group / Major)' : 'Group / Major'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Science / Commerce / CSE / Finance"
                  value={edu.majorOrGroup || ''}
                  onChange={(e) => handleChange(index, 'majorOrGroup', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-slate-600 mb-1">
                  {isBn ? 'প্রতিষ্ঠানের নাম (Institution) *' : 'Institution / College *'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka University of Engineering & Technology (DUET) / Dhaka College"
                  value={edu.institution}
                  onChange={(e) => handleChange(index, 'institution', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  {isBn ? 'বোর্ড / বিশ্ববিদ্যালয় (Board / University)' : 'Board / University'}
                </label>
                <input
                  type="text"
                  list={`board-list-${index}`}
                  placeholder="e.g. Dhaka Board / DUET"
                  value={edu.boardOrUniversity}
                  onChange={(e) => handleChange(index, 'boardOrUniversity', e.target.value)}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
                />
                <datalist id={`board-list-${index}`}>
                  {commonBoards.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>

              <div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">
                      {isBn ? 'পাসের বছর (Year)' : 'Year'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2020"
                      value={edu.year}
                      onChange={(e) => handleChange(index, 'year', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">
                      {isBn ? 'ফলাফল / CGPA' : 'Result / GPA'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CGPA 3.75"
                      value={edu.result}
                      onChange={(e) => handleChange(index, 'result', e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
                    />
                  </div>
                </div>
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
        <Plus className="w-3.5 h-3.5" /> {isBn ? 'অন্য একটি শিক্ষাগত যোগ্যতা যোগ করুন' : 'Add Another Education'}
      </button>
    </div>
  );
};
