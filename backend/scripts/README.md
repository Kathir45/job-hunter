# Job Fetching Script

This script allows you to manually fetch real job openings from the Gemini API and store them directly in MongoDB.

## Overview

The script will:
- ✅ Connect to MongoDB
- ✅ Call Gemini API to search for real jobs on the internet
- ✅ Extract and validate job data
- ✅ Store 10 real jobs in the database
- ✅ Display detailed information about stored jobs

## Prerequisites

1. **GEMINI_API_KEY** must be set in your `.env` file
2. **MongoDB** must be running and accessible
3. **Node.js** must be installed

## How to Run

### Option 1: Using npm script (Recommended)
```bash
cd backend
npm run fetch-jobs
```

### Option 2: Direct Node command
```bash
cd backend
node -r dotenv/config --experimental-json-modules scripts/fetchJobs.js
```

### Option 3: Direct execution
```bash
cd backend
node scripts/fetchJobs.js
```

## Sample Output

```
🚀 Starting job fetch from Gemini API...
📡 Connecting to MongoDB...
✅ Connected to MongoDB
🔄 Fetching 10 real jobs from Gemini API...
📥 Storing 10 jobs in MongoDB...
  ✓ Saved: Senior Software Engineer at Google
  ✓ Saved: Full Stack Developer at Meta
  ✓ Saved: DevOps Engineer at Amazon
  ...

✅ Successfully stored 10/10 jobs

📊 Job Details:

1. Senior Software Engineer
   Company: Build innovative products...
   Location: San Francisco, CA
   Type: Full-time
   Deadline: 2026-03-20
   ID: 507f1f77bcf86cd799439011

2. Full Stack Developer
   ...

🎉 Job fetch completed successfully!
```

## What the Script Does

1. **Connects to Database**: Establishes connection to MongoDB using your configured connection string
2. **Fetches Real Jobs**: Calls Gemini API with a prompt to search for real, verified job postings from major job boards (LinkedIn, Indeed, Glassdoor, etc.)
3. **Validates Data**: Ensures all required fields are present and valid
4. **Stores in DB**: Saves each job with:
   - `isGeminiGenerated: true`
   - `source: "Gemini Real Jobs"`
   - Auto-generated deadline (7-30 days from today)
   - Current timestamp as `datePosted`
   - `active: true` status
5. **Reports Results**: Shows detailed information about each stored job

## Troubleshooting

### "GEMINI_API_KEY is not set"
- Make sure you have a `.env` file in the `backend` directory
- Add your Gemini API key: `GEMINI_API_KEY=your_api_key_here`

### "Connection refused to MongoDB"
- Ensure MongoDB is running: `mongod` or use MongoDB Atlas
- Check `MONGODB_URI` in your `.env` file

### "No jobs returned from Gemini API"
- Check your internet connection
- Verify your Gemini API key is valid
- Try again (API calls can sometimes timeout)

## Features

- **Error Handling**: Gracefully handles individual job failures while continuing to process others
- **Detailed Logging**: Shows progress with emojis and clear status messages
- **Real Jobs Only**: Gemini API is instructed to fetch only verified, real job postings
- **Deadline Tracking**: Each job is assigned a realistic deadline for automatic expiration
- **Flexible Reusability**: Can be run as often as needed to refresh the job database

## Integration with Scheduler

The automatic scheduler runs this job every 2 hours. If you want to fetch jobs on-demand immediately, use this script.

## Job Data Structure

Each job stored includes:
- `title` - Job position title
- `description` - Job description
- `location` - Job location
- `type` - Full-time, Part-time, Freelance, Contract
- `salaryRange` - {from, to, currency}
- `skills` - Array of required skills
- `deadline` - Application deadline (auto-calculated)
- `source` - "Gemini Real Jobs"
- `isGeminiGenerated` - true
- `sourceURL` - Link to actual job posting
- `companyLogo` - Generated avatar for the company
- `active` - true (for active jobs)
