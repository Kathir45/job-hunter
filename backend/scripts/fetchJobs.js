#!/usr/bin/env node
/**
 * Manual Job Fetching Script
 * 
 * This script fetches real jobs from Gemini API and stores them in MongoDB
 * 
 * Usage: node scripts/fetchJobs.js
 */

import dotenv from "dotenv";
import { connectDB } from "../src/db/db.js";
import { Job } from "../src/models/job.model.js";
import { generateJobsWithGemini } from "../src/utils/geminiJobs.service.js";

// Load environment variables
dotenv.config({ path: "./.env" });

async function fetchAndStoreJobs() {
  try {
    console.log("🚀 Starting job fetch from Gemini API...");
    console.log("📡 Connecting to MongoDB...");

    // Connect to database
    await connectDB();
    console.log("✅ Connected to MongoDB");

    console.log("🔄 Fetching 10 real jobs from Gemini API...");
    const newJobs = await generateJobsWithGemini(10);

    if (!newJobs || newJobs.length === 0) {
      console.warn("⚠️  No jobs returned from Gemini API");
      process.exit(0);
    }

    console.log(`📥 Storing ${newJobs.length} jobs in MongoDB...`);

    const savedJobs = [];
    for (let i = 0; i < newJobs.length; i++) {
      const jobData = newJobs[i];
      try {
        const job = new Job({
          title: jobData.title,
          description: jobData.description,
          location: jobData.location,
          type: jobData.type,
          salaryRange: jobData.salaryRange,
          skills: jobData.skills,
          datePosted: new Date(),
          deadline: new Date(jobData.deadline),
          isGeminiGenerated: true,
          source: "Gemini Real Jobs",
          companyLogo: jobData.companyLogo,
          sourceURL: jobData.sourceURL,
          active: true,
        });

        const savedJob = await job.save();
        savedJobs.push(savedJob);
        console.log(`  ✓ Saved: ${jobData.title} at ${jobData.company}`);
      } catch (jobError) {
        console.error(`  ✗ Failed to save job: ${jobData.title}`, jobError.message);
      }
    }

    console.log(`\n✅ Successfully stored ${savedJobs.length}/${newJobs.length} jobs`);
    console.log("\n📊 Job Details:");
    savedJobs.forEach((job, index) => {
      console.log(`\n${index + 1}. ${job.title}`);
      console.log(`   Company: ${job.description?.substring(0, 50)}...`);
      console.log(`   Location: ${job.location}`);
      console.log(`   Type: ${job.type}`);
      console.log(`   Deadline: ${new Date(job.deadline).toLocaleDateString()}`);
      console.log(`   ID: ${job._id}`);
    });

    console.log("\n🎉 Job fetch completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    console.error("\nTroubleshooting:");
    console.error("1. Make sure GEMINI_API_KEY is set in .env file");
    console.error("2. Make sure MongoDB is running and accessible");
    console.error("3. Check your internet connection");
    process.exit(1);
  }
}

// Run the script
fetchAndStoreJobs();
