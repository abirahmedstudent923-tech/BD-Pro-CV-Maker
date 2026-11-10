import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// Helper to get GoogleGenAI client
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') return null;
  try {
    return new GoogleGenAI();
  } catch {
    return null;
  }
};

// 1. AI Career Objective / Summary Generator
app.post(['/api/ai/objective', '/ai/objective'], async (req: Request, res: Response) => {
  try {
    const { role, industry, yearsOfExp, skills, language } = req.body;
    const ai = getAI();

    if (!ai) {
      const fallbackEnglish = [
        `Dynamic and results-driven ${role || 'Professional'} with ${yearsOfExp || '3+'} years of experience in the Bangladeshi ${industry || 'corporate'} sector. Adept in ${skills || 'strategic execution, problem-solving, and team leadership'}. Committed to driving operational excellence and contributing to organizational growth.`,
        `Motivated and detail-oriented ${role || 'Professional'} offering strong technical proficiency and proven expertise. Seeking an opportunity to leverage skills in modern industry workflows to deliver measurable value in high-performance environments.`,
        `Dedicated ${role || 'Specialist'} with a solid academic foundation and practical track record in Bangladesh. Passionate about innovation, process optimization, and collaborating with cross-functional teams to exceed organizational benchmarks.`,
      ];
      const fallbackBangla = [
        `বাংলাদেশের ${industry || 'কর্পোরেট'} খাতে ${yearsOfExp || '৩+'} বছরের বাস্তব অভিজ্ঞতাসম্পন্ন নিবেদিতপ্রাণ ${role || 'পেশাজীবী'}। ${skills || 'পরিকল্পনা প্রণয়ন, সমস্যা সমাধান ও দক্ষ দল পরিচালনায়'} পারদর্শী। প্রতিষ্ঠানের উত্তরোত্তর সাফল্যে কার্যকর অবদান রাখতে আগ্রহী।`,
        `দক্ষ ও দায়িত্বশীল ${role || 'প্রফেশনাল'}, যিনি সর্বদা গুণগত মান বজায় রেখে সময়োপযোগী ফলাফল প্রদানে বিশ্বাসী। প্রতিষ্ঠানের লক্ষ্য অর্জনে নিজের অভিজ্ঞতা ও মেধার সর্বোচ্চ প্রয়োগে অঙ্গীকারবদ্ধ।`,
        `উদ্ভাবনী মানসিকতাসম্পন্ন ${role || 'স্পেশালিস্ট'}, যিনি আধুনিক প্রযুক্তি ও নিয়মানুবর্তিতার সমন্বয়ে প্রতিষ্ঠানের অগ্রগতিতে সক্রিয় ভূমিকা পালন করতে চান।`,
      ];

      return res.json({
        options: language === 'bn' ? fallbackBangla : fallbackEnglish,
        source: 'preset',
      });
    }

    const isBangla = language === 'bn';
    const prompt = `You are an expert HR consultant and resume strategist specializing in the Bangladeshi job market (corporate, MNCs, banks, IT, and government/NGO sectors).
Generate 3 distinct, professional career objective options for a CV in ${isBangla ? 'Bengali (বাংলা)' : 'English'}.
Candidate Details:
- Target Role/Title: ${role || 'Professional'}
- Industry/Sector: ${industry || 'Corporate / General'}
- Years of Experience: ${yearsOfExp || 'Fresh Graduate / Early Career'}
- Key Skills: ${skills || 'Problem Solving, Teamwork, Communication'}

Guidelines:
- Each option should be 2 to 3 concise, punchy sentences.
- Tailored for high-standard Bangladeshi HR screening.
- Return ONLY a raw JSON array of 3 strings, no markdown wrapper. Example: ["Option 1...", "Option 2...", "Option 3..."]`;

    const responsePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 6000)
    );

    const response = (await Promise.race([responsePromise, timeoutPromise])) as any;
    let text = response.text?.trim() || '';
    if (text.startsWith('```json')) text = text.slice(7);
    if (text.startsWith('```')) text = text.slice(3);
    if (text.endsWith('```')) text = text.slice(0, -3);
    text = text.trim();

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return res.json({ options: parsed, source: 'ai' });
      }
    } catch {}

    const lines = text.split('\n\n').filter(Boolean).slice(0, 3);
    return res.json({ options: lines.length ? lines : [text], source: 'ai' });
  } catch (err: any) {
    const { role, industry, yearsOfExp, language } = req.body;
    const isBn = language === 'bn';
    const fallbackEnglish = [
      `Dynamic and results-driven ${role || 'Professional'} with ${yearsOfExp || '3+'} years of experience in the Bangladeshi ${industry || 'corporate'} sector. Adept in strategic execution, problem-solving, and team leadership. Committed to driving operational excellence and contributing to organizational growth.`,
      `Motivated and detail-oriented ${role || 'Professional'} offering strong technical proficiency and proven expertise. Seeking an opportunity to leverage skills in modern industry workflows to deliver measurable value in high-performance environments.`,
      `Dedicated ${role || 'Specialist'} with a solid academic foundation and practical track record in Bangladesh. Passionate about innovation, process optimization, and collaborating with cross-functional teams to exceed organizational benchmarks.`,
    ];
    const fallbackBangla = [
      `বাংলাদেশের ${industry || 'কর্পোরেট'} খাতে ${yearsOfExp || '৩+'} বছরের বাস্তব অভিজ্ঞতাসম্পন্ন নিবেদিতপ্রাণ ${role || 'পেশাজীবী'}। পরিকল্পনা প্রণয়ন, সমস্যা সমাধান ও দক্ষ দল পরিচালনায় পারদর্শী। প্রতিষ্ঠানের উত্তরোত্তর সাফল্যে কার্যকর অবদান রাখতে আগ্রহী।`,
      `দক্ষ ও দায়িত্বশীল ${role || 'প্রফেশনাল'}, যিনি সর্বদা গুণগত মান বজায় রেখে সময়োপযোগী ফলাফল প্রদানে বিশ্বাসী। প্রতিষ্ঠানের লক্ষ্য অর্জনে নিজের অভিজ্ঞতা ও মেধার সর্বোচ্চ প্রয়োগে অঙ্গীকারবদ্ধ।`,
      `উদ্ভাবনী মানসিকতাসম্পন্ন ${role || 'স্পেশালিস্ট'}, যিনি আধুনিক প্রযুক্তি ও নিয়মানুবর্তিতার সমন্বয়ে প্রতিষ্ঠানের অগ্রগতিতে সক্রিয় ভূমিকা পালন করতে চান।`,
    ];

    return res.json({
      options: isBn ? fallbackBangla : fallbackEnglish,
      source: 'preset',
    });
  }
});

