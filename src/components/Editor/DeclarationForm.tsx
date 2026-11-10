import React from 'react';
import { DeclarationData } from '../../types/cv';
import { FileSignature } from 'lucide-react';

interface Props {
  declaration: DeclarationData;
  onChange: (data: Partial<DeclarationData>) => void;
  lang: 'en' | 'bn';
}

export const DeclarationForm: React.FC<Props> = ({ declaration, onChange, lang }) => {
  const isBn = lang === 'bn';

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center gap-2 mb-1">
        <FileSignature className="w-4 h-4 text-emerald-700" />
        <span className="font-semibold text-slate-800">
          {isBn ? 'স্বঘোষণা ও স্বাক্ষর (Declaration & Signature)' : 'Declaration & Signature Line'}
        </span>
      </div>

      <div>
        <label className="block font-medium text-slate-600 mb-1">
          {isBn ? 'ঘোষণাপত্র টেক্সট (Declaration Statement)' : 'Declaration Statement'}
        </label>
        <textarea
          rows={2}
          value={declaration.text}
          onChange={(e) => onChange({ text: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        <div>
          <label className="block font-medium text-slate-600 mb-1">
            {isBn ? 'স্বাক্ষরকারীর নাম' : 'Signee Name'}
          </label>
          <input
            type="text"
            value={declaration.signatureName}
            onChange={(e) => onChange({ signatureName: e.target.value })}
            placeholder="Full Name"
            className="w-full p-1.5 border rounded text-xs bg-white font-medium"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-600 mb-1">
            {isBn ? 'স্থান (Place)' : 'Place'}
          </label>
          <input
            type="text"
            value={declaration.place}
            onChange={(e) => onChange({ place: e.target.value })}
            placeholder="e.g. Dhaka, Bangladesh"
            className="w-full p-1.5 border rounded text-xs bg-white"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-600 mb-1">
            {isBn ? 'তারিখ (Date)' : 'Date'}
          </label>
          <input
            type="text"
            value={declaration.date}
            onChange={(e) => onChange({ date: e.target.value })}
            placeholder="e.g. 7th November 2026"
            className="w-full p-1.5 border rounded text-xs bg-white"
          />
        </div>
      </div>
    </div>
  );
};
