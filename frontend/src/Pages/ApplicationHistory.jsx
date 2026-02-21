import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { getCompanyName, getCompanyLogo } from "../utils/companyUtils";

const ApplicationHistory = () => {
  const [applicationHistory, setApplicationHistory] = useState({
    activeApplications: [],
    expiredApplications: [],
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExpired, setShowExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicationHistory();
  }, []);

  const fetchApplicationHistory = async () => {
    try {
      setLoading(true);
      const data = await userService.getApplicationHistory();
      setApplicationHistory(data);
    } catch (err) {
      setError(err.message || "Failed to fetch application history");
    } finally {
      setLoading(false);
    }
  };

  const JobCard = ({ job, isExpired = false }) => {
    const companyName = getCompanyName(job, job.employer);
    const companyLogo = getCompanyLogo(job, job.employer, companyName);
    
    return (
      <div
        className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer ${
          isExpired ? "opacity-75 border-l-4 border-red-500" : ""
        }`}
        onClick={() => navigate(`/jobs/${job._id}`)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {companyLogo && (
              <img
                src={companyLogo}
                alt={companyName}
                className="w-12 h-12 rounded-md object-cover"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
              <p className="text-gray-600">{companyName}</p>
            </div>
          </div>
          {isExpired && (
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              Expired
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{job.type}</span>
          </div>
          {job.salaryRange?.from && (
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                ${job.salaryRange.from.toLocaleString()} - $
                {job.salaryRange.to.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Applied: {new Date(job.datePosted).toLocaleDateString()}</span>
            {job.deadline && (
              <span className={isExpired ? "text-red-600 font-semibold" : ""}>
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Application History</h1>
        <p className="text-gray-600">
          Total Applications: {applicationHistory.totalApplications}
        </p>
      </div>

      {/* Toggle between active and expired */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowExpired(false)}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            !showExpired
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Active Applications ({applicationHistory.activeApplications.length})
        </button>
        <button
          onClick={() => setShowExpired(true)}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            showExpired
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Expired Applications ({applicationHistory.expiredApplications.length})
        </button>
      </div>

      {/* Job listings */}
      <div className="grid gap-4">
        {!showExpired ? (
          applicationHistory.activeApplications.length > 0 ? (
            applicationHistory.activeApplications.map((job) => (
              <JobCard key={job._id} job={job} />
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">No active applications found</p>
            </div>
          )
        ) : applicationHistory.expiredApplications.length > 0 ? (
          applicationHistory.expiredApplications.map((job) => (
            <JobCard key={job._id} job={job} isExpired={true} />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No expired applications found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationHistory;
