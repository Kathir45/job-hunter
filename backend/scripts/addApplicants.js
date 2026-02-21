import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

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

async function addApplicantsToJobs() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Get all jobs
    const jobs = await Job.find({});
    console.log(`\nFound ${jobs.length} jobs to update...\n`);

    let updatedCount = 0;

    for (const job of jobs) {
      // Calculate days since job was posted
      const now = new Date();
      const datePosted = new Date(job.datePosted);
      const daysSincePosted = Math.floor(
        (now - datePosted) / (1000 * 60 * 60 * 24)
      );

      // Generate random number of applicants proportional to days posted
      // Formula: random(1 to 3) applicants per day posted + some randomness
      const baseApplicants = Math.max(1, Math.floor(daysSincePosted * 1.5));
      const randomFactor = Math.floor(Math.random() * (baseApplicants + 1));
      const totalApplicants = baseApplicants + randomFactor;

      // Generate random ObjectIds for applicants
      const applicantIds = [];
      for (let i = 0; i < totalApplicants; i++) {
        applicantIds.push(new mongoose.Types.ObjectId());
      }

      // Update job with applicants
      job.applicants = applicantIds;
      await job.save();

      updatedCount++;

      console.log(
        `✓ ${job.title} (Posted ${daysSincePosted} days ago) → ${totalApplicants} applicants`
      );
    }

    console.log(`\n✅ Successfully updated ${updatedCount} jobs with applicants!`);

    // Show stats
    const allJobs = await Job.find({});
    const totalApplicants = allJobs.reduce(
      (sum, job) => sum + job.applicants.length,
      0
    );
    const avgApplicants = (totalApplicants / allJobs.length).toFixed(1);

    console.log("\n📊 Statistics:");
    console.log(`Total jobs: ${allJobs.length}`);
    console.log(`Total applicants: ${totalApplicants}`);
    console.log(`Average applicants per job: ${avgApplicants}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding applicants:", error.message);
    process.exit(1);
  }
}

addApplicantsToJobs();
