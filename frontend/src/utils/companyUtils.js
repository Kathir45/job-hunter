// Fallback company names for when actual company data is not available
const fallbackCompanyNames = [
  "TechVision Corp",
  "CloudNet Solutions",
  "DataFlow Systems",
  "InnovateTech",
  "DigitalPulse",
  "ByteForce Inc",
  "CodeStream Labs",
  "PixelWorks",
  "VelocityTech",
  "NexGen Software",
  "PrimeCode Solutions",
  "ApexTech",
  "ZenithSoft",
  "OmegaDev",
  "AscendTech",
  "QuantumLeap",
  "NovaTech",
  "PulseWave",
  "FutureMind",
  "SynergyTech",
  "EchoSoft",
  "VortexCode",
  "PhoenixDev",
  "ZephyrTech",
  "LuminousTech",
  "VividCode",
  "ThriveTech",
  "SwiftSoft",
  "PrecisionCode",
  "BrightVision",
];

export const getRandomCompanyName = () => {
  return fallbackCompanyNames[Math.floor(Math.random() * fallbackCompanyNames.length)];
};

export const getCompanyName = (job, employerData) => {
  if (job.company && job.company !== "Unknown Company") {
    return job.company;
  }
  if (employerData?.userProfile?.companyName) {
    return employerData.userProfile.companyName;
  }
  return getRandomCompanyName();
};

export const getCompanyLogo = (job, employerData, companyName) => {
  if (job.companyLogo) {
    return job.companyLogo;
  }
  if (employerData?.userProfile?.companyLogo) {
    return employerData.userProfile.companyLogo;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=random&size=100&bold=true`;
};