// 2. AI Work Experience Bullet Enhancer
app.post(['/api/ai/bullet-polish', '/ai/bullet-polish'], async (req: Request, res: Response) => {
  try {
    const { textToPolish, role, company } = req.body;
    const ai = getAI();

    if (!ai) {
      const fallbacks = [
        `• Spearheaded core operations for ${role || 'the team'} at ${company || 'the organization'}, increasing workflow productivity by 25%.`,
        `• Collaborated with cross-functional stakeholders to ensure timely delivery of deliverables while upholding strict compliance standards.`,
        `• Analyzed performance metrics and implemented key process optimizations resulting in significant reduction in turnaround time.`,
      ];
      return res.json({ polished: fallbacks.join('\n'), source: 'preset' });
    }

    const prompt = `You are a professional resume writer for top companies in Bangladesh. 
Transform the following rough job responsibility description into 3-4 powerful, impact-driven bullet points using strong action verbs and quantified achievements where appropriate.

Role: ${role || 'Job Role'}
Company: ${company || 'Organization'}
Original input text:
"${textToPolish}"

Guidelines:
- Start every bullet with strong past-tense action verbs (e.g., "Led", "Engineered", "Optimized", "Spearheaded").
- Keep formatting clean with bullet characters ("• ").
- Return ONLY the bullet points text.`;

    const responsePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 6000)
    );

    const response = (await Promise.race([responsePromise, timeoutPromise])) as any;
    return res.json({ polished: response.text?.trim() || textToPolish, source: 'ai' });
  } catch (err: any) {
    const { textToPolish, role, company } = req.body;
    const fallbacks = [
      `• Spearheaded core operations for ${role || 'the team'} at ${company || 'the organization'}, increasing workflow productivity by 25%.`,
      `• Collaborated with cross-functional stakeholders to ensure timely delivery of deliverables while upholding strict compliance standards.`,
      `• Analyzed performance metrics and implemented key process optimizations resulting in significant reduction in turnaround time.`,
      textToPolish ? `• Effectively managed: ${textToPolish}` : '',
    ].filter(Boolean);

    return res.json({ polished: fallbacks.join('\n'), source: 'preset' });
  }
});

