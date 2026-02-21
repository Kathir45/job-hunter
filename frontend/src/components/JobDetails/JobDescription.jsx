import React from "react";
import styles from "./JobDescription.module.css";

function JobDescription({ jobData }) {
  const {
    description,
    skills,
    responsibilities,
    requirements,
    benefits,
    education,
    type,
    workMode,
    applicationDeadline,
    additionalRequirements,
    urgent,
  } = jobData;

  const formatDate = (date) => {
    if (!date) return "Not specified";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 mb-10">
      {/* Job Overview */}
      <div className="border p-5 rounded-3xl shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              <i className="fa-solid fa-briefcase mr-2 text-blue-600"></i>Job
              Type
            </h4>
            <p className="text-base font-semibold text-gray-800">{type || "Full-time"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              <i className="fa-solid fa-map-location-dot mr-2 text-blue-600"></i>Work Mode
            </h4>
            <p className="text-base font-semibold text-gray-800">{workMode || "Onsite"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              <i className="fa-solid fa-graduation-cap mr-2 text-blue-600"></i>Education
            </h4>
            <p className="text-base font-semibold text-gray-800">
              {education || "Any graduation"}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              <i className="fa-solid fa-calendar-check mr-2 text-blue-600"></i>Application Deadline
            </h4>
            <p className="text-base font-semibold text-gray-800">
              {formatDate(applicationDeadline)}
            </p>
          </div>
          {urgent && (
            <div className="md:col-span-2">
              <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                <i className="fa-solid fa-fire mr-2"></i>
                Urgent Hiring
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="border p-5 rounded-3xl shadow">
        <h3 className="font-bold text-lg mb-3 text-gray-800">
          <i className="fa-solid fa-file-lines mr-2 text-blue-600"></i>Job Description
        </h3>
        <div
          className={styles.descriptionContainer}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      {/* Responsibilities */}
      {responsibilities && responsibilities.length > 0 && (
        <div className="border p-5 rounded-3xl shadow">
          <h3 className="font-bold text-lg mb-3 text-gray-800">
            <i className="fa-solid fa-list-check mr-2 text-blue-600"></i>
            Key Responsibilities
          </h3>
          <ul className="space-y-2">
            {responsibilities.map((responsibility, index) => (
              <li key={index} className="flex gap-3 text-gray-700">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirements */}
      {requirements && requirements.length > 0 && (
        <div className="border p-5 rounded-3xl shadow">
          <h3 className="font-bold text-lg mb-3 text-gray-800">
            <i className="fa-solid fa-star mr-2 text-blue-600"></i>
            Required Qualifications
          </h3>
          <ul className="space-y-2">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex gap-3 text-gray-700">
                <span className="text-blue-600 font-bold mt-1">✓</span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Skills */}
      {skills && skills.length > 0 && (
        <div className="border p-5 rounded-3xl shadow">
          <h3 className="font-bold text-lg mb-3 text-gray-800">
            <i className="fa-solid fa-code mr-2 text-blue-600"></i>Key Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                className="text-sm bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 shadow-sm font-medium hover:scale-105 transition-transform hover:cursor-pointer"
                key={index}
              >
                <i className="fa-solid fa-check-circle mr-1"></i>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {benefits && benefits.length > 0 && (
        <div className="border p-5 rounded-3xl shadow">
          <h3 className="font-bold text-lg mb-3 text-gray-800">
            <i className="fa-solid fa-gift mr-2 text-green-600"></i>Benefits & Perks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <span className="text-green-600 text-lg">
                  <i className="fa-solid fa-check-circle"></i>
                </span>
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Requirements */}
      {additionalRequirements && (
        <div className="border p-5 rounded-3xl shadow bg-amber-50 border-amber-200">
          <h3 className="font-bold text-lg mb-2 text-amber-900">
            <i className="fa-solid fa-info-circle mr-2 text-amber-600"></i>
            Additional Information
          </h3>
          <p className="text-gray-700">{additionalRequirements}</p>
        </div>
      )}
    </div>
  );
}

export default JobDescription;
