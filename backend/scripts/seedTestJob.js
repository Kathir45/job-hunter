import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { Job } from "../src/models/job.model.js";
import { connectDB } from "../src/db/db.js";

// Load environment variables from .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

// Debug: Log the MONGODB_URL
console.log("MONGODB_URL:", process.env.MONGODB_URL);
console.log("All env vars:", Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('DB')));

async function seedTestJob() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Create a test job
    const testJob = new Job({
      title: "Senior React Developer",
      description: "We are looking for an experienced React developer to join our team. You will work on building scalable web applications using React, Node.js, and MongoDB.",
      responsibilities: [
        "Develop and maintain React components",
        "Collaborate with backend team on API integration",
        "Participate in code reviews",
        "Optimize application performance"
      ],
      requirements: [
        "5+ years experience with React",
        "Strong JavaScript knowledge",
        "Experience with REST APIs",
        "Good problem-solving skills"
      ],
      skills: ["React", "JavaScript", "Node.js", "MongoDB", "CSS"],
      experience: 5,
      salaryRange: {
        from: 80000,
        to: 120000
      },
      type: "Full-time",
      workMode: "Remote",
      location: "San Francisco, CA",
      datePosted: new Date(),
      company: "Tech Corp",
      companyLogo: "https://ui-avatars.com/api/?name=Tech+Corp&background=random&size=50&bold=true",
      active: true,
      isGeminiGenerated: true,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      source: "LinkedIn",
      sourceURL: "https://www.linkedin.com/jobs/search/?keywords=React%20Developer"
    });

    const savedJob = await testJob.save();
    console.log("Test job saved successfully:");
    console.log("Job ID: " + savedJob._id);
    console.log("Full Job:", JSON.stringify(savedJob, null, 2));
    
    // Verify we can retrieve it
    const retrievedJob = await Job.findById(savedJob._id);
    console.log("\nRetrieved job from DB:");
    console.log(JSON.stringify(retrievedJob, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Error seeding test job:", error);
    process.exit(1);
  }
}

seedTestJob();
