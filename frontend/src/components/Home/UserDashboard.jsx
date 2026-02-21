import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { contentService } from "../../services/contentService";

function UserDashboard() {
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    savedJobs: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const jobsResponse = await contentService.getJobs({ limit: 1 });
        setStats((prev) => ({
          ...prev,
          totalJobs: jobsResponse.data.totalJobs || 0,
        }));
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  const userRole = userData?.role;
  const isJobSeeker = userRole === "jobSeeker";
  const isRecruiter = userRole === "employer";

  if (isRecruiter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Recruiter Header */}
          <div className="mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              Recruiter Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Welcome back, {userData?.name}
            </p>
          </div>

          {/* Recruiter Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                    Active Job Postings
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {userData?.userProfile?.jobListings?.length || 0}
                  </p>
                </div>
                <div className="text-5xl">📝</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                    Total Applications
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {userData?.userProfile?.applications?.length || 0}
                  </p>
                </div>
                <div className="text-5xl">📋</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                    Total Jobs Available
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {stats.totalJobs}
                  </p>
                </div>
                <div className="text-5xl">🌐</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate("/post-job")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-6 px-8 rounded-xl transition duration-200 text-lg shadow-lg"
            >
              + Post New Job
            </button>
            <button
              onClick={() => navigate("/company-dashboard")}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-6 px-8 rounded-xl transition duration-200 text-lg shadow-lg"
            >
              📊 View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Job Seeker Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-100 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Job Seeker Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Your Job Search Hub
          </h1>
          <p className="text-xl text-gray-600">
            Hi {userData?.name}, ready to find your next role?
          </p>
        </div>

        {/* Job Seeker Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                  Total Jobs
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {stats.totalJobs}
                </p>
              </div>
              <div className="text-5xl">💼</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                  Saved Jobs
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {userData?.userProfile?.savedJobs?.length || 0}
                </p>
              </div>
              <div className="text-5xl">⭐</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                  Applications
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {userData?.userProfile?.appliedJobs?.length || 0}
                </p>
              </div>
              <div className="text-5xl">📤</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => navigate("/jobs")}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-6 px-8 rounded-xl transition duration-200 text-lg shadow-lg"
          >
            🔍 Browse All Jobs
          </button>
          <button
            onClick={() => navigate("/saved-jobs")}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-6 px-8 rounded-xl transition duration-200 text-lg shadow-lg"
          >
            ⭐ My Saved Jobs
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-blue-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">💡 Quick Tips</h3>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Complete your profile to increase visibility</li>
              <li>✓ Save jobs you're interested in</li>
              <li>✓ Apply to multiple positions</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">📊 Profile Strength</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: "65%" }}></div>
            </div>
            <p className="text-sm text-gray-600">65% Complete - Add more skills to improve</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