// 3. AI Cover Letter Generator
app.post(['/api/ai/cover-letter', '/ai/cover-letter'], async (req: Request, res: Response) => {
  try {
    const { candidateName, targetRole, companyName, hiringManager, experienceSummary, keySkills, language } = req.body;
    const ai = getAI();
    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    if (!ai) {
      const isBn = language === 'bn';
      const defaultLetter = isBn
        ? `তারিখ: ${currentDate}\n\nবরাবর,\n${hiringManager || 'ব্যবস্থাপনা পরিচালক / মানবসম্পদ বিভাগ'}\n${companyName || '[প্রতিষ্ঠানের নাম]'}\nঢাকা, বাংলাদেশ।\n\nবিষয়: "${targetRole || 'সংশ্লিষ্ট'}" পদের জন্য আবেদন পত্র।\n\nমহোদয়,\nবিনীত নিবেদন এই যে, আপনার স্বনামধন্য প্রতিষ্ঠানে "${targetRole || 'সংশ্লিষ্ট'}" পদে লোক নিয়োগের বিজ্ঞপ্তি সম্পর্কে জানতে পেরে আমি নিজেকে একজন আগ্রহী প্রার্থী হিসেবে উপস্থাপন করছি। সংশ্লিষ্ট কাজে আমার পেশাগত অভিজ্ঞতা ও দক্ষতা রয়েছে।\n\nআমার জীবনবৃত্তান্ত (CV) পর্যালোচনা করে আমাকে একটি মৌখিক সাক্ষাৎকারের সুযোগ প্রদান করলে বাধিত হব।\n\nধন্যবাদান্তে,\n${candidateName || 'আবেদনকারী'}`
        : `Date: ${currentDate}\n\nTo,\n${hiringManager || 'The Head of Human Resources'}\n${companyName || '[Company Name]'}\nDhaka, Bangladesh.\n\nSubject: Application for the position of "${targetRole || 'Professional Role'}".\n\nDear Sir/Madam,\n\nI am writing to express my eager interest in the "${targetRole || 'advertised'}" position at ${companyName || 'your esteemed organization'}. With my professional background and proven skills in ${keySkills || 'the domain'}, I am confident in my capacity to contribute meaningfully.\n\nEnclosed is my Curriculum Vitae (CV) for your kind review.\n\nSincerely yours,\n\n${candidateName || '[Full Name]'}`;

      return res.json({ letter: defaultLetter, source: 'preset' });
    }

    const isBn = language === 'bn';
    const prompt = `You are an expert executive cover letter writer specializing in Bangladeshi recruitment conventions.
Write a formal, courteous job application cover letter in ${isBn ? 'Bengali (বাংলা)' : 'English'}.
Candidate: ${candidateName || 'Candidate'}
Target Role: ${targetRole || 'Target Role'}
Company: ${companyName || 'Target Company'}
Hiring Authority: ${hiringManager || 'The Head of Human Resources'}
Key Qualifications: ${keySkills || 'Demonstrated domain expertise'}
Experience: ${experienceSummary || 'Demonstrated track record of performance'}

Format Guidelines:
- Date: ${currentDate}
- Address: ${hiringManager || 'The Head of HR'}, ${companyName || 'Company'}, Dhaka, Bangladesh
- Subject line, formal salutation, 3 structured paragraphs, sign-off.
- Return ONLY the letter text.`;

    const responsePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 6000)
    );

    const response = (await Promise.race([responsePromise, timeoutPromise])) as any;
    return res.json({ letter: response.text?.trim() || '', source: 'ai' });
  } catch (err: any) {
    const { candidateName, targetRole, companyName, hiringManager, keySkills, language } = req.body;
    const isBn = language === 'bn';
    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const fallback = isBn
      ? `তারিখ: ${currentDate}\n\nবরাবর,\n${hiringManager || 'ব্যবস্থাপনা পরিচালক / মানবসম্পদ বিভাগ'}\n${companyName || '[প্রতিষ্ঠানের নাম]'}\nঢাকা, বাংলাদেশ।\n\nবিষয়: "${targetRole || 'সংশ্লিষ্ট'}" পদের জন্য আবেদন পত্র।\n\nমহোদয়,\nবিনীত নিবেদন এই যে, আপনার প্রতিষ্ঠানে "${targetRole || 'সংশ্লিষ্ট'}" পদের জন্য আমি আবেদন করছি। সংশ্লিষ্ট কাজে আমার পেশাগত অভিজ্ঞতা ও দক্ষতা রয়েছে।\n\nধন্যবাদান্তে,\n${candidateName || 'আবেদনকারী'}`
      : `Date: ${currentDate}\n\nTo,\n${hiringManager || 'The Head of Human Resources'}\n${companyName || '[Company Name]'}\nDhaka, Bangladesh.\n\nSubject: Application for "${targetRole || 'Professional Role'}".\n\nDear Sir/Madam,\n\nI am writing to apply for the "${targetRole || 'advertised'}" position at ${companyName || 'your esteemed organization'}. With my competencies in ${keySkills || 'the domain'}, I am confident in my capacity to contribute.\n\nSincerely yours,\n\n${candidateName || '[Full Name]'}`;

    return res.json({ letter: fallback, source: 'preset' });
  }
});

export default app;
