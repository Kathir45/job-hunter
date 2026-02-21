import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateJobsWithGemini = async (count = 10) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Search the internet and find ${count} REAL job openings that are currently active. 
    Focus on tech jobs from real job boards like LinkedIn, Indeed, Glassdoor, Dice, or company websites.
    
    Return a JSON array with the following structure for each job. Make sure all data is real and verified:
    
    [
      {
        "title": "Job Title",
        "company": "Company Name",
        "description": "2-3 sentence job description",
        "url": "https://real-job-board.com/jobs/job-id",
        "salary": {
          "from": 50000,
          "to": 80000,
          "currency": "USD"
        },
        "experience": "2-5 years",
        "jobType": "Full-time",
        "location": "City, Country",
        "skills": ["Skill1", "Skill2", "Skill3"],
        "postedDate": "2026-02-18",
        "deadline": "2026-03-18"
      }
    ]
    
    IMPORTANT REQUIREMENTS:
    - ONLY include REAL, VERIFIED job openings from major job boards
    - Include actual company names (not made-up ones)
    - Provide real URLs to actual job postings
    - Salary information should be from actual postings or realistic market rates
    - Include diverse job titles and locations across different countries
    - Experience levels should vary (entry-level to senior)
    - Vary job types (Full-time, Part-time, Freelance, Contract)
    - Skills should be relevant and in-demand
    - Deadlines should be realistic (7-30 days from today)
    - Use YYYY-MM-DD format for all dates
    - Locations should include cities from different countries (USA, India, Canada, UK, etc.)
    
    CRITICAL: Do NOT generate fake companies or URLs. Use ONLY real job postings you can find information about.
    
    Return ONLY valid JSON array, no additional text.`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    // Parse the JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from Gemini response");
    }

    const jobs = JSON.parse(jsonMatch[0]);

    // Transform to match our job schema
    const transformedJobs = jobs.map((job) => ({
      title: job.title,
      company: job.company,
      description: job.description,
      location: job.location,
      jobLocation: job.location,
      jobType: job.jobType,
      type: job.jobType,
      salaryRange: job.salary,
      experienceRequired: job.experience,
      skills: job.skills,
      url: job.url,
      sourceURL: job.url,
      postedDate: job.postedDate,
      deadline: job.deadline,
      source: "Gemini Real Jobs",
      isGeminiGenerated: true,
      companyLogo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        job.company
      )}&background=random&size=50&bold=true`,
    }));

    return transformedJobs;
  } catch (error) {
    console.error("Error generating jobs with Gemini:", error);
    throw new Error(`Failed to generate jobs with Gemini: ${error.message}`);
  }
};

export const enrichJobDataWithGemini = async (jobData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a job data enrichment assistant. 
    Take this job data and enhance it with missing or incomplete fields:
    
    ${JSON.stringify(jobData, null, 2)}
    
    Return a JSON object with the same structure but with enriched/fixed data:
    - Ensure title is clear and professional
    - Add a complete description if missing (2-3 sentences)
    - Format location properly (City, Country)
    - Ensure salary range has from, to, currency
    - Ensure experience is specified (e.g., "2-5 years")
    - Add relevant skills list (3-4 skills) if missing
    - Keep all original fields and add missing ones
    
    Return ONLY valid JSON object, no additional text.`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return jobData; // Return original if parsing fails
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error enriching job data with Gemini:", error);
    return jobData; // Return original data if enrichment fails
  }
};
