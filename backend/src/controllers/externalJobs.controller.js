import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fetchGitHubJobs } from "../utils/githubJobs.service.js";

const getExternalJobs = asyncHandler(async (req, res) => {
  const filters = {
    search: req.query.search || "",
    location: req.query.location || "",
    jobTypes: req.query.type ? (Array.isArray(req.query.type) ? req.query.type : [req.query.type]) : [],
  };

  try {
    const externalJobs = await fetchGitHubJobs(filters);

    return res.status(200).json(
      new ApiResponse(
        200,
        { jobs: externalJobs, pagination: {} },
        "External jobs fetched successfully"
      )
    );
  } catch (error) {
    console.error("Error in getExternalJobs:", error);
    return res.status(200).json(
      new ApiResponse(
        200,
        { jobs: [], pagination: {} },
        "No external jobs found"
      )
    );
  }
});

export { getExternalJobs };
