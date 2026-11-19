import express, { Request, Response } from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('AI request timeout')), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function generateWithGemini(
  ai: GoogleGenAI,
  contents: string,
  jsonSchema?: Record<string, any>
): Promise<string> {
  const attempts: Array<{ model: string; config?: Record<string, any>; timeoutMs: number }> = [
    {
      model: 'gemini-4-hydrogen',
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        ...(jsonSchema ? { responseMimeType: 'application/json', responseSchema: jsonSchema } : {}),
      },
      timeoutMs: 9000,
    },
    {
      model: 'gemini-3.1-flash-lite',
      config: jsonSchema ? { responseMimeType: 'application/json', responseSchema: jsonSchema } : undefined,
      timeoutMs: 9000,
    },
  ];

  let lastError: unknown;
  for (const attempt of attempts) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: attempt.model,
          contents,
          ...(attempt.config ? { config: attempt.config } : {}),
        }),
        attempt.timeoutMs
      );
      const text = response.text?.trim();
      if (text) return text;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('AI generation unavailable');
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: '10mb' }));

  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') return null;
    try {
      return new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch {
      return null;
    }
  };

  // 1. AI Career Objective / Summary Generator
  app.post('/api/ai/objective', async (req: Request, res: Response) => {
    const { role, industry, yearsOfExp, skills, language } = req.body || {};
    const isBn = language === 'bn';
    const fallbackEnglish = [
      `Dynamic and results-driven ${role || 'Professional'} with ${yearsOfExp || '3+'} years of experience in the Bangladeshi ${industry || 'corporate'} sector. Adept in ${skills || 'strategic execution, problem-solving, and team leadership'}. Committed to driving operational excellence and contributing to organizational growth.`,
      `Motivated and detail-oriented ${role || 'Professional'} offering strong technical proficiency and proven expertise. Seeking an opportunity to leverage skills in ${skills || 'modern industry workflows'} to deliver measurable value in high-performance environments.`,
      `Dedicated ${role || 'Specialist'} with a solid academic foundation and practical track record in Bangladesh. Passionate about innovation, process optimization, and collaborating with cross-functional teams to exceed organizational benchmarks.`
    ];
    const fallbackBangla = [
      `বাংলাদেশের ${industry || 'কর্পোরেট'} খাতে ${yearsOfExp || '৩+'} বছরের বাস্তব অভিজ্ঞতাসম্পন্ন নিবেদিতপ্রাণ ${role || 'পেশাজীবী'}। ${skills || 'পরিকল্পনা প্রণয়ন, সমস্যা সমাধান ও দক্ষ দল পরিচালনায়'} পারদর্শী। প্রতিষ্ঠানের উত্তরোত্তর সাফল্যে কার্যকর অবদান রাখতে আগ্রহী।`,
      `দক্ষ ও দায়িত্বশীল ${role || 'প্রফেশনাল'}, যিনি সর্বদা গুণগত মান বজায় রেখে সময়োপযোগী ফলাফল প্রদানে বিশ্বাসী। প্রতিষ্ঠানের লক্ষ্য অর্জনে নিজের অভিজ্ঞতা ও মেধার সর্বোচ্চ প্রয়োগে অঙ্গীকারবদ্ধ।`,
      `উদ্ভাবনী মানসিকতাসম্পন্ন ${role || 'স্পেশালিস্ট'}, যিনি আধুনিক প্রযুক্তি ও নিয়মানুবর্তিতার সমন্বয়ে প্রতিষ্ঠানের অগ্রগতিতে সক্রিয় ভূমিকা পালন করতে চান।`
    ];

    try {
      const ai = getAI();
      if (!ai) {
        return res.json({ options: isBn ? fallbackBangla : fallbackEnglish, source: 'preset' });
      }

      const prompt = `You are an expert HR consultant and resume strategist specializing in the Bangladeshi job market (corporate, MNCs, banks, IT, and government/NGO sectors).
Generate 3 distinct, professional career objective options for a CV in ${isBn ? 'Bengali (বাংলা)' : 'English'}.
Candidate Details:
- Target Role/Title: ${role || 'Professional'}
- Industry/Sector: ${industry || 'Corporate / General'}
- Years of Experience: ${yearsOfExp || 'Fresh Graduate / Early Career'}
- Key Skills: ${skills || 'Problem Solving, Teamwork, Communication'}

Guidelines:
- Each option should be 2 to 3 concise, punchy sentences.
- Tailored for high-standard Bangladeshi HR screening (e.g. Bdjobs, MNCs, leading groups of companies).
- Return ONLY a raw JSON array of 3 strings.`;

      let text = await generateWithGemini(ai, prompt, {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      });

      if (text.startsWith('```json')) text = text.slice(7);
      if (text.startsWith('```')) text = text.slice(3);
      if (text.endsWith('```')) text = text.slice(0, -3);
      text = text.trim();

      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json({ options: parsed, source: 'ai' });
        }
      } catch {
        // Fallback to line splitting below
      }

      const lines = text.split('\n\n').filter(Boolean).slice(0, 3);
      return res.json({ options: lines.length ? lines : [text], source: 'ai' });
    } catch {
      return res.json({ options: isBn ? fallbackBangla : fallbackEnglish, source: 'preset' });
    }
  });

  // 2. AI Work Experience Bullet Enhancer
  app.post('/api/ai/bullet-polish', async (req: Request, res: Response) => {
    const { textToPolish, role, company } = req.body || {};
    const fallbacks = [
      `• Spearheaded core operations for ${role || 'the team'} at ${company || 'the organization'}, increasing workflow productivity by 25%.`,
      `• Collaborated with cross-functional stakeholders to ensure timely delivery of deliverables while upholding strict compliance standards.`,
      `• Analyzed performance metrics and implemented key process optimizations resulting in significant reduction in turnaround time.`,
      textToPolish ? `• Effectively managed: ${textToPolish}` : '',
    ].filter(Boolean);

    try {
      const ai = getAI();
      if (!ai) {
        return res.json({ polished: fallbacks.join('\n'), source: 'preset' });
      }

      const prompt = `You are a professional resume writer for top companies in Bangladesh. 
Transform the following rough job responsibility description into 3-4 powerful, impact-driven bullet points using strong action verbs and quantified achievements where appropriate.

Role: ${role || 'Job Role'}
Company: ${company || 'Organization'}
Original input text:
"${textToPolish || ''}"

Guidelines:
- Start every bullet with strong past-tense action verbs (e.g., "Led", "Engineered", "Optimized", "Spearheaded", "Reconciled", "Designed").
- Keep formatting clean with bullet characters ("• ").
- Highlight measurable results, cost savings, or efficiency gains.
- Return ONLY the bullet points text.`;

      const text = await generateWithGemini(ai, prompt);
      return res.json({ polished: text || textToPolish, source: 'ai' });
    } catch {
      return res.json({ polished: fallbacks.join('\n'), source: 'preset' });
    }
  });

  // 3. AI Cover Letter Generator (Bangladeshi Corporate/Official Format)
  app.post('/api/ai/cover-letter', async (req: Request, res: Response) => {
    const { candidateName, targetRole, companyName, hiringManager, experienceSummary, keySkills, language } =
      req.body || {};
    const isBn = language === 'bn';
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const fallbackLetter = isBn
      ? `তারিখ: ${currentDate}

বরাবর,
${hiringManager || 'ব্যবস্থাপনা পরিচালক / মানবসম্পদ বিভাগ'}
${companyName || '[প্রতিষ্ঠানের নাম]'}
ঢাকা, বাংলাদেশ।

বিষয়: "${targetRole || '[পদের নাম]'}" পদের জন্য আবেদন পত্র।

মহোদয়,
বিনীত নিবেদন এই যে, আপনার স্বনামধন্য প্রতিষ্ঠানে "${targetRole || 'সংশ্লিষ্ট'}" পদে লোক নিয়োগের বিজ্ঞপ্তি সম্পর্কে জানতে পেরে আমি নিজেকে একজন আগ্রহী প্রার্থী হিসেবে উপস্থাপন করছি।

আমি সংশ্লিষ্ট ক্ষেত্রে অভিজ্ঞতা ও প্রয়োজনীয় দক্ষতা অর্জন করেছি। ${keySkills ? `বিশেষ করে ${keySkills} সম্পর্কিত কাজে আমার কার্যকর দক্ষতা রয়েছে।` : ''} ইতিপূর্বে দায়িত্বশীলতার সাথে বিভিন্ন প্রকল্পে কাজ করার বাস্তব অভিজ্ঞতা আমার রয়েছে। আপনার প্রতিষ্ঠানে যুক্ত হওয়ার সুযোগ পেলে আমি সততা ও নিষ্ঠার সাথে দায়িত্ব পালন করতে প্রস্তুত।

আমার বিস্তারিত জীবনবৃত্তান্ত (CV) ও প্রয়োজনীয় কাগজপত্র এই আবেদনের সাথে সংযুক্ত করা হলো। আমার আবেদনটি বিবেচনা করে আমাকে মৌখিক পরীক্ষার সুযোগ প্রদান করলে অত্যন্ত বাধিত হব।

ধন্যবাদান্তে,
${candidateName || 'আপনার নাম'}
মোবাইল: [আপনার ফোন নম্বর]
ইমেইল: [আপনার ইমেইল ঠিকানা]`
      : `Date: ${currentDate}

To,
${hiringManager || 'The Head of Human Resources / Managing Director'}
${companyName || '[Company Name]'}
Dhaka, Bangladesh.

Subject: Application for the position of "${targetRole || 'Professional Role'}".

Dear Sir/Madam,

I am writing to express my strong interest in the "${targetRole || 'advertised'}" position at ${companyName || 'your esteemed organization'}, as advertised. With my professional background and proven skills in ${keySkills || 'the domain'}, I am confident in my ability to make a meaningful and immediate contribution to your team.

${experienceSummary || 'Throughout my professional career, I have consistently focused on delivering high-quality results, optimizing operational workflows, and collaborating effectively in team settings.'} I possess a solid work ethic and a commitment to continuous learning that aligns well with the high standards of your organization.

Enclosed is my Curriculum Vitae (CV) for your kind review. I would welcome the opportunity to discuss my qualifications and enthusiasm for this role in an interview.

Thank you very much for your time and consideration.

Sincerely yours,

${candidateName || '[Your Full Name]'}
Contact: [Your Mobile Number]
Email: [Your Email Address]`;

    try {
      const ai = getAI();
      if (!ai) {
        return res.json({ letter: fallbackLetter, source: 'preset' });
      }

      const prompt = `You are an expert executive cover letter writer specializing in Bangladeshi professional recruitment conventions (MNCs, Banks, Corporate Conglomerates, and IT firms).
Write a formal, courteous, and compelling job application cover letter in ${isBn ? 'Bengali (বাংলা)' : 'English'}.

Candidate: ${candidateName || 'Candidate'}
Target Role: ${targetRole || 'Target Role'}
Company: ${companyName || 'Target Company'}
Hiring Authority: ${hiringManager || 'The Head of Human Resources'}
Key Qualifications & Skills: ${keySkills || 'Demonstrated domain expertise'}
Experience Highlights: ${experienceSummary || 'Demonstrated track record of performance'}

Format Guidelines:
- Follow standard formal Bangladeshi corporate letter layout:
  1. Date: ${currentDate}
  2. Addressed to: ${hiringManager || 'The Head of Human Resources'}, ${companyName || 'Company'}, Dhaka, Bangladesh
  3. Formal Subject line
  4. Respectful Salutation
  5. 3 structured paragraphs (Opening & intention, Value proposition/skills with concrete highlights, Call to interview & closing gratitude)
  6. Formal sign-off with candidate name and placeholders for contact.
- Tone: Highly respectful, confident, professional, and grammatically impeccable.
- Return ONLY the cover letter text, no markdown meta-talk.`;

      const text = await generateWithGemini(ai, prompt);
      return res.json({ letter: text || fallbackLetter, source: 'ai' });
    } catch {
      return res.json({ letter: fallbackLetter, source: 'preset' });
    }
  });

  // 4. AI ATS & Job Circular Review Endpoint
  app.post('/api/ai/ats-review', async (req: Request, res: Response) => {
    const { cvData, jobDescription, language } = req.body || {};
    const isBn = language === 'bn';

    const buildDeterministicReview = () => {
      const skills: string[] = Array.isArray(cvData?.skills) ? cvData.skills : [];
      const hasObjective = Boolean(cvData?.objective && cvData.objective.trim().length > 30);
      const expCount = Array.isArray(cvData?.experiences) ? cvData.experiences.length : 0;
      const eduCount = Array.isArray(cvData?.educations) ? cvData.educations.length : 0;

      const strengths: string[] = [];
      const improvements: string[] = [];

      if (hasObjective) {
        strengths.push(isBn ? 'ক্যারিয়ার অবজেক্টিভ স্পষ্টভাবে লেখা আছে' : 'Clear career objective statement present');
      } else {
        improvements.push(isBn ? 'সংক্ষিপ্ত ও লক্ষ্যভিত্তিক ক্যারিয়ার অবজেক্টিভ যুক্ত করুন' : 'Add a concise 2-3 sentence career objective tailored to the target role');
      }
      if (expCount > 0) {
        strengths.push(isBn ? `${expCount}টি কাজের অভিজ্ঞতা অন্তর্ভুক্ত রয়েছে` : `${expCount} work experience entries documented`);
      } else {
        improvements.push(isBn ? 'অভিজ্ঞতা বা প্রজেক্টের কাজে সংখ্যাগত ফলাফল (যেমন % বৃদ্ধি) উল্লেখ করুন' : 'Include internships, volunteer roles, or measurable project outcomes');
      }
      if (skills.length >= 6) {
        strengths.push(isBn ? `${skills.length}টি মূল দক্ষতা (Keywords) সুন্দরভাবে তালিকাভুক্ত` : `${skills.length} core skill keywords listed for ATS parsing`);
      } else {
        improvements.push(isBn ? 'অন্তত ৬-১০টি চাকরি-সংশ্লিষ্ট টেকনিক্যাল ও সফট স্কিল যুক্ত করুন' : 'Expand Skills list to 6-10 role-specific keywords from the circular');
      }
      if (eduCount > 0) {
        strengths.push(isBn ? 'বাংলাদেশি স্ট্যান্ডার্ড শিক্ষাগত যোগ্যতার বিবরণ সম্পূর্ণ' : 'Structured educational credentials included');
      }
      if (!cvData?.personal?.linkedin) {
        improvements.push(isBn ? 'LinkedIn প্রোফাইল লিংক যুক্ত করলে কর্পোরেট রিক্রুটারদের বিশ্বাসযোগ্যতা বাড়ে' : 'Add your LinkedIn profile URL for recruiter verification');
      }

      const jdLower = (jobDescription || '').toLowerCase();
      const suggestedKeywords = ['Communication', 'Teamwork', 'MS Excel', 'Project Management', 'Leadership', 'Problem Solving', 'Analytical Skills']
        .filter((kw) => (!jdLower || jdLower.includes(kw.toLowerCase())) && !skills.some((s) => s.toLowerCase() === kw.toLowerCase()))
        .slice(0, 5);

      return {
        summary: isBn
          ? 'আপনার সিভির গঠন বাংলাদেশি কর্পোরেট ও ATS স্ক্রিনিংয়ের জন্য উপযোগী। নিচের পরামর্শগুলো প্রয়োগ করলে ইন্টারভিউ কল পাওয়ার সম্ভাবনা আরও বাড়বে।'
          : 'Your CV structure aligns well with Bangladeshi corporate & ATS standards. Addressing the quick suggestions below will improve your shortlist rate.',
        strengths,
        improvements,
        suggestedKeywords,
        source: 'analyzer',
      };
    };

    try {
      const ai = getAI();
      if (!ai) {
        return res.json(buildDeterministicReview());
      }

      const prompt = `You are a senior Bangladeshi Corporate HR Manager and ATS (Applicant Tracking System) auditor.
Analyze the candidate CV against the target Job Circular below and respond in ${isBn ? 'Bengali (বাংলা)' : 'English'}.

Candidate Role: ${cvData?.personal?.jobTitle || 'Not specified'}
Objective: ${cvData?.objective || 'None'}
Skills: ${(cvData?.skills || []).join(', ')}
Experience Count: ${(cvData?.experiences || []).length}
Education Count: ${(cvData?.educations || []).length}

Target Job Circular / Description:
"${(jobDescription || 'General Corporate / Tech Role in Bangladesh').slice(0, 1800)}"

Return ONLY valid JSON with exact keys:
{
  "summary": "2 concise sentences evaluating overall readiness",
  "strengths": ["2-3 specific strengths"],
  "improvements": ["2-4 actionable fixes"],
  "suggestedKeywords": ["3-5 missing relevant skill keywords in English"]
}`;

      let text = await generateWithGemini(ai, prompt, {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['summary', 'strengths', 'improvements', 'suggestedKeywords'],
      });

      if (text.startsWith('```json')) text = text.slice(7);
      if (text.startsWith('```')) text = text.slice(3);
      if (text.endsWith('```')) text = text.slice(0, -3);
      text = text.trim();

      const parsed = JSON.parse(text);
      return res.json({
        summary: parsed.summary || buildDeterministicReview().summary,
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
        suggestedKeywords: Array.isArray(parsed.suggestedKeywords) ? parsed.suggestedKeywords : [],
        source: 'ai',
      });
    } catch {
      return res.json(buildDeterministicReview());
    }
  });

  // Serve static assets or mount Vite middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
        ws: isHmrDisabled ? false : undefined,
      },
      appType: 'spa',
    });

    if (isHmrDisabled) {
      app.get('/@vite/client', async (_req, res, next) => {
        try {
          const result = await vite.transformRequest('/@vite/client');
          if (!result) return next();
          const safeCode = result.code
            .replace(
              'transport.connect(createHMRHandler(handleMessage));',
              '/* WebSocket HMR connection skipped when DISABLE_HMR=true */'
            )
            .replace(
              'else throw new SendBeforeConnectError("send was called before connect");',
              'else return;'
            )
            .replace(
              'else throw new SendBeforeConnectError("invoke was called before connect");',
              'else return;'
            );
          res.status(200).type('application/javascript').send(safeCode);
        } catch (err) {
          next(err);
        }
      });
    }

    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
