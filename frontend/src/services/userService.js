import { apiCall } from "./apiBase";

export const userService = {
  login,
  signup,
  logout,
  getCurrentUser,
  updateProfilePicture,
  updateUserProfile,
  addSkill,
  removeSkill,
  updateResume,
  saveJob,
  applyForJob,
  removeSavedJob,
  getPublicProfile,
  getApplicationHistory,
};

async function login(userData) {
  return apiCall("post", "/users/login", userData);
}

async function signup(userData) {
  return apiCall("post", "/users/signup", userData);
}

async function updateProfilePicture(file) {
  const formPayload = new FormData();
  formPayload.append("profilePicture", file);
  return apiCall("post", "/users/profile-picture", formPayload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

async function logout() {
  return apiCall("get", "/users/logout");
}

async function getCurrentUser() {
  const res = await apiCall("get", "/users/profile");
  // API returns { statusCode, data: {...user}, message, success }
  // We need to return just the user data
  return res.data;
}

async function updateUserProfile(data) {
  return apiCall("patch", "/users/profile/jobseeker", data);
}

async function addSkill(skill) {
  const res = await apiCall("post", "/users/add-skill", { skill });
  return res.data;
}

async function removeSkill(skill) {
  const res = await apiCall("delete", "/users/remove-skill", { skill });
  return res.data;
}

async function updateResume(resume) {
  const res = await apiCall("post", "/users/resume", { resume });
  return res.data;
}

async function saveJob(id) {
  const res = await apiCall("post", `/save/${id}`);
  return res.data;
}

async function applyForJob(id) {
  const res = await apiCall("post", `/apply/${id}`);
  return res.data;
}

async function removeSavedJob(jobId) {
  const res = await apiCall("delete", `/remove-saved-job/${jobId}`);
  return res.data;
}

async function getPublicProfile(id) {
  const res = await apiCall("get", `/users/public-profile/${id}`);
  return res.data;
}

async function getApplicationHistory() {
  const res = await apiCall("get", `/application-history`);
  return res.data;
}
