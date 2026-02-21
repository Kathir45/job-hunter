import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateJobsWithGemini } from "../utils/geminiJobs.service.js";
import { cacheManager } from "../utils/cacheManager.js";

const GEMINI_JOBS_CACHE_KEY = "gemini_jobs";

export const getGeminiGeneratedJobs = asyncHandler(async (req, res) => {
  const { count = 10, page = 1 } = req.query;
  const pageNum = parseInt(page);
  const countNum = parseInt(count);

  // Check if jobs are already cached
  let jobs = cacheManager.get(GEMINI_JOBS_CACHE_KEY);

  // If not in cache, generate and cache them
  if (!jobs) {
    console.log("Generating new Gemini jobs and caching...");
    jobs = await generateJobsWithGemini(100); // Generate 100 jobs at once for pagination
    cacheManager.set(GEMINI_JOBS_CACHE_KEY, jobs);
  } else {
    console.log("Fetching Gemini jobs from cache");
  }

  // Get jobs for the current page
  const startIndex = (pageNum - 1) * countNum;
  const paginatedJobs = jobs.slice(startIndex, startIndex + countNum);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          jobs: paginatedJobs,
          pagination: {
            currentPage: pageNum,
            pageSize: countNum,
            totalJobs: jobs.length,
            hasMore: startIndex + countNum < jobs.length,
          },
        },
        `Fetched ${paginatedJobs.length} jobs from cache`
      )
    );
});
