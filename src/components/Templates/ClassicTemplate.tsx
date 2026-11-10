import React from 'react';
import { CVData } from '../../types/cv';
import { Mail, Phone, Globe, MapPin, Linkedin, Github } from 'lucide-react';

interface Props {
  data: CVData;
}

export const ClassicTemplate: React.FC<Props> = ({ data }) => {
  const { personal, objective, experiences, educations, skills, certifications, projects, references, declaration, styling } = data;
  const isTwoPage = styling.format === '2page';
  const primaryColor = styling.primaryColor || '#006a4e';

  return (
    <div className={`p-8 md:p-10 text-slate-800 text-xs md:text-sm leading-relaxed bg-white ${styling.fontSize === 'compact' ? 'text-[11px] leading-snug' : styling.fontSize === 'relaxed' ? 'text-[13px] leading-normal' : ''}`}>
      
      {/* Header Section */}
      <div className="border-b-2 pb-5 mb-5 flex justify-between items-start gap-4" style={{ borderColor: primaryColor }}>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide mb-1" style={{ color: primaryColor }}>
            {personal.fullName || 'আপনার নাম (Your Name)'}
          </h1>
          <p className="text-sm md:text-base font-semibold text-slate-700 tracking-wide mb-2.5">
            {personal.jobTitle || 'পদবী (Designation)'}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-600">
            {personal.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} /> {personal.phone}
              </span>
            )}
            {personal.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} /> {personal.email}
              </span>
            )}
            {personal.website && (
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" style={{ color: primaryColor }} /> {personal.website}
              </span>
            )}
            {personal.linkedin && (
              <span className="flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5" style={{ color: primaryColor }} /> {personal.linkedin}
              </span>
            )}
            {personal.github && (
              <span className="flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5" style={{ color: primaryColor }} /> {personal.github}
              </span>
            )}
          </div>

          {personal.presentAddress && (
            <p className="text-xs text-slate-600 mt-2 flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: primaryColor }} />
              <span>{personal.presentAddress}</span>
            </p>
          )}
        </div>

        {/* Passport Photo (Bangladeshi Official Format) */}
        {personal.showPhoto && personal.photoUrl && (
          <div className="shrink-0">
            <div className="w-24 h-28 md:w-28 md:h-32 border-2 p-0.5 shadow-sm bg-white" style={{ borderColor: primaryColor }}>
              <img
                src={personal.photoUrl}
                alt={personal.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-1 uppercase font-medium">Passport Size</p>
          </div>
        )}
      </div>

      {/* Career Objective */}
      {objective && (
        <div className="mb-5">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            Career Objective
          </h2>
          <p className="text-xs md:text-[13px] text-slate-700 text-justify leading-relaxed">{objective}</p>
        </div>
      )}

      {/* Work Experience */}
      {experiences && experiences.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2.5" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            Work Experience
          </h2>
          <div className="space-y-3.5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-slate-900 text-xs md:text-sm">
                    {exp.designation} <span className="font-normal text-slate-600">at <span className="font-semibold text-slate-800">{exp.company}</span></span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {exp.duration}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-[11px] text-slate-500 mb-1">{exp.location} {exp.employmentType ? `• ${exp.employmentType}` : ''}</p>
                )}
                {exp.details && (
                  <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed pl-1">
                    {exp.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Educational Qualifications - Standard Bangladeshi Tabular Format */}
      {educations && educations.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            Educational Qualification
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                  <th className="p-2 border border-slate-300 font-bold">Exam / Degree</th>
                  <th className="p-2 border border-slate-300 font-bold">Institute</th>
                  <th className="p-2 border border-slate-300 font-bold">Board / University</th>
                  <th className="p-2 border border-slate-300 font-bold text-center">Year</th>
                  <th className="p-2 border border-slate-300 font-bold text-right">Result / GPA</th>
                </tr>
              </thead>
              <tbody>
                {educations.map((edu) => (
                  <tr key={edu.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-2 border border-slate-300 font-semibold text-slate-900">
                      {edu.degree}
                      {edu.majorOrGroup && <span className="block text-[11px] font-normal text-slate-500">Group/Major: {edu.majorOrGroup}</span>}
                    </td>
                    <td className="p-2 border border-slate-300 text-slate-700">{edu.institution}</td>
                    <td className="p-2 border border-slate-300 text-slate-700">{edu.boardOrUniversity || '—'}</td>
                    <td className="p-2 border border-slate-300 text-center font-medium text-slate-700">{edu.year}</td>
                    <td className="p-2 border border-slate-300 text-right font-semibold text-slate-800">{edu.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded border border-slate-200 font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects (if shown) */}
      {styling.showProjects && projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            Key Projects
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{proj.title} {proj.role && <span className="font-normal text-slate-500">({proj.role})</span>}</span>
                  {proj.link && <span className="text-[11px] text-blue-600 underline font-normal">{proj.link}</span>}
                </div>
                {proj.technologies && <p className="text-[11px] text-slate-500">Technologies: {proj.technologies}</p>}
                {proj.description && <p className="text-slate-700 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Trainings */}
      {styling.showCertifications && certifications && certifications.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
            Training & Certifications
          </h2>
          <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
            {certifications.map((c) => (
              <li key={c.id}>
                <span className="font-semibold text-slate-900">{c.name}</span> — {c.institution} {c.year ? `(${c.year})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- PAGE BREAK FOR 2-PAGE FORMAT --- */}
      {isTwoPage && (
        <>
          {/* Screen Only Visual Page Break Indicator */}
          <div className="no-print my-8 border-t-2 border-dashed border-slate-300 pt-4 text-center text-xs text-slate-400 font-medium select-none">
            —— Page 2 (Bangladeshi Official Details & References) ——
          </div>

          {/* Print Only Hard Page Break */}
          <div className="print-only page-break" style={{ pageBreakBefore: 'always', breakBefore: 'page' }} />

          {/* Personal Details (Mandatory in Bangladesh Corporate & Govt Standards) */}
          {styling.showBDPersonalDetails && (
            <div className="mb-5 avoid-break">
              <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
                Personal Details
              </h2>
              <table className="w-full text-xs text-slate-700 border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100 py-1.5">
                    <td className="w-1/3 py-1 font-semibold text-slate-800">Father's Name</td>
                    <td className="py-1">: {personal.fatherName || '—'}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1.5">
                    <td className="w-1/3 py-1 font-semibold text-slate-800">Mother's Name</td>
                    <td className="py-1">: {personal.motherName || '—'}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1.5">
                    <td className="w-1/3 py-1 font-semibold text-slate-800">Date of Birth</td>
                    <td className="py-1">: {personal.dob || '—'}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1.5">
                    <td className="w-1/3 py-1 font-semibold text-slate-800">Nationality</td>
                    <td className="py-1">: {personal.nationality || 'Bangladeshi (By Birth)'}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1.5">
                    <td className="w-1/3 py-1 font-semibold text-slate-800">National ID (NID No.)</td>
                    <td className="py-1 font-mono">: {personal.nid || '—'}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1.5">
                    <td className="w-1/3 py-1 font-semibold text-slate-800">Gender & Marital Status</td>
                    <td className="py-1">: {personal.gender || '—'} / {personal.maritalStatus || 'Unmarried'}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1.5">
                    <td className="w-1/3 py-1 font-semibold text-slate-800">Religion</td>
                    <td className="py-1">: {personal.religion || '—'}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1.5">
                    <td className="w-1/3 py-1 font-semibold text-slate-800">Blood Group</td>
                    <td className="py-1">: {personal.bloodGroup || '—'}</td>
                  </tr>
                  <tr className="border-b border-slate-100 py-1.5">
                    <td className="w-1/3 py-1 font-semibold text-slate-800 align-top">Permanent Address</td>
                    <td className="py-1 align-top">: {personal.permanentAddress || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* References */}
          {styling.showReferences && references && references.length > 0 && (
            <div className="mb-5 avoid-break">
              <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2.5" style={{ color: primaryColor, borderColor: '#cbd5e1' }}>
                References
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {references.map((ref) => (
                  <div key={ref.id} className="p-3 border border-slate-200 rounded text-xs space-y-0.5 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-xs md:text-sm">{ref.name}</h3>
                    <p className="text-slate-700 font-medium">{ref.designation}</p>
                    <p className="text-slate-600">{ref.organization}</p>
                    {ref.phone && <p className="text-slate-500 mt-1">Mobile: <span className="text-slate-800 font-mono">{ref.phone}</span></p>}
                    {ref.email && <p className="text-slate-500">Email: <span className="text-slate-800">{ref.email}</span></p>}
                    {ref.relationship && <p className="text-[11px] text-slate-400">Relation: {ref.relationship}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Declaration & Signature */}
          {styling.showDeclaration && (
            <div className="mt-8 pt-4 border-t border-slate-200 text-xs avoid-break">
              <p className="font-bold uppercase tracking-wider text-slate-800 mb-1">Declaration</p>
              <p className="text-slate-600 leading-relaxed text-justify">
                {declaration?.text || 'I do hereby declare that all information furnished above is true, complete and correct to the best of my knowledge and belief.'}
              </p>

              <div className="mt-8 flex justify-between items-end">
                <div className="text-slate-600 space-y-0.5 text-xs">
                  <p>Date: <span className="font-medium text-slate-800">{declaration?.date || new Date().toLocaleDateString('en-GB')}</span></p>
                  <p>Place: <span className="font-medium text-slate-800">{declaration?.place || 'Dhaka, Bangladesh'}</span></p>
                </div>
                <div className="border-t border-slate-400 pt-1.5 w-48 text-center text-slate-700">
                  <p className="font-bold">{declaration?.signatureName || personal.fullName || 'Signature'}</p>
                  <p className="text-[10px] text-slate-400 uppercase">Applicant's Signature</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
