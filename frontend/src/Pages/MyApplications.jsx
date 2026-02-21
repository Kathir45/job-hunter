import { useEffect, useState } from "react";
import { userService } from "../services/userService";
import { useNavigate } from "react-router-dom";
import DisclaimerBanner from "../components/Common/DisclaimerBanner";
import { getCompanyName, getCompanyLogo } from "../utils/companyUtils";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, expired
  const [sortBy, setSortBy] = useState("recent"); // recent, oldest, salary-high, salary-low
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, filter, sortBy]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await userService.getApplicationHistory();
      const allApps = [
        ...data.activeApplications.map((job) => ({ ...job, status: "applied" })),
        ...data.expiredApplications.map((job) => ({ ...job, status: "expired" })),
      ];
      setApplications(allApps);
    } catch (err) {
      setError(err.message || "Failed to fetch applications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortApplications = () => {
    let filtered = [...applications];

    // Filter
    if (filter === "pending") {
      filtered = filtered.filter((app) => app.status === "applied");
    } else if (filter === "expired") {
      filtered = filtered.filter((app) => app.status === "expired");
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.createdAt || b.datePosted) -
            new Date(a.createdAt || a.datePosted)
          );
        case "oldest":
          return (
            new Date(a.createdAt || a.datePosted) -
            new Date(b.createdAt || b.datePosted)
          );
        case "salary-high":
          return (b.salaryRange?.to || 0) - (a.salaryRange?.to || 0);
        case "salary-low":
          return (a.salaryRange?.from || 0) - (b.salaryRange?.from || 0);
        default:
          return 0;
      }
    });

    setFilteredApplications(filtered);
  };

  const getStatusBadge = (status) => {
    if (status === "expired") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          <i className="fa-solid fa-circle-xmark"></i>
          Application Expired
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        <i className="fa-solid fa-check-circle"></i>
        Applied
      </span>
    );
  };

  const ApplicationCard = ({ application }) => {
    const companyName = getCompanyName(application, application.employer);
    const companyLogo = getCompanyLogo(application, application.employer, companyName);

    const applicationDate = new Date(application.createdAt || application.datePosted);
    const today = new Date();
    let timeAgo = "Recently applied";

    if (application.createdAt && !isNaN(applicationDate.getTime())) {
      const diffTime = Math.abs(today - applicationDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

      if (diffHours < 1) {
        timeAgo = "Just now";
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} hours ago`;
      } else if (diffDays < 30) {
        timeAgo = `${diffDays} days ago`;
      } else {
        timeAgo = applicationDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    }

    const deadline = new Date(application.applicationDeadline || application.deadline);
    const isDeadlineSoon =
      !isNaN(deadline.getTime()) && deadline - today < 7 * 24 * 60 * 60 * 1000;

    return (
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200">
        {/* Card Header with Status */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-300 flex items-center justify-center">
                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{application.title}</h3>
                <p className="text-sm text-gray-600 font-medium">{companyName}</p>
              </div>
            </div>
            {getStatusBadge(application.status)}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          {/* Key Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">
                <i className="fa-solid fa-location-dot mr-1 text-blue-600"></i>Location
              </p>
              <p className="text-sm font-semibold text-gray-800">{application.location}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">
                <i className="fa-solid fa-briefcase mr-1 text-blue-600"></i>Type
              </p>
              <p className="text-sm font-semibold text-gray-800">{application.type || "Full-time"}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">
                <i className="fa-solid fa-indian-rupee-sign mr-1 text-green-600"></i>Salary
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {application.salaryRange
                  ? `${application.salaryRange.from} - ${application.salaryRange.to}`
                  : "Not disclosed"}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-1">
                <i className="fa-solid fa-clock mr-1 text-purple-600"></i>Experience
              </p>
              <p className="text-sm font-semibold text-gray-800">{application.experience || 0}+ yrs</p>
            </div>
          </div>

          {/* Application Timeline */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-gray-600 font-medium">
                  <i className="fa-solid fa-paper-plane mr-2 text-blue-600"></i>Applied {timeAgo}
                </p>
              </div>
              {application.applicationDeadline || application.deadline ? (
                <div
                  className={`text-right ${
                    isDeadlineSoon ? "text-red-600 font-semibold" : "text-gray-600"
                  }`}
                >
                  <p className="font-medium">
                    <i
                      className={`fa-solid fa-calendar-days mr-1 ${
                        isDeadlineSoon ? "text-red-600" : "text-orange-600"
                      }`}
                    ></i>
                    Deadline:{" "}
                    {new Date(application.applicationDeadline || application.deadline).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </p>
                  {isDeadlineSoon && (
                    <p className="text-xs text-red-600 mt-1">⚠️ Deadline approaching!</p>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* Skills Preview */}
          {application.skills && application.skills.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-2">
                {application.skills.slice(0, 4).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {application.skills.length > 4 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                    +{application.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 border-t border-gray-200">
            <button
              onClick={() => navigate(`/job/${application._id}`)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-eye"></i>
              View Details
            </button>
            <button
              onClick={() =>
                alert(
                  "Share your profile with recruiter functionality can be added here"
                )
              }
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-share"></i>
              Share Profile
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mt-16">
        <DisclaimerBanner />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 min-h-screen bg-gray-50">
      <DisclaimerBanner />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Applications</h1>
          <p className="text-gray-600">Track and manage all your job applications in one place</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-medium">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              {error}
            </p>
          </div>
        )}

        {/* Stats Overview */}
        {applications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-800">{applications.length}</p>
                </div>
                <i className="fa-solid fa-file-contract text-blue-600 text-3xl opacity-20"></i>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Active Applications</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {applications.filter((a) => a.status === "applied").length}
                  </p>
                </div>
                <i className="fa-solid fa-check-circle text-green-600 text-3xl opacity-20"></i>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Expired Applications</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {applications.filter((a) => a.status === "expired").length}
                  </p>
                </div>
                <i className="fa-solid fa-circle-xmark text-red-600 text-3xl opacity-20"></i>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Average Salary</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {applications.length > 0
                      ? (
                          applications.reduce(
                            (sum, app) => sum + (app.salaryRange?.to || 0),
                            0
                          ) / applications.length
                        )
                          .toFixed(0)
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : "N/A"}
                  </p>
                </div>
                <i className="fa-solid fa-money-bill-wave text-purple-600 text-3xl opacity-20"></i>
              </div>
            </div>
          </div>
        )}

        {/* Filter and Sort Controls */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fa-solid fa-filter mr-2 text-blue-600"></i>Filter Applications
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
              >
                <option value="all">All Applications</option>
                <option value="pending">Active Applications</option>
                <option value="expired">Expired Applications</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fa-solid fa-sort mr-2 text-blue-600"></i>Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="salary-high">Highest Salary</option>
                <option value="salary-low">Lowest Salary</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border-2 border-dashed border-gray-300">
            <i className="fa-solid fa-inbox text-6xl text-gray-300 mb-4 block"></i>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">No Applications Yet</h3>
            <p className="text-gray-500 mb-6">
              {filter === "all"
                ? "Start applying to jobs to track them here!"
                : `No ${filter} applications found.`}
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
              Browse Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
