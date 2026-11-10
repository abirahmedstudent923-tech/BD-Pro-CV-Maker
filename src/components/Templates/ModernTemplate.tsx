import React from 'react';
import { CVData } from '../../types/cv';
import { Mail, Phone, Globe, MapPin, Linkedin, Github } from 'lucide-react';

interface Props {
  data: CVData;
}

export const ModernTemplate: React.FC<Props> = ({ data }) => {
  const { personal, objective, experiences, educations, skills, certifications, projects, references, declaration, styling } = data;
  const isTwoPage = styling.format === '2page';
  const primaryColor = styling.primaryColor || '#006a4e';

  return (
    <div className={`bg-white text-slate-800 text-xs md:text-sm leading-relaxed ${styling.fontSize === 'compact' ? 'text-[11px] leading-snug' : styling.fontSize === 'relaxed' ? 'text-[13px] leading-normal' : ''}`}>
      
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex-1">
          <div className="inline-block px-2.5 py-0.5 rounded text-[11px] uppercase tracking-widest font-semibold text-emerald-300 bg-emerald-950/80 mb-2 border border-emerald-800/60">
            Curriculum Vitae
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-1">
            {personal.fullName || 'আপনার নাম (Your Name)'}
          </h1>
          <p className="text-sm md:text-base font-medium text-emerald-400">
            {personal.jobTitle || 'পদবী (Designation)'}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-300 mt-4 pt-3 border-t border-slate-800">
            {personal.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> {personal.phone}
              </span>
            )}
            {personal.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> {personal.email}
              </span>
            )}
            {personal.website && (
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" /> {personal.website}
              </span>
            )}
            {personal.linkedin && (
              <span className="flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-emerald-400" /> {personal.linkedin}
              </span>
            )}
            {personal.github && (
              <span className="flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-emerald-400" /> {personal.github}
              </span>
            )}
            {personal.presentAddress && (
              <span className="flex items-center gap-1.5 w-full mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {personal.presentAddress}
              </span>
            )}
          </div>
        </div>

        {/* Optional Avatar */}
        {personal.showPhoto && personal.photoUrl && (
          <div className="shrink-0">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 border-emerald-400/80 shadow-md">
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

      {/* Main Body */}
      <div className="p-8 md:p-10 space-y-6">
        
        {/* Profile / Summary */}
        {objective && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              Professional Profile
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">{objective}</p>
          </div>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              Experience & History
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <h3 className="font-bold text-slate-900 text-xs md:text-sm">{exp.designation}</h3>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200/60">
                      {exp.duration}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium text-xs mt-0.5">
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </p>
                  {exp.details && (
                    <div className="text-slate-600 text-xs mt-1.5 whitespace-pre-line leading-relaxed">
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
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {educations.map((edu) => (
                <div key={edu.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                  <h3 className="font-bold text-slate-900 text-xs">{edu.degree}</h3>
                  <p className="text-slate-600 text-[11px] mt-0.5">{edu.institution}</p>
                  {edu.boardOrUniversity && <p className="text-slate-500 text-[11px]">Board/Univ: {edu.boardOrUniversity}</p>}
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-200">
                    <span>Year: {edu.year}</span>
                    <span className="font-semibold text-slate-800">{edu.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              Key Competencies
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-slate-900 text-white text-[11px] font-medium px-3 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects (if shown) */}
        {styling.showProjects && projects && projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              Featured Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 rounded-lg border border-slate-200 bg-white">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{proj.title}</span>
                    {proj.link && <span className="text-[11px] text-emerald-600 font-normal">{proj.link}</span>}
                  </div>
                  {proj.technologies && <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{proj.technologies}</p>}
                  {proj.description && <p className="text-slate-600 text-xs mt-1">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {styling.showCertifications && certifications && certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              Certifications & Training
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {certifications.map((c) => (
                <div key={c.id} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <p className="font-semibold text-slate-900 text-xs">{c.name}</p>
                  <p className="text-slate-500 text-[11px]">{c.institution} {c.year ? `• ${c.year}` : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PAGE 2 CONTENT (FOR 2-PAGE FORMAT) --- */}
        {isTwoPage && (
          <>
            {/* Screen Only Visual Page Break Indicator */}
            <div className="no-print my-6 border-t-2 border-dashed border-slate-300 pt-4 text-center text-xs text-slate-400 font-medium select-none">
              —— Page 2 (Bangladeshi Official Details & References) ——
            </div>

            {/* Print Only Hard Page Break */}
            <div className="print-only page-break" style={{ pageBreakBefore: 'always', breakBefore: 'page' }} />

            {/* Bangladeshi Specific Personal Details */}
            {styling.showBDPersonalDetails && (
              <div className="avoid-break">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                  Personal Information (Bangladesh Standard)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs">
                  <div><span className="text-slate-500">Father's Name:</span> <span className="font-semibold text-slate-800 ml-1">{personal.fatherName || '—'}</span></div>
                  <div><span className="text-slate-500">Mother's Name:</span> <span className="font-semibold text-slate-800 ml-1">{personal.motherName || '—'}</span></div>
                  <div><span className="text-slate-500">Date of Birth:</span> <span className="font-semibold text-slate-800 ml-1">{personal.dob || '—'}</span></div>
                  <div><span className="text-slate-500">Nationality:</span> <span className="font-semibold text-slate-800 ml-1">{personal.nationality || 'Bangladeshi'}</span></div>
                  <div><span className="text-slate-500">NID No:</span> <span className="font-semibold font-mono text-slate-800 ml-1">{personal.nid || '—'}</span></div>
                  <div><span className="text-slate-500">Gender / Marital:</span> <span className="font-semibold text-slate-800 ml-1">{personal.gender || '—'} / {personal.maritalStatus || '—'}</span></div>
                  <div><span className="text-slate-500">Religion:</span> <span className="font-semibold text-slate-800 ml-1">{personal.religion || '—'}</span></div>
                  <div><span className="text-slate-500">Blood Group:</span> <span className="font-semibold text-slate-800 ml-1">{personal.bloodGroup || '—'}</span></div>
                  <div className="md:col-span-2 pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Permanent Address:</span> <span className="font-semibold text-slate-800 ml-1">{personal.permanentAddress || '—'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* References */}
            {styling.showReferences && references && references.length > 0 && (
              <div className="avoid-break">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                  References
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {references.map((r) => (
                    <div key={r.id} className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-sm text-xs">
                      <h3 className="font-bold text-slate-900">{r.name}</h3>
                      <p className="text-slate-600 text-[11px] mt-0.5">{r.designation}, <span className="font-medium">{r.organization}</span></p>
                      {r.phone && <p className="text-slate-500 text-[11px] mt-1.5"><span className="font-medium text-slate-700">Phone:</span> {r.phone}</p>}
                      {r.email && <p className="text-slate-500 text-[11px]"><span className="font-medium text-slate-700">Email:</span> {r.email}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Declaration */}
            {styling.showDeclaration && (
              <div className="pt-6 border-t border-slate-200 text-xs avoid-break">
                <p className="font-semibold text-slate-800 mb-1">Declaration:</p>
                <p className="text-slate-600 text-justify">
                  {declaration?.text || 'I do hereby declare that all information provided in this Curriculum Vitae is true and accurate to the best of my knowledge.'}
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
    </div>
  );
};
