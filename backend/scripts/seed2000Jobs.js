import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file FIRST
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn("⚠️  Warning: Could not load .env file, using environment variables");
} else {
  console.log("✓ Loaded .env file");
}

// NOW import modules that depend on env vars
import { Job } from "../src/models/job.model.js";
import { connectDB } from "../src/db/db.js";

const jobTitles = [
  // Software & IT
  "Senior React Developer",
  "Full Stack JavaScript Developer",
  "Mobile App Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Cloud Architect",
  "Backend Developer",
  "Frontend Developer",
  "UI/UX Designer",
  "Product Manager",
  "QA Engineer",
  "Systems Administrator",
  "Database Administrator",
  "Security Engineer",
  "Network Engineer",
  "Solutions Architect",
  "Technical Lead",
  "Software Architect",
  "Blockchain Developer",
  "Python Developer",
  "Java Developer",
  "C++ Developer",
  "Go Developer",
  "Rust Developer",
  "TypeScript Developer",
  "Vue.js Developer",
  "Angular Developer",
  "Node.js Developer",
  "Web Developer",
  "Game Developer",
  "Embedded Systems Engineer",
  "IoT Developer",
  "AR/VR Developer",
  "AI Engineer",
  "Data Engineer",
  "Analytics Engineer",
  "Platform Engineer",
  "SRE Engineer",
  "Infrastructure Engineer",
  "IT Support Specialist",
  "Business Analyst",
  "Systems Engineer",
  // Healthcare
  "Registered Nurse",
  "Physician Assistant",
  "Medical Doctor",
  "Clinical Research Coordinator",
  "Healthcare Administrator",
  "Pharmacist",
  "Physical Therapist",
  "Medical Technologist",
  "Nursing Assistant",
  "Dental Hygienist",
  "Occupational Therapist",
  "Speech Language Pathologist",
  // Finance & Accounting
  "Financial Analyst",
  "Accountant",
  "Senior Accountant",
  "Tax Consultant",
  "Investment Banker",
  "Risk Analyst",
  "Auditor",
  "Mortgage Loan Officer",
  "Financial Planner",
  "Credit Analyst",
  "Budget Analyst",
  "Treasury Analyst",
  // Marketing & Sales
  "Marketing Manager",
  "Digital Marketing Specialist",
  "Content Marketing Manager",
  "Sales Representative",
  "Sales Manager",
  "Account Executive",
  "Brand Manager",
  "SEO Specialist",
  "Social Media Manager",
  "Market Research Analyst",
  "Product Marketing Manager",
  "Email Marketing Specialist",
  // Human Resources
  "HR Manager",
  "Recruiter",
  "HR Specialist",
  "Training Coordinator",
  "Compensation Analyst",
  "Employee Relations Manager",
  "Talent Acquisition Manager",
  "HR Business Partner",
  // Education
  "High School Teacher",
  "University Professor",
  "K-12 Administrator",
  "Curriculum Developer",
  "Educational Psychologist",
  "Special Education Teacher",
  "School Counselor",
  "Instructional Designer",
  // Engineering (Non-Software)
  "Civil Engineer",
  "Mechanical Engineer",
  "Electrical Engineer",
  "Chemical Engineer",
  "Structural Engineer",
  "Environmental Engineer",
  "Aeronautical Engineer",
  "Biomedical Engineer",
  // Construction & Real Estate
  "Construction Manager",
  "Real Estate Agent",
  "Architect",
  "Property Manager",
  "Contractor",
  "Surveyor",
  "Urban Planner",
  "Land Developer",
  // Manufacturing
  "Operations Manager",
  "Production Manager",
  "Quality Assurance Manager",
  "Supply Chain Manager",
  "Logistics Coordinator",
  "Plant Manager",
  "Maintenance Manager",
  // Customer Service & Support
  "Customer Service Representative",
  "Customer Success Manager",
  "Support Specialist",
  "Client Relations Manager",
  "Technical Support Engineer",
  "Customer Experience Manager",
  // Legal
  "Attorney",
  "Paralegal",
  "Legal Secretary",
  "Contract Manager",
  "Legal Analyst",
  "Compliance Officer",
  // Hospitality & Tourism
  "Hotel Manager",
  "Executive Chef",
  "Restaurant Manager",
  "Event Planner",
  "Travel Consultant",
  "Front Desk Manager",
  "Concierge",
  "Food & Beverage Director",
  // Retail & Commerce
  "Store Manager",
  "Retail Associate",
  "Merchandiser",
  "Inventory Specialist",
  "Visual Merchandiser",
  "Category Manager",
  // Transportation & Logistics
  "Truck Driver",
  "Logistics Manager",
  "Fleet Manager",
  "Delivery Driver",
  "Warehouse Manager",
  "Shipping Coordinator",
  // Media & Entertainment
  "Video Producer",
  "Graphic Designer",
  "Copywriter",
  "Film Director",
  "Photographer",
  "Cinematographer",
  "Sound Engineer",
  "Game Designer",
  // Government & Public Service
  "Government Analyst",
  "Public Policy Specialist",
  "Government Accountant",
  "Federal Investigator",
  // Energy & Utilities
  "Energy Analyst",
  "Power Plant Operator",
  "Renewable Energy Technician",
  "Electrical Lineman",
  "Petroleum Engineer",
  // Telecommunications
  "Telecom Engineer",
  "Network Technician",
  "Installation Technician",
  "Systems Engineer",
];

