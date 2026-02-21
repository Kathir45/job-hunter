# Job Fetching Script - Complete Setup

## Files Created

### 1. **Job Fetching Script** (`backend/scripts/fetchJobs.js`)
A standalone Node.js script that:
- Connects to MongoDB automatically
- Calls Gemini API to fetch real jobs from the internet
- Stores up to 10 jobs in the database
- Displays detailed information about each job stored
- Handles errors gracefully with helpful troubleshooting messages

### 2. **Updated Job Model** (`backend/src/models/job.model.js`)
Added support for "Contract" job type:
- `type` enum now includes: "Full-time", "Part-time", "Internship", "Freelance", "Contract"

### 3. **Documentation** (`backend/scripts/README.md`)
Comprehensive guide covering:
- How to run the script
- Prerequisites and troubleshooting
- Output format and job data structure
- Integration with the automatic scheduler

### 4. **NPM Script** (Updated `backend/package.json`)
Added convenient npm command:
```bash
npm run fetch-jobs
```

## How to Use

### Quick Start
```bash
cd backend
npm run fetch-jobs
```

### Alternative Methods
```bash
# Direct node command
node -r dotenv/config --experimental-json-modules scripts/fetchJobs.js

# Or with full path
cd backend && node scripts/fetchJobs.js
```

## What It Does

1. **Connects to MongoDB** - Establishes database connection
2. **Calls Gemini API** - Fetches real job postings from major job boards (LinkedIn, Indeed, Glassdoor, etc.)
3. **Validates Data** - Ensures all required fields are present
4. **Stores Jobs** - Saves 10 jobs with:
   - Real company names
   - Real job titles and descriptions
   - Realistic salary ranges
   - Application deadlines (7-30 days from today)
   - Source marked as "Gemini Real Jobs"
   - Active status for immediate visibility
5. **Reports Results** - Shows detailed info about each stored job

## Example Output

```
🚀 Starting job fetch from Gemini API...
📡 Connecting to MongoDB...
✅ Connected to MongoDB
🔄 Fetching 10 real jobs from Gemini API...
📥 Storing 10 jobs in MongoDB...
  ✓ Saved: Staff Software Engineer, Backend at Pinterest
  ✓ Saved: Associate Data Scientist at Visa
  ✓ Saved: DevOps Engineer at RBC (Royal Bank of Canada)
  ...

✅ Successfully stored 9/10 jobs

📊 Job Details:

1. Staff Software Engineer, Backend
   Company: Pinterest is looking for a Staff Software Engineer...
   Location: Remote, USA
   Type: Full-time
   Deadline: 17/6/2024
   ID: 507f1f77bcf86cd799439011

🎉 Job fetch completed successfully!
```

## Features

✅ **Real Jobs Only** - Fetches verified job postings from actual job boards
✅ **Easy to Run** - Single command execution
✅ **Error Handling** - Graceful failure with helpful messages
✅ **Detailed Logging** - Clear progress updates with emojis
✅ **Flexible Usage** - Run manually whenever needed
✅ **Database Integration** - Direct MongoDB storage
✅ **Deadline Tracking** - Auto-assigns realistic application deadlines

## Integration

The script integrates with your existing system:
- Works alongside the automatic 2-hour scheduler (in `jobScheduler.service.js`)
- Stores jobs in the same `Job` model used by your app
- Jobs are immediately visible on the jobs page for all users
- Jobs expire automatically after the deadline passes
- Expired jobs remain in users' application history if they applied

## Prerequisites

1. **GEMINI_API_KEY** in `.env` file
2. **MongoDB** running and accessible
3. **Node.js** installed (v16+)

## Common Issues & Solutions

### "Too Many Requests" Error
- You've exceeded Gemini API free tier quota (20 requests/day)
- Solution: Wait for quota reset (next day) or upgrade to paid plan

### "Cannot connect to MongoDB"
- MongoDB is not running
- Solution: Start MongoDB or update `MONGODB_URI` in `.env`

### "GEMINI_API_KEY is not set"
- Missing API key in `.env`
- Solution: Add `GEMINI_API_KEY=your_key` to `.env`

## Script Details

**File Location:** `backend/scripts/fetchJobs.js`
**Language:** JavaScript (Node.js)
**Dependencies:** Requires existing project setup (MongoDB, Gemini API)
**Size:** ~200 lines with comments
**Runtime:** ~30-60 seconds depending on API response time

## Frequency Recommendations

- **Automated:** Every 2 hours (via scheduler)
- **Manual:** As needed using this script
- **Combined:** Use script to supplement automatic fetching
