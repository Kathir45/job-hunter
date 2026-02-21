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
import { User } from "../src/models/user.model.js";
import { CompanyProfile } from "../src/models/companyProfile.model.js";
import { connectDB } from "../src/db/db.js";
import bcrypt from "bcrypt";

const companies = [
  {
    username: "techvision_corp",
    email: "hr@techvision.com",
    password: "TechVision123!",
    companyName: "TechVision Corp",
    companyDescription: "Leading software development and IT solutions provider",
    contactNumber: "+1-555-0101",
    address: {
      city: "San Francisco",
      state: "California",
      country: "USA",
    },
    industry: "Information Technology",
    companySize: {
      from: 100,
      to: 500,
    },
    companyLogo: "https://ui-avatars.com/api/?name=TechVision+Corp&background=random&size=100&bold=true",
    companyWebsite: "https://techvision.com",
    employeeBenefits: ["Health Insurance", "401k", "Remote Work", "Training Budget"],
  },
  {
    username: "cloudnet_solutions",
    email: "careers@cloudnet.com",
    password: "CloudNet123!",
    companyName: "CloudNet Solutions",
    companyDescription: "Cloud infrastructure and DevOps services",
    contactNumber: "+1-555-0102",
    address: {
      city: "Seattle",
      state: "Washington",
      country: "USA",
    },
    industry: "Cloud Computing",
    companySize: {
      from: 50,
      to: 200,
    },
    companyLogo: "https://ui-avatars.com/api/?name=CloudNet+Solutions&background=random&size=100&bold=true",
    companyWebsite: "https://cloudnet.com",
    employeeBenefits: ["Health Insurance", "Stock Options", "Flexible Hours", "Free Coffee"],
  },
  {
    username: "dataflow_systems",
    email: "jobs@dataflow.com",
    password: "DataFlow123!",
    companyName: "DataFlow Systems",
    companyDescription: "Big data analytics and machine learning solutions",
    contactNumber: "+1-555-0103",
    address: {
      city: "New York",
      state: "New York",
      country: "USA",
    },
    industry: "Data Science",
    companySize: {
      from: 75,
      to: 300,
    },
    companyLogo: "https://ui-avatars.com/api/?name=DataFlow+Systems&background=random&size=100&bold=true",
    companyWebsite: "https://dataflow.com",
    employeeBenefits: ["Health Insurance", "Gym Membership", "Learning Budget", "Home Office Setup"],
  },
  {
    username: "innovatetech",
    email: "contact@innovatetech.io",
    password: "InnovateTech123!",
    companyName: "InnovateTech",
    companyDescription: "AI and emerging technology startup",
    contactNumber: "+1-555-0104",
    address: {
      city: "Austin",
      state: "Texas",
      country: "USA",
    },
    industry: "Artificial Intelligence",
    companySize: {
      from: 20,
      to: 100,
    },
    companyLogo: "https://ui-avatars.com/api/?name=InnovateTech&background=random&size=100&bold=true",
    companyWebsite: "https://innovatetech.io",
    employeeBenefits: ["Equity", "Flexible Schedule", "Relocation Support", "Health Coverage"],
  },
  {
    username: "digitalpulse",
    email: "jobs@digitalpulse.com",
    password: "DigitalPulse123!",
    companyName: "DigitalPulse",
    companyDescription: "Digital marketing and web solutions agency",
    contactNumber: "+1-555-0105",
    address: {
      city: "Los Angeles",
      state: "California",
      country: "USA",
    },
    industry: "Digital Marketing",
    companySize: {
      from: 30,
      to: 150,
    },
    companyLogo: "https://ui-avatars.com/api/?name=DigitalPulse&background=random&size=100&bold=true",
    companyWebsite: "https://digitalpulse.com",
    employeeBenefits: ["Bonus Program", "Team Outings", "Development Courses", "Health Insurance"],
  },
  {
    username: "byteforce_inc",
    email: "hr@byteforce.com",
    password: "ByteForce123!",
    companyName: "ByteForce Inc",
    companyDescription: "Software development and custom solutions",
    contactNumber: "+1-555-0106",
    address: {
      city: "Boston",
      state: "Massachusetts",
      country: "USA",
    },
    industry: "Software Development",
    companySize: {
      from: 40,
      to: 180,
    },
    companyLogo: "https://ui-avatars.com/api/?name=ByteForce&background=random&size=100&bold=true",
    companyWebsite: "https://byteforce.com",
    employeeBenefits: ["Competitive Salary", "Health Insurance", "PTO", "Professional Development"],
  },
  {
    username: "codestream_labs",
    email: "careers@codestream.io",
    password: "CodeStream123!",
    companyName: "CodeStream Labs",
    companyDescription: "Full-stack development and consulting",
    contactNumber: "+1-555-0107",
    address: {
      city: "Denver",
      state: "Colorado",
      country: "USA",
    },
    industry: "Consulting",
    companySize: {
      from: 25,
      to: 120,
    },
    companyLogo: "https://ui-avatars.com/api/?name=CodeStream+Labs&background=random&size=100&bold=true",
    companyWebsite: "https://codestream.io",
    employeeBenefits: ["Remote Friendly", "Flexible Hours", "Learning Budget", "Wellness Program"],
  },
  {
    username: "pixelworks",
    email: "hello@pixelworks.design",
    password: "PixelWorks123!",
    companyName: "PixelWorks",
    companyDescription: "UI/UX design and digital product studio",
    contactNumber: "+1-555-0108",
    address: {
      city: "Portland",
      state: "Oregon",
      country: "USA",
    },
    industry: "Design",
    companySize: {
      from: 15,
      to: 80,
    },
    companyLogo: "https://ui-avatars.com/api/?name=PixelWorks&background=random&size=100&bold=true",
    companyWebsite: "https://pixelworks.design",
    employeeBenefits: ["Creative Freedom", "Portfolio Building", "Team Collaboration", "Health Insurance"],
  },
  {
    username: "velocitytech",
    email: "careers@velocitytech.com",
    password: "VelocityTech123!",
    companyName: "VelocityTech",
    companyDescription: "Performance optimization and speed engineering",
    contactNumber: "+1-555-0109",
    address: {
      city: "Chicago",
      state: "Illinois",
      country: "USA",
    },
    industry: "Performance Engineering",
    companySize: {
      from: 35,
      to: 160,
    },
    companyLogo: "https://ui-avatars.com/api/?name=VelocityTech&background=random&size=100&bold=true",
    companyWebsite: "https://velocitytech.com",
    employeeBenefits: ["Bonus Structure", "Health Coverage", "Training Programs", "Flex Time"],
  },
  {
    username: "nexgen_software",
    email: "jobs@nexgen.io",
    password: "NexGen123!",
    companyName: "NexGen Software",
    companyDescription: "Next-generation enterprise software solutions",
    contactNumber: "+1-555-0110",
    address: {
      city: "Raleigh",
      state: "North Carolina",
      country: "USA",
    },
    industry: "Enterprise Software",
    companySize: {
      from: 60,
      to: 250,
    },
    companyLogo: "https://ui-avatars.com/api/?name=NexGen+Software&background=random&size=100&bold=true",
    companyWebsite: "https://nexgen.io",
    employeeBenefits: ["401k Match", "Health Insurance", "Remote Work", "Conference Attendance"],
  },
];

