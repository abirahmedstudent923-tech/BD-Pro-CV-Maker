import React from 'react';
import { CVData } from '../../types/cv';
import { Mail, Phone, Globe, MapPin, Linkedin, Github } from 'lucide-react';

interface Props {
  data: CVData;
}

export const CorporateTemplate: React.FC<Props> = ({ data }) => {
  const { personal, objective, experiences, educations, skills, certifications, projects, references, declaration, styling } = data;
  const isTwoPage = styling.format === '2page';
  const primaryColor = styling.primaryColor || '#006a4e';

  return (
    <div className={`grid grid-cols-12 bg-white text-slate-800 text-xs md:text-sm leading-relaxed ${styling.fontSize === 'compact' ? 'text-[11px] leading-snug' : styling.fontSize === 'relaxed' ? 'text-[13px] leading-normal' : ''}`}>
      
      {/* Sidebar (4 Columns) */}
      <div className="col-span-4 bg-slate-50 p-6 md:p-8 border-r border-slate-200 flex flex-col gap-6 text-xs">
        
        {/* Photo */}
        {personal.showPhoto && personal.photoUrl && (
          <div className="text-center">
            <div className="w-28 h-32 mx-auto rounded-lg overflow-hidden border-2 p-0.5 bg-white shadow-sm" style={{ borderColor: primaryColor }}>
              <img
                src={personal.photoUrl}
                alt={personal.fullName}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Name & Title */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight leading-tight" style={{ color: primaryColor }}>
            {personal.fullName || 'আপনার নাম'}
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-700 mt-1">{personal.jobTitle || 'পদবী'}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          <h2 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 text-[11px] tracking-wider">
            Contact
          </h2>
          {personal.phone && (
            <p className="text-slate-700 flex items-start gap-1.5">
              <Phone className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: primaryColor }} />
              <span>{personal.phone}</span>
            </p>
          )}
          {personal.email && (
            <p className="text-slate-700 break-all flex items-start gap-1.5">
              <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: primaryColor }} />
              <span>{personal.email}</span>
            </p>
          )}
          {personal.website && (
            <p className="text-slate-700 break-all flex items-start gap-1.5">
              <Globe className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: primaryColor }} />
              <span>{personal.website}</span>
            </p>
          )}
          {personal.linkedin && (
            <p className="text-slate-700 break-all flex items-start gap-1.5">
              <Linkedin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: primaryColor }} />
              <span>{personal.linkedin}</span>
            </p>
          )}
          {personal.presentAddress && (
            <p className="text-slate-700 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: primaryColor }} />
              <span>{personal.presentAddress}</span>
            </p>
          )}
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 text-[11px] tracking-wider mb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((s, idx) => (
                <span key={idx} className="bg-white px-2 py-0.5 rounded text-slate-700 border border-slate-200 text-[11px] font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certifications (Sidebar display) */}
        {styling.showCertifications && certifications && certifications.length > 0 && (
          <div>
            <h2 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 text-[11px] tracking-wider mb-2">
              Certifications
            </h2>
            <div className="space-y-1.5 text-[11px]">
              {certifications.map((c) => (
                <div key={c.id}>
                  <p className="font-semibold text-slate-800">{c.name}</p>
                  <p className="text-slate-500">{c.institution} {c.year ? `(${c.year})` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Details (Sidebar placement) */}
        {styling.showBDPersonalDetails && (
          <div>
            <h2 className="font-bold text-slate-900 uppercase border-b border-slate-300 pb-1 text-[11px] tracking-wider mb-2">
              Personal Info (BD)
            </h2>
            <div className="space-y-1.5 text-[11px] text-slate-700">
              <p><span className="font-semibold text-slate-500 block">Father:</span> {personal.fatherName || '—'}</p>
              <p><span className="font-semibold text-slate-500 block">Mother:</span> {personal.motherName || '—'}</p>
              <p><span className="font-semibold text-slate-500 block">DOB:</span> {personal.dob || '—'}</p>
              <p><span className="font-semibold text-slate-500 block">NID:</span> <span className="font-mono">{personal.nid || '—'}</span></p>
              <p><span className="font-semibold text-slate-500 block">Nationality:</span> {personal.nationality || 'Bangladeshi'}</p>
              <p><span className="font-semibold text-slate-500 block">Status:</span> {personal.maritalStatus} / {personal.gender}</p>
              <p><span className="font-semibold text-slate-500 block">Blood Group:</span> {personal.bloodGroup || '—'}</p>
              <p><span className="font-semibold text-slate-500 block">Permanent:</span> {personal.permanentAddress || '—'}</p>
            </div>
          </div>
        )}

      </div>

      {/* Main Content (8 Columns) */}
      <div className="col-span-8 p-6 md:p-8 space-y-6 text-xs">
        
        {/* Objective */}
        {objective && (
          <div>
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1" style={{ color: primaryColor }}>
              Executive Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">{objective}</p>
          </div>
        )}

        {/* Work Experience */}
        {experiences && experiences.length > 0 && (
          <div>
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color: primaryColor }}>
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span className="text-xs md:text-sm">{exp.designation}</span>
                    <span className="text-[11px] font-semibold text-slate-500">{exp.duration}</span>
                  </div>
                  <p className="font-medium text-[11px] mb-1" style={{ color: primaryColor }}>
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </p>
                  {exp.details && (
                    <div className="text-slate-600 text-xs whitespace-pre-line leading-relaxed">
                      {exp.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {educations && educations.length > 0 && (
          <div>
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color: primaryColor }}>
              Education
            </h2>
            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="border-b border-slate-100 pb-2">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{edu.degree}</span>
                    <span className="text-slate-500">{edu.year}</span>
                  </div>
                  <p className="text-slate-600 font-medium">{edu.institution} {edu.boardOrUniversity ? `(${edu.boardOrUniversity})` : ''}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Result: <span className="font-semibold text-slate-700">{edu.result}</span> {edu.majorOrGroup ? `• Major: ${edu.majorOrGroup}` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects (if shown) */}
        {styling.showProjects && projects && projects.length > 0 && (
          <div>
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1" style={{ color: primaryColor }}>
              Projects
            </h2>
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{proj.title}</span>
                    {proj.link && <span className="text-[11px] text-blue-600">{proj.link}</span>}
                  </div>
                  {proj.technologies && <p className="text-[11px] text-slate-500">{proj.technologies}</p>}
                  {proj.description && <p className="text-slate-600 text-xs mt-0.5">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PAGE 2 SEPARATION FOR 2-PAGE FORMAT --- */}
        {isTwoPage && (
          <>
            <div className="no-print my-6 border-t-2 border-dashed border-slate-300 pt-3 text-center text-xs text-slate-400 font-medium select-none">
              —— Page 2 (Bangladeshi Official Details & References) ——
            </div>
            <div className="print-only page-break" style={{ pageBreakBefore: 'always', breakBefore: 'page' }} />
          </>
        )}

        {/* References */}
        {styling.showReferences && references && references.length > 0 && (
          <div className="avoid-break">
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1" style={{ color: primaryColor }}>
              References
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {references.map((r) => (
                <div key={r.id} className="p-2.5 border border-slate-200 rounded bg-slate-50/60">
                  <p className="font-bold text-slate-800">{r.name}</p>
                  <p className="text-slate-600 text-[11px]">{r.designation} — {r.organization}</p>
                  {r.phone && <p className="text-slate-500 text-[11px] mt-1">Phone: {r.phone}</p>}
                  {r.email && <p className="text-slate-500 text-[11px]">Email: {r.email}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Declaration */}
        {styling.showDeclaration && (
          <div className="pt-4 border-t border-slate-200 text-xs avoid-break">
            <p className="font-semibold text-slate-800 mb-1">Declaration:</p>
            <p className="text-slate-600 text-justify">
              {declaration?.text || 'I do hereby declare that all information provided above is true and correct to the best of my knowledge.'}
            </p>
            <div className="mt-6 flex justify-between items-end">
              <div className="text-slate-500 text-[11px]">
                <p>Date: {declaration?.date || new Date().toLocaleDateString('en-GB')}</p>
                <p>Place: {declaration?.place || 'Dhaka, Bangladesh'}</p>
              </div>
              <div className="border-t border-slate-400 pt-1 w-40 text-center text-slate-700">
                <p className="font-bold text-xs">{declaration?.signatureName || personal.fullName}</p>
                <p className="text-[10px] text-slate-400 uppercase">Signature</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
