import React, { useState } from "react";
import { useSelector } from "react-redux";
import { userService } from "../../services/userService";

function ApplicationConfirm({ jobData, onClose, onSuccess }) {
  const userData = useSelector((state) => state.auth.userData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.userProfile?.phone || "",
    location: userData?.userProfile?.location || "",
    resume: userData?.userProfile?.resume || "",
    bio: userData?.userProfile?.bio || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const res = await userService.applyForJob(jobData._id, {
        coverLetter,
        profileData: editedData,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Application error:", error);
      alert(error.response?.data?.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center border-b">
          <div>
            <h2 className="text-2xl font-bold">{jobData.title}</h2>
            <p className="text-blue-100 text-sm mt-1">{jobData.company}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-2 rounded-full transition"
          >
            ✕
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Profile Information Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                📋 Your Profile Information
              </h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                {isEditing ? "✓ Done" : "✏️ Edit"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                    {editedData.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                    {editedData.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editedData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                    {editedData.phone || "Not provided"}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={editedData.location}
                    onChange={handleInputChange}
                    placeholder="Enter your location"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                    {editedData.location || "Not provided"}
                  </p>
                )}
              </div>

              {/* Resume */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resume URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="resume"
                    value={editedData.resume}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg break-all">
                    {editedData.resume || "Not provided"}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio / Professional Summary
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editedData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
                    {editedData.bio || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cover Letter Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              💌 Cover Letter (Optional)
            </h3>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a brief cover letter or message to the recruiter about why you're interested in this position..."
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              {coverLetter.length}/500 characters
            </p>
          </div>

          {/* Job Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Job Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Experience:</span>
                <p className="font-semibold text-gray-900">
                  {jobData.experience} years
                </p>
              </div>
              <div>
                <span className="text-gray-600">Job Type:</span>
                <p className="font-semibold text-gray-900">{jobData.type}</p>
              </div>
              <div>
                <span className="text-gray-600">Work Mode:</span>
                <p className="font-semibold text-gray-900">
                  {jobData.workMode}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-semibold text-gray-900">
                  {jobData.location}
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <input
              type="checkbox"
              id="confirm"
              defaultChecked
              className="mt-1"
            />
            <label htmlFor="confirm" className="text-sm text-gray-700">
              I confirm that the information provided is accurate and I wish to
              apply for this position. By clicking apply, I authorize the
              recruiter to view my profile and contact me regarding this
              opportunity.
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitApplication}
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  Submit Application
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationConfirm;
