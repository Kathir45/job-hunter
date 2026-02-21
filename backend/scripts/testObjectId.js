// Simple test to see if _id is properly included in MongoDB queries
// This just shows what MongoDB would return

const mockJob = {
  _id: "507f1f77bcf86cd799439011",
  title: "Test Job",
  description: "A test job description",
  company: "Test Company",
  location: "Remote"
};

// Test 1: Direct object
console.log("Test 1 - Direct object:");
console.log("job._id:", mockJob._id);
console.log("job.id:", mockJob.id);

// Test 2: Destructuring
console.log("\nTest 2 - Destructuring:");
const { _id, title, company } = mockJob;
console.log("Destructured _id:", _id);
console.log("Destructured title:", title);

// Test 3: Fallback
console.log("\nTest 3 - Fallback logic:");
const jobId = _id || mockJob.id;
console.log("jobId (should be _id):", jobId);

// Test 4: JSON.stringify with line by line
console.log("\nTest 4 - Full object stringify:");
console.log(JSON.stringify(mockJob, null, 2));

// Test 5: What happens if _id is missing
const jobWithoutId = {
  title: "Test Job",
  description: "A test job description"
};

console.log("\nTest 5 - Job without _id:");
console.log("jobWithoutId._id:", jobWithoutId._id);
const jobId2 = jobWithoutId._id || jobWithoutId.id;
console.log("jobId2 (should be undefined):", jobId2);
