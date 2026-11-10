export interface WorkExperience {
  id: string;
  company: string;
  designation: string;
  employmentType?: string;
  duration: string;
  location: string;
  details: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  boardOrUniversity: string;
  year: string;
  result: string;
  majorOrGroup?: string;
}

export interface Reference {
  id: string;
  name: string;
  designation: string;
  organization: string;
  phone: string;
  email: string;
  relationship?: string;
}

export interface Project {
  id: string;
  title: string;
  role: string;
  technologies: string;
  link: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  institution: string;
  year: string;
}

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  photoUrl: string;
  showPhoto: boolean;
  presentAddress: string;
  website: string;
  linkedin: string;
  github: string;

  // Bangladeshi Standard Details
  fatherName: string;
  motherName: string;
  dob: string;
  nationality: string;
  nid: string;
  maritalStatus: 'Unmarried' | 'Married' | 'Other';
  religion: string;
  bloodGroup: string;
  gender: 'Male' | 'Female' | 'Other';
  permanentAddress: string;
}

export interface CVStyling {
  format: '1page' | '2page';
  template: 'classic' | 'modern' | 'corporate' | 'academic';
  primaryColor: string;
  fontSize: 'compact' | 'normal' | 'relaxed';
  showBDPersonalDetails: boolean;
  showReferences: boolean;
  showDeclaration: boolean;
  showProjects: boolean;
  showCertifications: boolean;
}

export interface DeclarationData {
  text: string;
  signatureName: string;
  place: string;
  date: string;
}

export interface CVData {
  personal: PersonalInfo;
  objective: string;
  experiences: WorkExperience[];
  educations: Education[];
  skills: string[];
  certifications: Certification[];
  projects: Project[];
  references: Reference[];
  declaration: DeclarationData;
  styling: CVStyling;
}
