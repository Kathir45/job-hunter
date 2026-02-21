import cron from "node-cron";
import { generateJobsWithGemini } from "./geminiJobs.service.js";
import { Job } from "../models/job.model.js";

// Function to fetch and store jobs from Gemini
export const fetchAndStoreGeminiJobs = async () => {
  try {
    console.log("Starting scheduled job fetch from Gemini API (real jobs from internet)...");
    
    // Generate 10 new real jobs from Gemini (from internet search)
    const newJobs = await generateJobsWithGemini(10);
    
    if (!newJobs || newJobs.length === 0) {
      console.warn("No jobs returned from Gemini API");
      return [];
    }
    
    // Store each job in MongoDB
    const savedJobs = [];
    for (const jobData of newJobs) {
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
        // employer is optional for Gemini-generated jobs
      });
      
      const savedJob = await job.save();
      savedJobs.push(savedJob);
    }
    
    console.log(`Successfully stored ${savedJobs.length} real jobs from Gemini API`);
    
    return savedJobs;
  } catch (error) {
    console.error("Error in scheduled job fetch:", error.message);
    // Don't throw error - let the scheduler continue even if fetch fails
    return [];
  }
};

// Function to clean up expired jobs that have no applicants
export const cleanupExpiredJobs = async () => {
  try {
    const now = new Date();
    
    // Find expired Gemini-generated jobs with no applicants
    const expiredJobsWithoutApplicants = await Job.find({
      isGeminiGenerated: true,
      deadline: { $lt: now },
      applicants: { $size: 0 },
      active: true,
    });
    
    // Deactivate these jobs instead of deleting (for data integrity)
    for (const job of expiredJobsWithoutApplicants) {
      job.active = false;
      await job.save();
    }
    
    // For expired jobs with applicants, just mark them as inactive
    // They will still be accessible in user's application history
    const expiredJobsWithApplicants = await Job.find({
      isGeminiGenerated: true,
      deadline: { $lt: now },
      applicants: { $ne: [] },
      active: true,
    });
    
    for (const job of expiredJobsWithApplicants) {
      job.active = false;
      await job.save();
    }
    
    console.log(
      `Cleaned up ${expiredJobsWithoutApplicants.length} expired jobs without applicants`
    );
    console.log(
      `Deactivated ${expiredJobsWithApplicants.length} expired jobs with applicants`
    );
  } catch (error) {
    console.error("Error cleaning up expired jobs:", error);
  }
};

// Initialize the cron job
export const initializeJobScheduler = () => {
  // Run every 2 hours (at minute 0 of every 2nd hour)
  const job = cron.schedule("0 */2 * * *", async () => {
    console.log("Running scheduled job fetch at:", new Date().toISOString());
    try {
      await fetchAndStoreGeminiJobs();
    } catch (error) {
      console.error("Scheduled job fetch error (will retry in 2 hours):", error.message);
    }
  });
  
  // Also run cleanup every hour to check for expired jobs
  const cleanupJob = cron.schedule("0 * * * *", async () => {
    console.log("Running scheduled cleanup at:", new Date().toISOString());
    try {
      await cleanupExpiredJobs();
    } catch (error) {
      console.error("Scheduled cleanup error (will retry in 1 hour):", error.message);
    }
  });
  
  console.log("Job scheduler initialized:");
  console.log("- Gemini job fetch: Every 2 hours");
  console.log("- Expired job cleanup: Every hour");
  
  // Attempt to run on startup but don't block if it fails
  console.log("Attempting initial job fetch on startup...");
  fetchAndStoreGeminiJobs()
    .then(() => {
      console.log("Initial job fetch completed successfully");
    })
    .catch((error) => {
      console.warn(
        "Initial job fetch failed (this is non-critical, scheduler will retry in 2 hours):",
        error.message
      );
      // Check if GEMINI_API_KEY is set
      if (!process.env.GEMINI_API_KEY) {
        console.warn(
          "⚠️  WARNING: GEMINI_API_KEY is not set in environment variables. Job generation will fail."
        );
        console.warn(
          "Please set GEMINI_API_KEY to enable automatic job generation from Gemini API."
        );
      }
    });
  
  return { fetchJob: job, cleanupJob };
};
