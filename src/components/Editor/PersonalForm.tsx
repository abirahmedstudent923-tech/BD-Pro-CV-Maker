import React, { useRef } from 'react';
import { PersonalInfo } from '../../types/cv';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Upload, Trash2, Camera } from 'lucide-react';

interface Props {
  personal: PersonalInfo;
  onChange: (updated: Partial<PersonalInfo>) => void;
  lang: 'en' | 'bn';
}

export const PersonalForm: React.FC<Props> = ({ personal, onChange, lang }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const isBn = lang === 'bn';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setUploadError(isBn ? 'ছবি সর্বোচ্চ ২ মেগাবাইট হতে হবে' : 'Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        onChange({ photoUrl: reader.result as string, showPhoto: true });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Photo Upload Card */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg border-2 border-slate-300 overflow-hidden bg-white shrink-0 flex items-center justify-center relative group">
            {personal.photoUrl ? (
              <img src={personal.photoUrl} alt="Passport Preview" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {isBn ? 'পাসপোর্ট সাইজ ছবি (ঐচ্ছিক)' : 'Passport Size Photo (Optional)'}
            </p>
            <p className="text-[11px] text-slate-500">
              {isBn ? 'বাংলাদেশি অফিসিয়াল সিভির জন্য সুপারিশকৃত' : 'Recommended for official BD applications'}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded border border-slate-300 flex items-center gap-1 shadow-sm transition"
              >
                <Upload className="w-3 h-3" /> {isBn ? 'ছবি আপলোড' : 'Upload Photo'}
              </button>
              {personal.photoUrl && (
                <button
                  type="button"
                  onClick={() => onChange({ photoUrl: '' })}
                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium rounded border border-rose-200 flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3 h-3" /> {isBn ? 'মুছুন' : 'Remove'}
                </button>
              )}
            </div>
            {uploadError && (
              <p className="text-[11px] text-rose-600 font-medium mt-1">{uploadError}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600 flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={personal.showPhoto}
              onChange={(e) => onChange({ showPhoto: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-medium">{isBn ? 'সিভিতে দেখান' : 'Show on CV'}</span>
          </label>
        </div>
      </div>

      {/* Basic Contact Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            {isBn ? 'পূর্ণ নাম (Full Name) *' : 'Full Name *'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={personal.fullName}
              onChange={(e) => onChange({ fullName: e.target.value })}
              placeholder="e.g. Md. Tanvir Rahman"
              className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            />
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            {isBn ? 'পদবী (Designation / Professional Title) *' : 'Designation / Title *'}
          </label>
          <input
            type="text"
            value={personal.jobTitle}
            onChange={(e) => onChange({ jobTitle: e.target.value })}
            placeholder="e.g. Senior Software Engineer / Officer (General Banking)"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            {isBn ? 'মোবাইল নম্বর (Phone) *' : 'Phone Number *'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={personal.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+880 1712-345678"
              className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs font-mono"
            />
            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            {isBn ? 'ইমেইল (Email Address) *' : 'Email Address *'}
          </label>
          <div className="relative">
            <input
              type="email"
              value={personal.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="example@gmail.com"
              className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            />
            <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">
            {isBn ? 'বর্তমান ঠিকানা (Present Address)' : 'Present Address'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={personal.presentAddress}
              onChange={(e) => onChange({ presentAddress: e.target.value })}
              placeholder="House #, Road #, Area, Police Station, District, Post Code"
              className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            />
            <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
          <div className="relative">
            <input
              type="text"
              value={personal.linkedin}
              onChange={(e) => onChange({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/username"
              className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            />
            <Linkedin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            {isBn ? 'পোর্টফোলিও / ওয়েবসাইট / GitHub' : 'Portfolio / GitHub / Website'}
          </label>
          <div className="relative">
            <input
              type="text"
              value={personal.website || personal.github}
              onChange={(e) => onChange({ website: e.target.value, github: e.target.value })}
              placeholder="github.com/username or portfolio.io"
              className="w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            />
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Bangladeshi Official Information Section */}
      <div className="mt-5 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {isBn ? 'ব্যক্তিগত তথ্য (বাংলাদেশ স্ট্যান্ডার্ড)' : 'Personal Details (Bangladeshi Standard)'}
          </h3>
          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium">
            {isBn ? 'ব্যাংক ও কর্পোরেট সিভির জন্য আবশ্যক' : 'Essential for BD Corporate/Govt'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-lg border border-slate-200">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'পিতার নাম (Father\'s Name)' : "Father's Name"}
            </label>
            <input
              type="text"
              value={personal.fatherName}
              onChange={(e) => onChange({ fatherName: e.target.value })}
              placeholder="e.g. Md. Abdur Rahman"
              className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'মাতার নাম (Mother\'s Name)' : "Mother's Name"}
            </label>
            <input
              type="text"
              value={personal.motherName}
              onChange={(e) => onChange({ motherName: e.target.value })}
              placeholder="e.g. Begum Rokeya"
              className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'জন্ম তারিখ (Date of Birth)' : 'Date of Birth'}
            </label>
            <input
              type="text"
              value={personal.dob}
              onChange={(e) => onChange({ dob: e.target.value })}
              placeholder="e.g. 15th August 1996"
              className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'জাতীয় পরিচয়পত্র নম্বর (NID No.)' : 'National ID (NID No.)'}
            </label>
            <input
              type="text"
              value={personal.nid}
              onChange={(e) => onChange({ nid: e.target.value })}
              placeholder="10 / 13 / 17 digit NID"
              className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'বৈবাহিক অবস্থা (Marital Status)' : 'Marital Status'}
            </label>
            <select
              value={personal.maritalStatus}
              onChange={(e) => onChange({ maritalStatus: e.target.value as any })}
              className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            >
              <option value="Unmarried">{isBn ? 'অবিবাহিত (Unmarried)' : 'Unmarried'}</option>
              <option value="Married">{isBn ? 'বিবাহিত (Married)' : 'Married'}</option>
              <option value="Other">{isBn ? 'অন্যান্য (Other)' : 'Other'}</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'লিঙ্গ (Gender)' : 'Gender'}
            </label>
            <select
              value={personal.gender}
              onChange={(e) => onChange({ gender: e.target.value as any })}
              className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            >
              <option value="Male">{isBn ? 'পুরুষ (Male)' : 'Male'}</option>
              <option value="Female">{isBn ? 'নারী (Female)' : 'Female'}</option>
              <option value="Other">{isBn ? 'অন্যান্য (Other)' : 'Other'}</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'ধর্ম (Religion)' : 'Religion'}
            </label>
            <input
              type="text"
              value={personal.religion}
              onChange={(e) => onChange({ religion: e.target.value })}
              placeholder="Islam / Hinduism / Christianity / Buddhism"
              className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'রক্তের গ্রুপ (Blood Group)' : 'Blood Group'}
            </label>
            <select
              value={personal.bloodGroup}
              onChange={(e) => onChange({ bloodGroup: e.target.value })}
              className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            >
              <option value="">-- {isBn ? 'নির্বাচন করুন' : 'Select'} --</option>
              <option value="A+ (Positive)">A+ (Positive)</option>
              <option value="A- (Negative)">A- (Negative)</option>
              <option value="B+ (Positive)">B+ (Positive)</option>
              <option value="B- (Negative)">B- (Negative)</option>
              <option value="O+ (Positive)">O+ (Positive)</option>
              <option value="O- (Negative)">O- (Negative)</option>
              <option value="AB+ (Positive)">AB+ (Positive)</option>
              <option value="AB- (Negative)">AB- (Negative)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'জাতীয়তা (Nationality)' : 'Nationality'}
            </label>
            <input
              type="text"
              value={personal.nationality}
              onChange={(e) => onChange({ nationality: e.target.value })}
              placeholder="Bangladeshi (By Birth)"
              className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              {isBn ? 'স্থায়ী ঠিকানা (Permanent Address - Village, Post, Upazila, District)' : 'Permanent Address (Village, Post, Thana, District)'}
            </label>
            <input
              type="text"
              value={personal.permanentAddress}
              onChange={(e) => onChange({ permanentAddress: e.target.value })}
              placeholder="Village: ..., P.O: ..., Upazila/Thana: ..., District: ..."
              className="w-full px-2.5 py-1.5 border rounded focus:ring-2 focus:ring-emerald-600 outline-none bg-white text-xs"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