const companies = [
  // Technology
  "TechVision Corp",
  "CloudNet Solutions",
  "DataFlow Systems",
  "InnovateTech",
  "DigitalPulse",
  "ByteForce Inc",
  "CodeStream Labs",
  "PixelWorks",
  "VelocityTech",
  "NexGen Software",
  "PrimeCode Solutions",
  "ApexTech",
  "ZenithSoft",
  "OmegaDev",
  "AscendTech",
  "QuantumLeap",
  "NovaTech",
  "PulseWave",
  "FutureMind",
  "SynergyTech",
  "EchoSoft",
  "VortexCode",
  "PhoenixDev",
  "ZephyrTech",
  "LuminousTech",
  "VividCode",
  "ThriveTech",
  "SwiftSoft",
  "PrecisionCode",
  "BrightVision",
  "Google Cloud",
  "Amazon Web Services",
  "Microsoft Azure",
  "IBM Solutions",
  "Oracle Corp",
  "Apple Inc",
  "Meta Platforms",
  "Netflix Studio",
  "Adobe Systems",
  "Salesforce Cloud",
  "Slack Technologies",
  "Atlassian Corp",
  "GitHub Inc",
  "GitLab",
  // Healthcare
  "City Medical Center",
  "Memorial Hospital",
  "St. Mary's Healthcare",
  "HealthCare Plus",
  "United Medical Group",
  "Wellness Clinic",
  "Cardiology Associates",
  "Phoenix Health Systems",
  "Blue Cross Blue Shield",
  "UnitedHealth Group",
  "Cigna Corporation",
  "Humana Inc",
  // Finance
  "Goldman Sachs",
  "JPMorgan Chase",
  "Bank of America",
  "Wells Fargo",
  "Morgan Stanley",
  "Capital One",
  "American Express",
  "Charles Schwab",
  "Fidelity Investments",
  "Vanguard Group",
  "Blackstone",
  "KKR",
  // Retail & E-commerce
  "Walmart Inc",
  "Target Corporation",
  "Amazon",
  "Best Buy",
  "Costco",
  "Macy's",
  "Gap Inc",
  "H&M",
  "Forever 21",
  "Old Navy",
  // Manufacturing
  "General Motors",
  "Ford Motor Company",
  "Boeing",
  "Caterpillar Inc",
  "3M Company",
  "Johnson Controls",
  "Honeywell International",
  "Siemens USA",
  "GE General Electric",
  "Emerson Electric",
  // Energy & Utilities
  "Duke Energy",
  "NextEra Energy",
  "Southern Company",
  "American Electric Power",
  "Dominion Energy",
  "Green Energy Solutions",
  "Shell Oil",
  "ExxonMobil",
  // Telecommunications
  "AT&T",
  "Verizon",
  "T-Mobile",
  "Comcast",
  "Charter Communications",
  "CenturyLink",
  // Hospitality & Tourism
  "Marriott International",
  "Hilton Hotels",
  "Hyatt Hotels",
  "Disney Resorts",
  "Starwood Hotels",
  "Four Seasons",
  "Wyndham Hotels",
  "Choice Hotels",
  // Education
  "Harvard University",
  "Stanford University",
  "MIT",
  "Yale University",
  "Princeton University",
  "Public Schools District",
  "UC Berkeley",
  "University of Chicago",
  // Real Estate & Construction
  "CB Richard Ellis",
  "Jones Lang LaSalle",
  "Turner Construction",
  "Bechtel Corporation",
  "Skanska USA",
  "Lennar Corporation",
  "D.R. Horton",
  // Consulting
  "McKinsey & Company",
  "Boston Consulting Group",
  "Bain & Company",
  "Accenture",
  "Deloitte",
  "PwC",
  "EY (Ernst & Young)",
  "KPMG",
  // Media & Entertainment
  "Warner Bros",
  "Universal Studios",
  "Disney",
  "Paramount Pictures",
  "Sony Pictures",
  "NBC News",
  "CNN",
  "The New York Times",
  "Washington Post",
  // Automotive
  "Tesla Inc",
  "Toyota",
  "Honda",
  "BMW",
  "Mercedes-Benz",
  "Volkswagen",
  "Audi",
  "Porsche",
  // Food & Beverage
  "McDonald's",
  "Starbucks",
  "Coca-Cola",
  "PepsiCo",
  "Nestle USA",
  "Kraft Heinz",
  "General Mills",
  // Transportation & Logistics
  "UPS",
  "FedEx",
  "DHL",
  "USPS",
  "JB Hunt",
  "Schneider National",
];

