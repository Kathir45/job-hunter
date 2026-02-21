import React from "react";
import { useSelector } from "react-redux";
import LogoSlider from "../components/Home/LogoSlider";
import JobSeekers from "../components/Home/JobSeekers";
import Hero from "../components/Home/Hero";
import HomeStats from "../components/Home/HomeStats";
import HomeRecruiters from "../components/Home/HomeRecruiters";
import Footer from "../components/Home/Footer";
import UserDashboard from "../components/Home/UserDashboard";

function Home() {
  const authStatus = useSelector((state) => state.auth.status);

  // Logged-in user view - personalized dashboard
  if (authStatus) {
    return (
      <div className="font-Poppins">
        <UserDashboard />
        <Footer />
      </div>
    );
  }

  // Non-logged-in user view - landing page
  return (
    <div className="font-Poppins justify-center items-center">
      <Hero />
      <HomeStats />
      <LogoSlider />
      <JobSeekers />
      <HomeRecruiters />
      <Footer />
    </div>
  );
}

export default Home;
