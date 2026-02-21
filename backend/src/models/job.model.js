import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    responsibilities: [String],
    requirements: [String],
    skills: [String],
    education: String,
    experience: Number,
    salaryRange: {
      from: Number,
      to: Number,
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Freelance", "Contract"],
      default: "Full-time",
    },
    workMode: {
      type: String,
      enum: ["Onsite", "Hybrid", "Remote"],
      default: "Onsite",
    },

    location: String,
    datePosted: { type: Date, default: Date.now },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shortlistedCandidates: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    benefits: [String],
    applicationDeadline: Date,
    additionalRequirements: String,
    urgent: Boolean,
    numberOfOpenings: Number,
    active: { type: Boolean, default: true },
    // New fields for Gemini-generated jobs
    isGeminiGenerated: { type: Boolean, default: false },
    deadline: { type: Date },
    source: { type: String, default: "Company" },
    companyLogo: String,
    sourceURL: String,
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);