const skills = [
  // Software Development
  ["React", "JavaScript", "Node.js", "MongoDB", "CSS"],
  ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
  ["Java", "Spring Boot", "Microservices", "Kubernetes", "GCP"],
  ["Vue.js", "TypeScript", "GraphQL", "Firebase", "HTML5"],
  ["Swift", "iOS", "Objective-C", "Xcode", "Core Data"],
  ["Kotlin", "Android", "Java", "Firebase", "REST API"],
  ["Python", "TensorFlow", "Machine Learning", "NumPy", "Pandas"],
  ["Go", "Docker", "Kubernetes", "CI/CD", "Linux"],
  ["AWS", "Azure", "Cloud", "Infrastructure", "Terraform"],
  ["React", "Redux", "Webpack", "Jest", "Material-UI"],
  ["Vue", "Vuex", "Webpack", "Vitest", "Tailwind"],
  ["Angular", "TypeScript", "RxJS", "Jasmine", "Bootstrap"],
  ["Node.js", "Express", "MongoDB", "JWT", "REST"],
  ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "Redis"],
  ["Rust", "Cargo", "WebAssembly", "System Programming", "Tokio"],
  ["Go", "Gin", "PostgreSQL", "Redis", "gRPC"],
  ["C++", "STL", "Boost", "CMake", "GDB"],
  ["C#", ".NET", "Entity Framework", "SQL Server", "Azure"],
  ["PHP", "Laravel", "MySQL", "Redis", "Docker"],
  ["Ruby", "Rails", "PostgreSQL", "RSpec", "Heroku"],
  // Healthcare
  ["Patient Care", "Electronic Health Records", "HIPAA Compliance", "Clinical Documentation", "Patient Communication"],
  ["Medical Terminology", "Diagnosis Coding", "Insurance Claims", "Billing", "Medical Records Management"],
  ["Healthcare Management", "Patient Scheduling", "Budget Management", "Staff Supervision", "Quality Assurance"],
  // Finance
  ["Financial Analysis", "Excel", "SAP", "Oracle", "Financial Modeling"],
  ["Tax Accounting", "Tax Planning", "IRS Regulations", "Quickbooks", "Audit"],
  ["Investment Analysis", "Risk Management", "Bloomberg Terminal", "Financial Reporting", "Securities"],
  ["Banking Systems", "Risk Assessment", "Compliance", "Credit Analysis", "Portfolio Management"],
  // Marketing
  ["Social Media Marketing", "Content Creation", "Google Analytics", "SEO", "Marketing Automation"],
  ["Digital Marketing", "PPC Advertising", "Email Marketing", "Brand Strategy", "Market Research"],
  ["Graphic Design", "Canva", "Adobe Creative Suite", "Copywriting", "Visual Communication"],
  ["Market Research", "Consumer Insights", "Data Analysis", "Report Writing", "Survey Design"],
  // Sales
  ["Salesforce CRM", "Sales Strategy", "Negotiation", "Customer Relationship Management", "Account Management"],
  ["Lead Generation", "Sales Pipeline", "Territory Management", "Closing Deals", "Customer Service"],
  ["B2B Sales", "Enterprise Sales", "Contract Negotiation", "Sales Forecasting", "Client Relations"],
  // HR
  ["Recruitment", "Employee Relations", "HR Systems", "Onboarding", "Payroll"],
  ["Talent Management", "Performance Review", "Training Development", "Compensation & Benefits", "Labor Law"],
  ["HRIS", "Compliance", "Employee Engagement", "Organizational Development", "Conflict Resolution"],
  // Operations
  ["Supply Chain Management", "Inventory Management", "Logistics", "Vendor Management", "Process Improvement"],
  ["Project Management", "Agile", "Jira", "Timeline Management", "Budget Planning"],
  ["Lean Six Sigma", "Operations Analysis", "KPI Tracking", "Process Optimization", "Quality Control"],
  // Customer Service
  ["Customer Support", "Conflict Resolution", "Communication", "CRM Tools", "Problem Solving"],
  ["Call Center Management", "Customer Retention", "Quality Assurance", "Team Leadership", "Reporting"],
  ["Ticketing Systems", "Knowledge Management", "Documentation", "Multi-channel Support", "Customer Satisfaction"],
  // Engineering
  ["Civil Engineering", "AutoCAD", "Project Management", "Building Codes", "Site Supervision"],
  ["Mechanical Engineering", "CATIA", "Structural Analysis", "CAD Design", "Manufacturing"],
  ["Electrical Engineering", "Circuit Design", "Power Systems", "PLC Programming", "MATLAB"],
];

