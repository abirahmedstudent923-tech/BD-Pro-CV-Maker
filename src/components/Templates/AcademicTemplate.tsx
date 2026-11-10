import React from 'react';
import { CVData } from '../../types/cv';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';

interface Props {
  data: CVData;
}

export const AcademicTemplate: React.FC<Props> = ({ data }) => {
  const { personal, objective, experiences, educations, skills, certifications, projects, references, declaration, styling } = data;
  const isTwoPage = styling.format === '2page';
  const primaryColor = styling.primaryColor || '#006a4e';

  return (
    <div className={`p-8 md:p-10 bg-white text-slate-800 text-xs md:text-sm leading-relaxed font-serif-bd ${styling.fontSize === 'compact' ? 'text-[11px] leading-snug' : styling.fontSize === 'relaxed' ? 'text-[13px] leading-normal' : ''}`}>
      
      {/* Header */}
      <div className="border-b-2 border-slate-800 pb-5 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wider text-slate-900 mb-1">
            {personal.fullName || 'CURRICULUM VITAE'}
          </h1>
          <p className="text-sm md:text-base font-semibold text-slate-700 italic">
            {personal.jobTitle || 'Academician / Researcher'}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-1 text-xs text-slate-600 mt-3 font-sans">
            {personal.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-500" /> {personal.phone}
              </span>
            )}
            {personal.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-500" /> {personal.email}
              </span>
            )}
            {personal.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-500" /> {personal.website}
              </span>
            )}
          </div>

          {personal.presentAddress && (
            <p className="text-xs text-slate-600 mt-1 font-sans flex items-center justify-center md:justify-start gap-1">
              <MapPin className="w-3 h-3 text-slate-500" /> {personal.presentAddress}
            </p>
          )}
        </div>

        {/* Passport Photo */}
        {personal.showPhoto && personal.photoUrl && (
          <div className="shrink-0">
            <div className="w-24 h-28 border border-slate-400 p-0.5 bg-white shadow-sm">
              <img
                src={personal.photoUrl}
                alt={personal.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Research Interest / Summary */}
      {objective && (
        <div className="mb-6">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
            Research Interests & Academic Summary
          </h2>
          <p className="text-xs md:text-[13px] text-slate-700 text-justify leading-relaxed">{objective}</p>
        </div>
      )}

      {/* Education First for Academic CV */}
      {educations && educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
            Academic Background
          </h2>
          <div className="space-y-3">
            {educations.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="text-xs md:text-sm">{edu.degree}</span>
                  <span className="font-sans text-slate-600">{edu.year}</span>
                </div>
                <p className="text-slate-700 italic">{edu.institution} {edu.boardOrUniversity ? `— ${edu.boardOrUniversity}` : ''}</p>
                <p className="font-sans text-slate-600 text-[11px] mt-0.5">
                  Result: <span className="font-semibold text-slate-800">{edu.result}</span> {edu.majorOrGroup ? `(Major: ${edu.majorOrGroup})` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Academic / Professional Appointments */}
      {experiences && experiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2.5 font-sans">
            Academic & Professional Appointments
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span className="text-xs md:text-sm">{exp.designation}</span>
                  <span className="font-sans text-xs text-slate-500">{exp.duration}</span>
                </div>
                <p className="text-slate-700 italic text-xs">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                {exp.details && (
                  <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed mt-1 font-sans">
                    {exp.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publications / Projects */}
      {styling.showProjects && projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
            Research Projects & Publications
          </h2>
          <div className="space-y-3 font-sans text-xs">
            {projects.map((proj) => (
              <div key={proj.id} className="border-l-2 pl-3" style={{ borderColor: primaryColor }}>
                <p className="font-bold text-slate-900">{proj.title}</p>
                {proj.technologies && <p className="text-slate-500 text-[11px] italic">Focus: {proj.technologies}</p>}
                {proj.description && <p className="text-slate-700 mt-1">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Fellowships */}
      {styling.showCertifications && certifications && certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
            Honors, Awards & Certifications
          </h2>
          <ul className="list-disc list-inside text-xs text-slate-700 font-sans space-y-1">
            {certifications.map((c) => (
              <li key={c.id}>
                <span className="font-semibold text-slate-900">{c.name}</span> — {c.institution} ({c.year})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-6 font-sans">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
            Core Expertise & Methodologies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-800 text-xs px-2.5 py-0.5 rounded border border-slate-200">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Page 2 Details */}
      {isTwoPage && (
        <>
          {/* Screen Only Visual Page Break Indicator */}
          <div className="no-print my-8 border-t-2 border-dashed border-slate-300 pt-4 text-center text-xs text-slate-400 font-sans font-medium select-none">
            —— Page 2 (Bangladeshi Official Details & Referees) ——
          </div>

          {/* Print Only Hard Page Break */}
          <div className="print-only page-break" style={{ pageBreakBefore: 'always', breakBefore: 'page' }} />

          {styling.showBDPersonalDetails && (
            <div className="mb-6 font-sans avoid-break">
              <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                Personal Particulars
              </h2>
              <table className="w-full text-xs text-slate-700 border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100 py-1"><td className="w-1/3 py-1 font-semibold text-slate-800">Father's Name</td><td>: {personal.fatherName}</td></tr>
                  <tr className="border-b border-slate-100 py-1"><td className="w-1/3 py-1 font-semibold text-slate-800">Mother's Name</td><td>: {personal.motherName}</td></tr>
                  <tr className="border-b border-slate-100 py-1"><td className="w-1/3 py-1 font-semibold text-slate-800">Date of Birth</td><td>: {personal.dob}</td></tr>
                  <tr className="border-b border-slate-100 py-1"><td className="w-1/3 py-1 font-semibold text-slate-800">Nationality</td><td>: {personal.nationality}</td></tr>
                  <tr className="border-b border-slate-100 py-1"><td className="w-1/3 py-1 font-semibold text-slate-800">National ID (NID)</td><td className="font-mono">: {personal.nid}</td></tr>
                  <tr className="border-b border-slate-100 py-1"><td className="w-1/3 py-1 font-semibold text-slate-800">Marital Status & Gender</td><td>: {personal.maritalStatus} / {personal.gender}</td></tr>
                  <tr className="border-b border-slate-100 py-1"><td className="w-1/3 py-1 font-semibold text-slate-800">Religion</td><td>: {personal.religion}</td></tr>
                  <tr className="border-b border-slate-100 py-1"><td className="w-1/3 py-1 font-semibold text-slate-800">Blood Group</td><td>: {personal.bloodGroup}</td></tr>
                  <tr className="border-b border-slate-100 py-1"><td className="w-1/3 py-1 font-semibold text-slate-800">Permanent Address</td><td>: {personal.permanentAddress}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {styling.showReferences && references && references.length > 0 && (
            <div className="mb-6 font-sans avoid-break">
              <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                Academic & Professional Referees
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {references.map((r) => (
                  <div key={r.id} className="p-3 border border-slate-200 rounded text-xs">
                    <p className="font-bold text-slate-900">{r.name}</p>
                    <p className="text-slate-700">{r.designation}</p>
                    <p className="text-slate-600 italic">{r.organization}</p>
                    {r.phone && <p className="text-slate-500 mt-1">Contact: {r.phone}</p>}
                    {r.email && <p className="text-slate-500">Email: {r.email}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {styling.showDeclaration && (
            <div className="pt-6 border-t border-slate-300 font-sans text-xs avoid-break">
              <p className="font-semibold text-slate-800 mb-1">Declaration:</p>
              <p className="text-slate-600 text-justify">
                {declaration?.text || 'I hereby affirm that all facts stated in this curriculum vitae are authentic and true to the best of my knowledge.'}
              </p>
              <div className="mt-8 flex justify-between items-end">
                <div className="text-slate-500 text-[11px]">
                  <p>Date: {declaration?.date || new Date().toLocaleDateString('en-GB')}</p>
                  <p>Place: {declaration?.place || 'Dhaka, Bangladesh'}</p>
                </div>
                <div className="border-t border-slate-400 pt-1 w-44 text-center text-slate-800">
                  <p className="font-bold text-xs">{declaration?.signatureName || personal.fullName}</p>
                  <p className="text-[10px] text-slate-400 uppercase">Signature</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
