import React, { useState } from "react";
import Searchbar from "./Searchbar";
import SideBarFilter from "./SideBarFilter";
import JobCard from "./JobCard";
import { useEffect, useRef, useCallback } from "react";
import { contentService } from "../../services/contentService";
import { useNavigate } from "react-router-dom";

function MainJobSection() {
  const [filters, setFilters] = useState({
    jobTypes: [],
    salaryRange: {
      from: 0,
      to: 10000000000,
    },
    workMode: [],
    sortBy: "new", // "new" for new to old, "old" for old to new
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  
  // Infinite scroll state for Gemini jobs
  const [geminiPage, setGeminiPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreGemini, setHasMoreGemini] = useState(true);
  const jobsInitializedRef = useRef(false);
  const observerTarget = useRef(null);

  const getJobs = async (filters) => {
    setLoading(true);
    try {
      const res = await contentService.getJobs(filters);
      if (res) {
        console.log("Jobs received:", res.jobs);
        setJobs(res.jobs);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // Load more Gemini jobs when scrolling
  const loadMoreGeminiJobs = useCallback(async () => {
    if (isLoadingMore || !hasMoreGemini) return;
    
    setIsLoadingMore(true);
    try {
      const res = await contentService.getGeminiJobs(geminiPage + 1, 10);
      if (res.jobs && res.jobs.length > 0) {
        setJobs((prevJobs) => [...prevJobs, ...res.jobs]);
        setGeminiPage((prevPage) => prevPage + 1);
        
        // Check if there are more jobs to load
        if (res.pagination && !res.pagination.hasMore) {
          setHasMoreGemini(false);
        }
      } else {
        setHasMoreGemini(false);
      }
    } catch (error) {
      console.error("Error loading more Gemini jobs:", error);
    }
    setIsLoadingMore(false);
  }, [geminiPage, isLoadingMore, hasMoreGemini]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreGemini && !isLoadingMore) {
          loadMoreGeminiJobs();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMoreGeminiJobs, hasMoreGemini, isLoadingMore]);

  useEffect(() => {
    console.log(selectedLocation);
    const debounceTimer = setTimeout(() => {
      // Only reset and fetch jobs when filters/search changes
      getJobs({ ...filters, search, location: selectedLocation });
      // Reset Gemini pagination when filters change
      setGeminiPage(1);
      setHasMoreGemini(true);
      jobsInitializedRef.current = true;
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters, search, selectedLocation]);

  // Load initial Gemini jobs on component mount
  useEffect(() => {
    if (!jobsInitializedRef.current) {
      getJobs({ ...filters, search, location: selectedLocation });
      jobsInitializedRef.current = true;
    }
  }, []);

  const redirectToDetail = (id) => {
    navigate(`/job/${id}`);
  };

  return (
    <div className="flex flex-col px-5 md:px-14 lg:px-5 gap-5 lg:flex-row">
      {/* Left */}
      <div className="border rounded-xl w-full lg:w-[30%] mlg:sticky top-0 lg:h-screen mb-3 hidden lg:block">
        <SideBarFilter filters={filters} setFilters={setFilters} />
      </div>

      {/* Right */}
      <div className=" rounded-xl w-full lg:w-[70%] overflow-auto">
        <div>
          <Searchbar
            setSearch={setSearch}
            search={search}
            setSelectedLocation={setSelectedLocation}
          />
        </div>
        <div>
          <div className="text-gray-500 font-medium my-3 ml-1.5">
            <span>{jobs.length} Jobs results</span>
          </div>
          <div>
            {jobs.map((job) => (
              <JobCard
                key={job._id || job.id}
                job={job}
                redirectToDetail={redirectToDetail}
              />
            ))}
          </div>
          
          {/* Infinite scroll observer */}
          <div ref={observerTarget} className="py-8 text-center">
            {isLoadingMore && (
              <div className="text-gray-400">Loading more jobs...</div>
            )}
            {!hasMoreGemini && jobs.length > 0 && (
              <div className="text-gray-400">No more jobs to load</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainJobSection;
