import React, { useState } from "react";
import { userService } from "../../services/userService";
import Dialogbox from "../Dialogbox";
import ApplicationConfirm from "./ApplicationConfirm";
import { useSelector } from "react-redux";
import { getCompanyName, getCompanyLogo } from "../../utils/companyUtils";

function JobDetailsCard({ jobData }) {
  const { status, userData } = useSelector((store) => store.auth);

  // Check if user has already applied for this job
  const hasApplied = jobData.applicants && userData?.userProfile?._id
    ? jobData.applicants.some(
        (applicant) => 
          (typeof applicant === 'string' ? applicant : applicant._id) === userData.userProfile._id
      )
    : false;

  const {
    title,
    salaryRange,
    location,
    employer,
    experience,
    numberOfOpenings,
    numberOfApplicants,
    sourceURL,
    isGeminiGenerated,
    type,
    workMode,
    company,
    companyLogo,
    urgent,
  } = jobData;

  // Get company name and logo using utility function
  const companyName = getCompanyName(jobData, employer);
  const logoImage = getCompanyLogo(jobData, employer, companyName);

  const datePosted = new Date(jobData?.datePosted);
  const now = new Date();
  
  let timeAgo = "Recently posted";
  
  if (jobData?.datePosted && !isNaN(datePosted.getTime())) {
    const diffTime = Math.abs(now - datePosted);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));

    if (diffMinutes < 60) {
      timeAgo = diffMinutes + " minutes ago";
    } else if (diffHours < 24) {
      timeAgo = diffHours + " hours ago";
    } else if (diffDays < 30) {
      timeAgo = diffDays + " days ago";
    } else if (diffMonths > 0) {
      timeAgo = diffMonths + " months ago";
    }
  }

  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    buttonText: "",
  });
  const [saving, setSaving] = useState(false);
  const saveJob = async () => {
    setSaving(true);
    try {
      const res = await userService.saveJob(jobData._id);
      setDialog({
        isOpen: true,
        title: "Job Saved Successfully",
        message:
          "The job has been saved successfully. You can view it in your saved jobs.",
        buttonText: "Got it!",
      });
    } catch (error) {
      if (error.response.data.message === "Job is already saved") {
        setDialog({
          isOpen: true,
          title: "Job Already Saved",
          message:
            "You have already saved this job. Please check your saved jobs.",
          buttonText: "Okay",
        });
      } else {
        setDialog({
          isOpen: true,
          title: "Error Saving Job",
          message: error.response.data.message,
          buttonText: "Okay",
        });
      }
    }
    setSaving(false);
  };

  const [applying, setApplying] = useState(false);
  const [showApplicationConfirm, setShowApplicationConfirm] = useState(false);
  const applyForJob = async () => {
    // For Gemini-generated jobs (real jobs), redirect to actual job posting
    if (isGeminiGenerated && sourceURL) {
      window.open(sourceURL, "_blank");
      return;
    }
    
    // Open confirmation modal for internal jobs
    setShowApplicationConfirm(true);
  };

  const handleApplicationSuccess = async () => {
    setApplying(true);
    try {
      setDialog({
        isOpen: true,
        title: "Job Application Successful",
        message:
          "Your application has been submitted successfully. Your profile has been shared with the recruiter.",
        buttonText: "Got it!",
      });
    } catch (error) {
      console.error("Error:", error);
    }
    setApplying(false);
  };

  return (
    <div className="flex flex-col gap-6 border p-4 rounded-3xl shadow">
      <div className="flex justify-between border-b pb-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <p className="text-xl font-medium">{title} </p>
            <p className="text-sm text-gray-600 font-medium">
              {companyName}
            </p>
          </div>
          <div className="text-gray-500 text-sm flex flex-col gap-3">
            <div className="flex gap-5 flex-wrap">
              <div className="flex gap-3">
                <span>
                  <i className="fa-solid fa-briefcase"></i>
                </span>
                <span>{`${experience || 0} Years`}</span>
              </div>
              <div className="flex gap-3">
                <span>
                  <i className="fa-solid fa-indian-rupee-sign"></i>{" "}
                </span>
                <span>
                  {salaryRange
                    ? `${salaryRange.from} to ${salaryRange.to}`
                    : "Not Disclosed"}
                </span>
              </div>
              <div className="flex gap-3">
                <span>
                  <i className="fa-solid fa-clock"></i>
                </span>
                <span>{type || "Full-time"}</span>
              </div>
              <div className="flex gap-3">
                <span>
                  <i className="fa-solid fa-location-dot"></i>
                </span>
                <span>{workMode || "Onsite"}</span>
              </div>
            </div>
            <div>
              <div className="flex gap-3">
                <span>
                  <i className="fa-solid fa-map-pin"></i>{" "}
                </span>
                <span>{location}</span>
              </div>
            </div>
            {urgent && (
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full w-fit">
                <i className="fa-solid fa-fire"></i>
                <span className="text-xs font-semibold">Urgent Hiring</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="h-20 w-20 rounded-3xl border overflow-hidden flex justify-center items-center bg-gray-100">
            <img 
              src={logoImage} 
              alt={companyName}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <div className="flex gap-3 ">
          <div className="font-light">
            Posted: <span className="font-medium"> {timeAgo}</span>
          </div>
          <div className="font-light">
            Openings: <span className="font-medium">{numberOfOpenings}</span>
          </div>
          <div className="font-light">
            Applicants:{" "}
            <span className="font-medium">{numberOfApplicants}</span>
          </div>
        </div>
        <div className="flex gap-5">
          <button
            className={`border h-10 px-4 rounded-3xl font-medium flex items-center justify-center gap-2 transition-all ${
              userData?.role === "jobSeeker"
                ? "border-green-600 text-green-600 hover:bg-green-50"
                : "border-gray-600 text-gray-600 cursor-not-allowed"
            }`}
            onClick={saveJob}
            disabled={userData?.role !== "jobSeeker"}
            title={
              !userData
                ? "Please login to save job"
                : userData.userProfile.role === "employer"
                ? "Employers are not allowed to save jobs"
                : ""
            }
          >
            {saving ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fa-solid fa-bookmark"></i>
                Save
              </>
            )}
          </button>
          <button
            className={`h-10 px-4 rounded-3xl font-medium flex items-center justify-center gap-2 transition-all ${
              hasApplied
                ? "bg-gray-400 text-white cursor-not-allowed"
                : userData?.role === "jobSeeker"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-600 text-white cursor-not-allowed"
            }`}
            onClick={applyForJob}
            disabled={hasApplied || userData?.role !== "jobSeeker"}
            title={
              hasApplied
                ? "You have already applied for this job"
                : !userData
                ? "Please login to apply job"
                : userData.userProfile.role === "employer"
                ? "Employers are not allowed to apply"
                : ""
            }
          >
            {applying ? (
              <>
                <i className="fa-solid fa-spinner animate-spin"></i>
                Applying...
              </>
            ) : hasApplied ? (
              <>
                <i className="fa-solid fa-check-circle"></i>
                Applied
              </>
            ) : isGeminiGenerated ? (
              <>
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                Apply Now
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane"></i>
                Apply
              </>
            )}
          </button>
        </div>
        <Dialogbox
          isOpen={dialog.isOpen}
          setIsOpen={(isOpen) => setDialog({ ...dialog, isOpen })}
          title={dialog.title}
          message={dialog.message}
          buttonText={dialog.buttonText}
        />
        {showApplicationConfirm && (
          <ApplicationConfirm
            jobData={jobData}
            onClose={() => setShowApplicationConfirm(false)}
            onSuccess={handleApplicationSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default JobDetailsCard;