const responsibilities = [
  [
    "Develop and maintain web applications",
    "Collaborate with designers and backend team",
    "Optimize application performance",
    "Participate in code reviews",
  ],
  [
  [
    "Provide patient care and support",
    "Document medical records",
    "Administer medications",
    "Communicate with healthcare team",
  ],
  [
    "Analyze financial data",
    "Prepare financial reports",
    "Manage budgets",
    "Identify cost reduction opportunities",
  ],
  [
    "Develop marketing strategies",
    "Create engaging content",
    "Manage social media campaigns",
    "Analyze campaign performance",
  ],
  [
    "Build and maintain client relationships",
    "Achieve sales targets",
    "Prepare sales proposals",
    "Negotiate contracts",
  ],
  [
    "Recruit and onboard new employees",
    "Manage employee relations",
    "Conduct performance reviews",
    "Ensure compliance with HR policies",
  ],
  [
    "Manage supply chain operations",
    "Optimize inventory levels",
    "Coordinate with vendors",
    "Improve operational efficiency",
  ],
  [
    "Resolve customer issues",
    "Provide product support",
    "Maintain customer satisfaction",
    "Document customer interactions",
  ],
  [
    "Oversee construction projects",
    "Manage budgets and schedules",
    "Ensure safety compliance",
    "Coordinate with teams and contractors",
  ],
  [
    "Develop and implement property strategies",
    "Maintain tenant relationships",
    "Oversee property maintenance",
    "Manage lease agreements",
  ],
  [
    "Manage production operations",
    "Optimize manufacturing processes",
    "Ensure quality standards",
    "Lead and supervise teams",
  ],
    "Build scalable microservices",
    "Design database schemas",
    "Implement REST APIs",
    "Write unit and integration tests",
  ],
  [
    "Manage cloud infrastructure",
    "Implement CI/CD pipelines",
    "Monitor system performance",
    "Ensure security best practices",
  ],
  [
    "Develop mobile applications",
    "Implement mobile UI/UX designs",
    "Optimize for performance",
    "Publish apps to app stores",
  ],
  [
    "Analyze large datasets",
    "Build predictive models",
    "Create data visualizations",
    "Present insights to stakeholders",
  ],
  [
    "Design system architecture",
    "Lead development teams",
    "Conduct code reviews",
    "Mentor junior developers",
  ],
  [
    "Ensure product quality",
    "Write automated tests",
    "Report and document bugs",
    "Collaborate with development team",
  ],
];

