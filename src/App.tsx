import React, { useState, useEffect } from 'react';
import { CVData, CVStyling, WorkExperience, Education, Certification, Project, Reference, DeclarationData, PersonalInfo } from './types/cv';
import { defaultCVData } from './data/defaultCV';
import { ROLE_PRESETS } from './data/presets';
import { Navbar } from './components/Navbar';
import { PersonalForm } from './components/Editor/PersonalForm';
import { ObjectiveForm } from './components/Editor/ObjectiveForm';
import { ExperienceForm } from './components/Editor/ExperienceForm';
import { EducationForm } from './components/Editor/EducationForm';
import { SkillsForm } from './components/Editor/SkillsForm';
import { CertificationsForm } from './components/Editor/CertificationsForm';
import { ProjectsForm } from './components/Editor/ProjectsForm';
import { ReferencesForm } from './components/Editor/ReferencesForm';
import { DeclarationForm } from './components/Editor/DeclarationForm';
import { CVPreview } from './components/Preview/CVPreview';
import { AIAssistantModal } from './components/AIAssistantModal';
import { CoverLetterModal } from './components/CoverLetterModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MobileInstallBanner } from './components/MobileInstallBanner';
import { SurveyGuideModal } from './components/SurveyGuideModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { PrintGuideModal } from './components/PrintGuideModal';
import {
  User,
  Target,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  FolderGit2,
  Users,
  FileSignature,
  ChevronDown,
  Eye,
  Sliders,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

const STORAGE_KEY = 'bd_pro_cv_maker_v2';

export default function App() {
  // Application Language: 'bn' (Bangla) or 'en' (English)
  const [lang, setLang] = useState<'bn' | 'en'>('bn');

  // Load from local storage or default sample data
  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved CV data:', e);
    }
    return defaultCVData;
  });

  // Active Accordion Tab in Left Sidebar
  const [activeTab, setActiveTab] = useState<string>('personal');

  // Modals
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [isCoverLetterOpen, setIsCoverLetterOpen] = useState<boolean>(false);
  const [isSurveyGuideOpen, setIsSurveyGuideOpen] = useState<boolean>(false);
  const [isPrintGuideOpen, setIsPrintGuideOpen] = useState<boolean>(false);

  // In-App Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // In-App Confirmation Modal State (replaces window.confirm)
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
    } catch (e) {
      console.warn('Failed to save CV data to localStorage:', e);
    }
  }, [cvData]);

  const isBn = lang === 'bn';

  // State Updaters
  const updatePersonal = (updated: Partial<PersonalInfo>) => {
    setCvData((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...updated },
    }));
  };

  const updateObjective = (objective: string) => {
    setCvData((prev) => ({ ...prev, objective }));
  };

  const updateExperiences = (experiences: WorkExperience[]) => {
    setCvData((prev) => ({ ...prev, experiences }));
  };

  const updateEducations = (educations: Education[]) => {
    setCvData((prev) => ({ ...prev, educations }));
  };

  const updateSkills = (skills: string[]) => {
    setCvData((prev) => ({ ...prev, skills }));
  };

  const updateCertifications = (certifications: Certification[]) => {
    setCvData((prev) => ({ ...prev, certifications }));
  };

  const updateProjects = (projects: Project[]) => {
    setCvData((prev) => ({ ...prev, projects }));
  };

  const updateReferences = (references: Reference[]) => {
    setCvData((prev) => ({ ...prev, references }));
  };

  const updateDeclaration = (updated: Partial<DeclarationData>) => {
    setCvData((prev) => ({
      ...prev,
      declaration: { ...prev.declaration, ...updated },
    }));
  };

  const updateStyling = (updated: Partial<CVStyling>) => {
    setCvData((prev) => ({
      ...prev,
      styling: { ...prev.styling, ...updated },
    }));
  };

  // Role Preset Applicator
  const handleApplyPreset = (presetId: string) => {
    const preset = ROLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setConfirmConfig({
      isOpen: true,
      title: isBn ? 'প্রিসেট তথ্য পূরণ করুন' : 'Load Role Preset',
      message: isBn
        ? `আপনি কি "${preset.labelBn}" রোলের ডাটা দিয়ে সিভি আপডেট করতে চান? বর্তমান সিভির বিবরণ ওভাররাইট হবে।`
        : `Do you want to auto-fill with the "${preset.labelEn}" preset? Current fields will be updated.`,
      confirmLabel: isBn ? 'হ্যাঁ, পূরণ করুন' : 'Yes, Apply',
      cancelLabel: isBn ? 'বাতিল' : 'Cancel',
      isDestructive: false,
      onConfirm: () => {
        setCvData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            ...(preset.data.personal || {}),
          },
          objective: preset.data.objective || prev.objective,
          experiences: preset.data.experiences || prev.experiences,
          educations: preset.data.educations || prev.educations,
          skills: preset.data.skills || prev.skills,
          certifications: preset.data.certifications || prev.certifications,
        }));
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(
          isBn ? `"${preset.labelBn}" প্রিসেট সফলভাবে যুক্ত হয়েছে!` : `"${preset.labelEn}" preset applied!`,
          'success'
        );
      },
    });
  };

  // Reset to empty
  const handleReset = () => {
    setConfirmConfig({
      isOpen: true,
      title: isBn ? 'সব তথ্য মুছে ফেলতে চান?' : 'Clear All Data?',
      message: isBn
        ? 'আপনি কি সব তথ্য মুছে নতুন করে শুরু করতে চান? এই প্রক্রিয়াটি আর ফেরত আনা যাবে না।'
        : 'Are you sure you want to clear all data and start fresh? This action cannot be undone.',
      confirmLabel: isBn ? 'হ্যাঁ, সব মুছুন' : 'Yes, Clear All',
      cancelLabel: isBn ? 'বাতিল' : 'Cancel',
      isDestructive: true,
      onConfirm: () => {
        setCvData({
          personal: {
            fullName: '',
            jobTitle: '',
            email: '',
            phone: '',
            photoUrl: '',
            showPhoto: true,
            presentAddress: '',
            permanentAddress: '',
            website: '',
            linkedin: '',
            github: '',
            fatherName: '',
            motherName: '',
            dob: '',
            nationality: 'Bangladeshi (By Birth)',
            nid: '',
            maritalStatus: 'Unmarried',
            religion: 'Islam',
            bloodGroup: 'B+ (Positive)',
            gender: 'Male',
          },
          objective: '',
          experiences: [],
          educations: [],
          skills: [],
          certifications: [],
          projects: [],
          references: [],
          declaration: {
            text: 'I do hereby declare that all information furnished above is true, complete and correct to the best of my knowledge and belief.',
            signatureName: '',
            place: 'Dhaka, Bangladesh',
            date: new Date().toLocaleDateString('en-GB'),
          },
          styling: {
            format: '2page',
            template: 'classic',
            primaryColor: '#006a4e',
            fontSize: 'normal',
            showBDPersonalDetails: true,
            showReferences: true,
            showDeclaration: true,
            showProjects: true,
            showCertifications: true,
          },
        });
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        showToast(isBn ? 'সব তথ্য মুছে ফেলা হয়েছে' : 'All CV data has been reset', 'info');
      },
    });
  };

  const handleLoadSample = () => {
    setCvData(defaultCVData);
    showToast(isBn ? 'নমুনা বাংলাদেশি সিভি লোড হয়েছে' : 'Sample Bangladeshi CV loaded', 'success');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cvData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${cvData.personal.fullName || 'Bangladeshi_CV'}_Backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(isBn ? 'JSON ব্যাকআপ ডাউনলোড হয়েছে' : 'JSON backup downloaded', 'success');
  };

  const handleImportJSON = (imported: CVData) => {
    setCvData(imported);
    showToast(isBn ? 'ডাটা সফলভাবে ইম্পোর্ট হয়েছে!' : 'CV Data successfully imported!', 'success');
  };

  // Accordion Section Definition
  const sections = [
    {
      id: 'personal',
      title: isBn ? 'ব্যক্তিগত তথ্য ও ঠিকানা (Personal Info)' : 'Personal Information & Contact',
      subtitle: isBn ? 'নাম, পদবী, যোগাযোগ, ছবি ও বাংলাদেশি বিবরণ' : 'Name, title, photo, NID & BD details',
      icon: User,
      component: <PersonalForm personal={cvData.personal} onChange={updatePersonal} lang={lang} />,
    },
    {
      id: 'objective',
      title: isBn ? 'ক্যারিয়ার অবজেক্টিভ (Career Objective)' : 'Career Objective / Summary',
      subtitle: isBn ? 'প্রফেশনাল বিবরণ ও লক্ষ্য' : 'Professional executive statement',
      icon: Target,
      component: (
        <ObjectiveForm
          objective={cvData.objective}
          onChange={updateObjective}
          lang={lang}
          onOpenAIAssistant={() => setIsAIOpen(true)}
        />
      ),
    },
    {
      id: 'experience',
      title: isBn ? 'কাজের অভিজ্ঞতা (Work Experience)' : 'Employment & Work Experience',
      subtitle: `${cvData.experiences.length} ${isBn ? 'টি পদবী যুক্ত' : 'positions added'}`,
      icon: Briefcase,
      component: <ExperienceForm experiences={cvData.experiences} onChange={updateExperiences} lang={lang} />,
    },
    {
      id: 'education',
      title: isBn ? 'শিক্ষাগত যোগ্যতা (Education Table)' : 'Educational Qualifications',
      subtitle: `${cvData.educations.length} ${isBn ? 'টি ডিগ্রী যুক্ত' : 'degrees added'}`,
      icon: GraduationCap,
      component: <EducationForm educations={cvData.educations} onChange={updateEducations} lang={lang} />,
    },
    {
      id: 'skills',
      title: isBn ? 'দক্ষতা ও কারিগরি পারদর্শিতা (Skills)' : 'Skills & Key Competencies',
      subtitle: `${cvData.skills.length} ${isBn ? 'টি স্কিল' : 'skills listed'}`,
      icon: Wrench,
      component: <SkillsForm skills={cvData.skills} onChange={updateSkills} lang={lang} />,
    },
    {
      id: 'projects',
      title: isBn ? 'প্রজেক্ট ও পোর্টফোলিও (Key Projects)' : 'Key Projects & Portfolio',
      subtitle: `${cvData.projects.length} ${isBn ? 'টি প্রজেক্ট' : 'projects'}`,
      icon: FolderGit2,
      component: <ProjectsForm projects={cvData.projects} onChange={updateProjects} lang={lang} />,
    },
    {
      id: 'certifications',
      title: isBn ? 'ট্রেনিং ও সার্টিফিকেশন (Certifications)' : 'Training & Certifications',
      subtitle: `${cvData.certifications.length} ${isBn ? 'টি সার্টিফিকেট' : 'certifications'}`,
      icon: Award,
      component: <CertificationsForm certifications={cvData.certifications} onChange={updateCertifications} lang={lang} />,
    },
    {
      id: 'references',
      title: isBn ? 'রেফারেন্স (References)' : 'Referees & Recommendations',
      subtitle: `${cvData.references.length} ${isBn ? 'জন রেফারেন্স' : 'references'}`,
      icon: Users,
      component: <ReferencesForm references={cvData.references} onChange={updateReferences} lang={lang} />,
    },
    {
      id: 'declaration',
      title: isBn ? 'স্বঘোষণা ও স্বাক্ষর (Declaration)' : 'Declaration & Signature Line',
      subtitle: isBn ? 'সত্যতা ঘোষণাপত্র ও স্বাক্ষর' : 'Formal affirmation statement',
      icon: FileSignature,
      component: <DeclarationForm declaration={cvData.declaration} onChange={updateDeclaration} lang={lang} />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        cvData={cvData}
        onUpdateStyling={updateStyling}
        onApplyPreset={handleApplyPreset}
        onOpenCoverLetter={() => setIsCoverLetterOpen(true)}
        onOpenAIAssistant={() => setIsAIOpen(true)}
        onOpenSurveyGuide={() => setIsSurveyGuideOpen(true)}
        onReset={handleReset}
        onLoadSample={handleLoadSample}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onToast={showToast}
        onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
      />

      {/* Prominent Mobile PWA Install Banner */}
      <MobileInstallBanner lang={lang} />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 md:p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Form Editor Accordions (No-Print) */}
        <section className="lg:w-1/2 w-full flex flex-col gap-4 no-print max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
          
          {/* Online Survey Earning Hub Quick Card */}
          <div className="bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/10 p-3.5 rounded-xl border border-amber-300/60 shadow-xs flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                ৳
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">
                  {isBn ? 'অনলাইন সার্ভে আর্ন গাইড ও ক্যালকুলেটর' : 'Online Survey Earning Hub & Calculator'}
                </p>
                <p className="text-[11px] text-slate-600 truncate">
                  {isBn ? 'বাংলাদেশ থেকে বৈধ সার্ভে সাইট ও বিকাশে টাকা তোলার নিয়মাবলী' : 'Verified survey platforms and withdrawal steps for Bangladesh'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsSurveyGuideOpen(true)}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs shrink-0 transition"
            >
              <span>{isBn ? 'গাইড দেখুন' : 'View Guide'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section Visibility & Layout Controls Card */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>{isBn ? 'সেকশন দৃশ্যমানতা (Sections Display):' : 'Section Toggles:'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={cvData.styling.showBDPersonalDetails}
                  onChange={(e) => updateStyling({ showBDPersonalDetails: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className="text-[11px] font-medium">{isBn ? 'ব্যক্তিগত তথ্য' : 'BD Details'}</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={cvData.styling.showReferences}
                  onChange={(e) => updateStyling({ showReferences: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className="text-[11px] font-medium">{isBn ? 'রেফারেন্স' : 'References'}</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={cvData.styling.showProjects}
                  onChange={(e) => updateStyling({ showProjects: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className="text-[11px] font-medium">{isBn ? 'প্রজেক্ট' : 'Projects'}</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={cvData.styling.showDeclaration}
                  onChange={(e) => updateStyling({ showDeclaration: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className="text-[11px] font-medium">{isBn ? 'স্বঘোষণা' : 'Declaration'}</span>
              </label>
            </div>
          </div>

          {/* Form Accordion Stack */}
          <div className="space-y-3">
            {sections.map((sec) => {
              const IconComp = sec.icon;
              const isOpen = activeTab === sec.id;

              return (
                <div
                  key={sec.id}
                  className="bg-white rounded-xl shadow-xs border border-slate-200/90 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab(isOpen ? '' : sec.id)}
                    className="w-full flex items-center justify-between p-3.5 text-left font-semibold text-slate-800 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                          isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-xs md:text-sm font-bold text-slate-900">{sec.title}</h2>
                        <p className="text-[11px] text-slate-500 font-normal">{sec.subtitle}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-700' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-4 border-t border-slate-100 bg-white">
                      {sec.component}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </section>

        {/* Right Column: Live A4 Preview Canvas */}
        <section className="lg:w-1/2 w-full flex flex-col items-center">
          <CVPreview
            data={cvData}
            lang={lang}
            onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
          />
        </section>

      </main>

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        cvData={cvData}
        onApplyObjective={(obj) => {
          updateObjective(obj);
          setIsAIOpen(false);
          showToast(isBn ? 'অবজেক্টিভ সিভিতে যুক্ত হয়েছে!' : 'Objective applied to CV!', 'success');
        }}
        lang={lang}
      />

      {/* Cover Letter Modal */}
      <CoverLetterModal
        isOpen={isCoverLetterOpen}
        onClose={() => setIsCoverLetterOpen(false)}
        cvData={cvData}
        lang={lang}
      />

      {/* Online Survey Earning Hub Modal */}
      <SurveyGuideModal
        isOpen={isSurveyGuideOpen}
        onClose={() => setIsSurveyGuideOpen(false)}
        lang={lang}
      />

      {/* Print & PDF Export Guide Modal */}
      <PrintGuideModal
        isOpen={isPrintGuideOpen}
        onClose={() => setIsPrintGuideOpen(false)}
        onProceedPrint={() => window.print()}
        lang={lang}
      />

      {/* Custom In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        cancelLabel={confirmConfig.cancelLabel}
        isDestructive={confirmConfig.isDestructive}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* In-App Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Offline Mode Toast Indicator */}
      <OfflineIndicator lang={lang} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500 no-print">
        <p>
          {isBn
            ? 'বাংলাদেশের স্ট্যান্ডার্ড অনুযায়ী প্রফেশনাল সিভি ও রেজুমে মেকার | BD Pro CV & Resume Maker'
            : 'Tailored for Bangladeshi corporate, banking, government, and tech recruitments.'}
        </p>
      </footer>

    </div>
  );
}
