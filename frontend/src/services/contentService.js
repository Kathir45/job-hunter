import { apiCall } from "./apiBase";

// Cache manager for Gemini jobs
const GEMINI_CACHE_KEY = "gemini_jobs_cache";
const GEMINI_CACHE_TTL = 60 * 60 * 1000; // 1 hour

const cacheGeminiJobs = (jobs, page) => {
  try {
    const cached = JSON.parse(sessionStorage.getItem(GEMINI_CACHE_KEY)) || {};
    cached[page] = {
      data: jobs,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(GEMINI_CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.warn("Could not cache Gemini jobs:", error);
  }
};

const getCachedGeminiJobs = (page) => {
  try {
    const cached = JSON.parse(sessionStorage.getItem(GEMINI_CACHE_KEY)) || {};
    const pageCache = cached[page];
    
    if (!pageCache) return null;
    
    // Check if cache expired
    if (Date.now() - pageCache.timestamp > GEMINI_CACHE_TTL) {
      delete cached[page];
      sessionStorage.setItem(GEMINI_CACHE_KEY, JSON.stringify(cached));
      return null;
    }
    
    return pageCache.data;
  } catch (error) {
    console.warn("Could not retrieve cached Gemini jobs:", error);
    return null;
  }
};

const clearGeminiCache = () => {
  try {
    sessionStorage.removeItem(GEMINI_CACHE_KEY);
  } catch (error) {
    console.warn("Could not clear Gemini cache:", error);
  }
};

export const contentService = {
  getJobs,
  getGeminiJobs,
  getSingleJob,
  getJobLocations,
  getCompanies,
  getSavedJobs,
  clearGeminiCache,
};
async function getJobs(filters) {
  let params = new URLSearchParams();
  
  // Fetch all jobs with high limit
  params.append("limit", 2000);
  params.append("page", 1);
  
  // Only add search if not empty
  if (filters.search && filters.search.trim()) {
    params.append("search", filters.search);
  }
  
  if (filters.sortBy) {
    params.append("sortBy", filters.sortBy);
  }
  
  params.append("salaryFrom", filters.salaryRange.from);
  params.append("salaryTo", filters.salaryRange.to);
  
  // Only add location if not empty
  if (filters.location && filters.location.trim()) {
    params.append("location", filters.location);
  }
  
  // Only add job types if any are selected
  if (filters.jobTypes && filters.jobTypes.length > 0) {
    filters.jobTypes.forEach((jobType) => params.append("type", jobType));
  }
  
  // Only add work modes if any are selected
  if (filters.workMode && filters.workMode.length > 0) {
    filters.workMode.forEach((workMode) => params.append("workMode", workMode));
  }

  try {
    // Fetch internal jobs only
    const internalRes = await apiCall("get", "/jobs", { params: params });
    // API returns { statusCode, data: { jobs, pagination }, message, success }
    // So we access internalRes.data which contains { jobs, pagination }
    const jobs = internalRes.data?.jobs || [];
    const pagination = internalRes.data?.pagination || {};

    // Debug: Log first job to see structure
    if (jobs.length > 0) {
      console.log("ContentService - First job from API:", JSON.stringify(jobs[0], null, 2));
      console.log("ContentService - First job _id:", jobs[0]._id);
    }

    return {
      jobs: jobs,
      pagination: pagination,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { jobs: [], pagination: {} };
  }
}

async function getGeminiJobs(page = 1, count = 10) {
  try {
    // Check cache first
    const cachedJobs = getCachedGeminiJobs(page);
    if (cachedJobs) {
      console.log(`Using cached Gemini jobs for page ${page}`);
      return {
        jobs: cachedJobs.jobs,
        pagination: cachedJobs.pagination,
      };
    }

    // Fetch from API if not in cache
    const res = await apiCall("get", "/gemini-jobs", {
      params: { count, page },
    });
    
    // Cache the results
    if (res.data?.jobs) {
      cacheGeminiJobs({
        jobs: res.data.jobs,
        pagination: res.data.pagination,
      }, page);
    }
    
    return {
      jobs: res.data?.jobs || [],
      pagination: res.data?.pagination || {},
    };
  } catch (error) {
    console.error("Error fetching Gemini jobs:", error);
    return { jobs: [], pagination: {} };
  }
}

async function getSingleJob(id) {
  const res = await apiCall("get", `/jobs/${id}`);
  return res.data;
}

async function getJobLocations(location) {
  const res = await apiCall("get", "/job-locations", { params: { search: location } });
  return res.data;
}

async function getCompanies() {
  const res = await apiCall("get", "/companies");
  return res.data;
}

async function getSavedJobs() {
  const res = await apiCall("get", "/users/saved-jobs");
  return res.data;
}
