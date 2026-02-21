import axios from "axios";

const GITHUB_JOBS_API = "https://jobs.github.com/positions.json";

// Sample jobs as fallback
const SAMPLE_JOBS = [
  {
    id: "sample-1",
    title: "Senior Software Engineer",
    company: "Tech Innovations Inc",
    company_logo: "https://ui-avatars.com/api/?name=Tech+Innovations&background=random&size=100&bold=true",
    location: "San Francisco, CA",
    type: "Full Time",
    description: "<p>We're looking for an experienced Senior Software Engineer to join our team. You'll work on cutting-edge technologies and lead technical initiatives.</p>",
    created_at: new Date().toISOString(),
    url: "https://example.com/job/1"
  },
  {
    id: "sample-2",
    title: "Full Stack Developer",
    company: "Digital Solutions Ltd",
    company_logo: "https://ui-avatars.com/api/?name=Digital+Solutions&background=random&size=100&bold=true",
    location: "New York, NY",
    type: "Full Time",
    description: "<p>Join our team as a Full Stack Developer. Experience with React, Node.js, and MongoDB required.</p>",
    created_at: new Date().toISOString(),
    url: "https://example.com/job/2"
  },
  {
    id: "sample-3",
    title: "Frontend Developer (React)",
    company: "Web Designs Studio",
    company_logo: "https://ui-avatars.com/api/?name=Web+Designs&background=random&size=100&bold=true",
    location: "Austin, TX",
    type: "Full Time",
    description: "<p>Seeking a talented React developer to build beautiful and responsive web applications.</p>",
    created_at: new Date().toISOString(),
    url: "https://example.com/job/3"
  },
  {
    id: "sample-4",
    title: "Backend Engineer",
    company: "Cloud Systems Corp",
    company_logo: "https://ui-avatars.com/api/?name=Cloud+Systems&background=random&size=100&bold=true",
    location: "Seattle, WA",
    type: "Full Time",
    description: "<p>Build scalable backend systems with Node.js, Python, and cloud technologies.</p>",
    created_at: new Date().toISOString(),
    url: "https://example.com/job/4"
  },
  {
    id: "sample-5",
    title: "DevOps Engineer",
    company: "Infrastructure Pro",
    company_logo: "https://ui-avatars.com/api/?name=Infrastructure&background=random&size=100&bold=true",
    location: "Remote",
    type: "Full Time",
    description: "<p>Help us manage and scale our cloud infrastructure. Experience with Docker, Kubernetes, and CI/CD pipelines required.</p>",
    created_at: new Date().toISOString(),
    url: "https://example.com/job/5"
  }
];

// Create a custom axios instance for GitHub Jobs
const githubJobsClient = axios.create({
  timeout: 10000,
  headers: {
    'User-Agent': 'JobHunter-App/1.0'
  }
});

export const fetchGitHubJobs = async (filters) => {
  try {
    // Use default search term if search is empty
    const searchTerm = filters.search?.trim() || "developer";
    
    const params = {
      description: searchTerm,
      location: filters.location?.trim() || "",
    };

    // Remove empty values
    Object.keys(params).forEach(
      (key) => !params[key] && delete params[key]
    );

    console.log("Fetching GitHub jobs with params:", params);

    try {
      const response = await githubJobsClient.get(GITHUB_JOBS_API, { params });

      console.log(`Successfully fetched ${response.data.length} GitHub jobs`);

      // Transform GitHub jobs to match our schema
      const transformedJobs = (response.data || []).map((job) => ({
        _id: job.id,
        title: job.title,
        description: job.description,
        company: job.company,
        companyLogo: job.company_logo || "",
        jobLocation: job.location,
        type: job.type || "Full-time",
        experience: 0,
        salary: null,
        workMode: "On-site",
        applicants: [],
        datePosted: new Date(job.created_at),
        externalJobId: job.id,
        sourceURL: job.url,
        source: "GitHub Jobs",
      }));

      return transformedJobs;
    } catch (apiError) {
      console.warn("GitHub Jobs API unavailable, using sample jobs:", apiError?.message);
      
      // Fallback to sample jobs
      const sampleJobs = SAMPLE_JOBS.map((job) => ({
        _id: job.id,
        title: job.title,
        description: job.description,
        company: job.company,
        companyLogo: job.company_logo,
        jobLocation: job.location,
        type: job.type,
        experience: 0,
        salary: null,
        workMode: "On-site",
        applicants: [],
        datePosted: new Date(job.created_at),
        externalJobId: job.id,
        sourceURL: job.url,
        source: "Sample Jobs",
      }));

      // Filter sample jobs by search term if provided
      if (filters.search?.trim()) {
        return sampleJobs.filter(job => 
          job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          job.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      return sampleJobs;
    }
  } catch (error) {
    console.error("Error fetching jobs:", {
      message: error?.message,
      code: error?.code,
    });
    
    // Return sample jobs as last resort
    return SAMPLE_JOBS.map((job) => ({
      _id: job.id,
      title: job.title,
      description: job.description,
      company: job.company,
      companyLogo: job.company_logo,
      jobLocation: job.location,
      type: job.type,
      experience: 0,
      salary: null,
      workMode: "On-site",
      applicants: [],
      datePosted: new Date(job.created_at),
      externalJobId: job.id,
      sourceURL: job.url,
      source: "Sample Jobs",
    }));
  }
};