const locations = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Boston, MA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Denver, CO",
  "Portland, OR",
  "Miami, FL",
  "Remote",
  "Bangalore, India",
  "London, UK",
  "Toronto, Canada",
  "Sydney, Australia",
  "Berlin, Germany",
  "Tokyo, Japan",
  "Singapore",
  "Dubai, UAE",
  "Amsterdam, Netherlands",
  "Paris, France",
  "Madrid, Spain",
  "Mexico City, Mexico",
  "São Paulo, Brazil",
  "Auckland, New Zealand",
];

const workModes = ["Onsite", "Hybrid", "Remote"];
const jobTypes = ["Full-time", "Part-time", "Internship", "Freelance", "Contract"];

function generateDummyJobs(count = 2000) {
  const jobs = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const selectedSkills =
      skills[Math.floor(Math.random() * skills.length)];
    const selectedResponsibilities =
      responsibilities[Math.floor(Math.random() * responsibilities.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    const workMode = workModes[Math.floor(Math.random() * workModes.length)];
    const experience = Math.floor(Math.random() * 8) + 1; // 1-8 years
    const salaryFrom = 50000 + Math.floor(Math.random() * 80000);
    const salaryTo = salaryFrom + Math.floor(Math.random() * 50000);
    
    // Random date within last 30 days
    const daysAgo = Math.floor(Math.random() * 30);
    const datePosted = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const job = {
      title: jobTitle,
      description: `We are hiring a ${jobTitle} at ${company}. This is a great opportunity to work with cutting-edge technologies and talented team members. You will be working on challenging projects that impact millions of users worldwide.`,
      responsibilities: selectedResponsibilities,
      requirements: [
        `${experience}+ years of relevant experience`,
        "Strong problem-solving skills",
        "Experience with version control (Git)",
        "Good communication skills",
      ],
      skills: selectedSkills,
      education: Math.random() > 0.3 ? "Bachelor's degree in Computer Science or related field" : "Any graduation with relevant experience",
      experience: experience,
      salaryRange: {
        from: salaryFrom,
        to: salaryTo,
      },
      type: jobType,
      workMode: workMode,
      location: location,
      datePosted: datePosted,
      company: company,
      companyLogo: `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=random&size=100&bold=true`,
      benefits: [
        "Health Insurance",
        "Retirement Plan",
        "Flexible Work Hours",
        "Professional Development",
      ],
      applicationDeadline: new Date(
        now.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
      ),
      additionalRequirements:
        "Must be willing to relocate or work remotely as per role requirements.",
      urgent: Math.random() > 0.7,
      numberOfOpenings: Math.floor(Math.random() * 3) + 1, // 1-3 openings
      active: true,
      isGeminiGenerated: false,
      source: "Direct Posting",
    };

    jobs.push(job);
  }

  return jobs;
}

async function seed2000Jobs() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Generate 2000 dummy jobs
    console.log("Generating 2000 dummy jobs...");
    const dummyJobs = generateDummyJobs(2000);

    // Insert jobs into database
    console.log("Inserting 2000 jobs into database... (this may take a moment)");
    const result = await Job.insertMany(dummyJobs, { ordered: false });

    console.log(`\n✅ Successfully created ${result.length} new jobs!`);
    const totalCount = await Job.countDocuments();
    console.log(`📊 Total jobs in database: ${totalCount}`);

    // Show sample job
    console.log("\n📋 Sample job created:");
    console.log(JSON.stringify(result[0], null, 2));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding 2000 jobs:", error.message);
    process.exit(1);
  }
}

seed2000Jobs();
