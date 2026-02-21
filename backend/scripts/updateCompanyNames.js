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

const fallbackCompanyNames = [
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
  "Tesla Inc",
  "Netflix Studio",
  "Spotify Tech",
  "Adobe Systems",
  "Salesforce Cloud",
  "Shopify Plus",
  "Uber Technologies",
  "Airbnb Inc",
  "Slack Technologies",
  "Zoom Video",
  "Atlassian Corp",
  "GitHub Inc",
  "GitLab",
];

function getRandomCompanyName() {
  return fallbackCompanyNames[Math.floor(Math.random() * fallbackCompanyNames.length)];
}

async function updateJobCompanyNames() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Find all jobs that have "Unknown Company" or missing company name
    const jobs = await Job.find({
      $or: [
        { company: "Unknown Company" },
        { company: null },
        { company: { $exists: false } },
      ],
    });

    console.log(`\nFound ${jobs.length} jobs with missing/unknown company names\n`);

    let updatedCount = 0;

    for (const job of jobs) {
      const newCompanyName = getRandomCompanyName();
      job.company = newCompanyName;
      job.companyLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(newCompanyName)}&background=random&size=100&bold=true`;
      
      await job.save();
      updatedCount++;

      console.log(`✓ ${job.title} → ${newCompanyName}`);
    }

    console.log(`\n✅ Successfully updated ${updatedCount} jobs with random company names!`);

    // Show statistics
    const allJobs = await Job.find({});
    const withCompanyName = await Job.find({ company: { $exists: true, $ne: null } });

    console.log("\n📊 Statistics:");
    console.log(`Total jobs: ${allJobs.length}`);
    console.log(`Jobs with company names: ${withCompanyName.length}`);
    console.log(`Jobs without company names: ${allJobs.length - withCompanyName.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating company names:", error.message);
    process.exit(1);
  }
}

updateJobCompanyNames();