async function seedCompanies() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Check existing companies
    const existingCount = await User.countDocuments({ role: "employer" });
    console.log(`Existing employer accounts: ${existingCount}`);

    // Create company users
    console.log(`Creating ${companies.length} company accounts...`);
    let createdCount = 0;

    for (const company of companies) {
      try {
        // Check if company already exists
        const existing = await User.findOne({ email: company.email });
        if (existing) {
          console.log(`⏭️  ${company.companyName} already exists, skipping...`);
          continue;
        }

        // Create user account for company
        const newCompanyUser = await User.create({
          username: company.username,
          email: company.email,
          password: company.password, // Will be hashed by pre-save hook
          role: "employer",
          userProfile: {
            companyName: company.companyName,
            companyDescription: company.companyDescription,
            contactNumber: company.contactNumber,
            address: company.address,
            industry: company.industry,
            companySize: company.companySize,
            companyLogo: company.companyLogo,
            companyWebsite: company.companyWebsite,
            employeeBenefits: company.employeeBenefits,
            doneOnboarding: true,
          },
        });

        console.log(`✅ Created company: ${company.companyName}`);
        createdCount++;
      } catch (error) {
        console.error(`❌ Error creating ${company.companyName}:`, error.message);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully created ${createdCount} companies`);
    
    const totalCompanies = await User.countDocuments({ role: "employer" });
    console.log(`📈 Total employer accounts: ${totalCompanies}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding companies:", error.message);
    process.exit(1);
  }
}

seedCompanies();
